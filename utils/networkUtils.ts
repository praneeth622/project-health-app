/**
 * Network utility functions for handling connectivity and offline states
 */

export interface NetworkStatus {
  isConnected: boolean;
  isServerReachable: boolean;
  lastChecked: Date;
}

export class NetworkUtils {
  private static networkStatus: NetworkStatus = {
    isConnected: true,
    isServerReachable: true,
    lastChecked: new Date(),
  };

  /**
   * Check if the server is reachable by making a simple health check
   */
  static async checkServerHealth(serverUrl: string): Promise<boolean> {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const fetchPromise = fetch(`${serverUrl}/health`, {
        method: 'GET',
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      const isHealthy = response.ok;
      this.networkStatus.isServerReachable = isHealthy;
      this.networkStatus.lastChecked = new Date();
      
      console.log(`🏥 Server health check: ${isHealthy ? 'Healthy' : 'Unhealthy'}`);
      return isHealthy;
    } catch (error) {
      console.warn('⚠️ Server health check failed:', error);
      this.networkStatus.isServerReachable = false;
      this.networkStatus.lastChecked = new Date();
      return false;
    }
  }

  /**
   * Get current network status
   */
  static getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  /**
   * Determine if we should use offline mode based on error type
   */
  static shouldUseOfflineMode(error: any): boolean {
    // Check for specific server error indicators
    const serverErrorIndicators = [
      'Internal server error',
      'Server is temporarily unavailable',
      '500',
      'ECONNREFUSED',
      'Network request failed',
      'timeout',
    ];

    const errorMessage = error?.message?.toLowerCase() || '';
    const errorStatus = error?.response?.status;

    // Use offline mode for server errors (5xx) but not client errors (4xx)
    if (errorStatus >= 500 && errorStatus < 600) {
      return true;
    }

    // Check error message for server-related issues
    return serverErrorIndicators.some(indicator => 
      errorMessage.includes(indicator.toLowerCase())
    );
  }

  /**
   * Format error message for user display
   */
  static formatErrorForUser(error: any): string {
    const errorMessage = error?.message || 'Unknown error';
    const errorStatus = error?.response?.status;

    switch (errorStatus) {
      case 401:
        return 'Please log in again to continue';
      case 403:
        return 'You don\'t have permission to access this';
      case 404:
        return 'The requested resource was not found';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server is temporarily unavailable. Please try again later.';
      default:
        if (errorMessage.toLowerCase().includes('network')) {
          return 'Please check your internet connection and try again';
        }
        return errorMessage;
    }
  }

  /**
   * Create a retry delay with exponential backoff
   */
  static getRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  }

  /**
   * Check if error is recoverable (worth retrying)
   */
  static isRecoverableError(error: any): boolean {
    const errorStatus = error?.response?.status;
    
    // Don't retry on client errors (4xx) except 408 (timeout) and 429 (rate limit)
    if (errorStatus >= 400 && errorStatus < 500) {
      return errorStatus === 408 || errorStatus === 429;
    }

    // Retry on server errors (5xx) and network errors
    return errorStatus >= 500 || !errorStatus;
  }

  /**
   * Execute a request with retry logic and offline fallback
   */
  static async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    fallbackData: T,
    maxRetries: number = 3
  ): Promise<{ data: T; isOffline: boolean; error?: string }> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await requestFn();
        return { data, isOffline: false };
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed:`, error);

        // If it's not a recoverable error, don't retry
        if (!this.isRecoverableError(error)) {
          break;
        }

        // If we've exhausted retries, break
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => 
          setTimeout(resolve, this.getRetryDelay(attempt))
        );
      }
    }

    // If we should use offline mode, return fallback data
    if (this.shouldUseOfflineMode(lastError)) {
      return {
        data: fallbackData,
        isOffline: true,
        error: this.formatErrorForUser(lastError)
      };
    }

    // Otherwise, throw the error
    throw lastError;
  }
}

export default NetworkUtils;
