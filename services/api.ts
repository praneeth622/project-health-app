import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'https://health-app-backend-production-0d07.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Ensure headers exist and set Authorization
        if (!config.headers) {
          config.headers = {} as any;
        }
        config.headers.Authorization = `Bearer ${session.access_token}`;
        console.log('✅ Adding auth token to request:', session.access_token.substring(0, 20) + '...');
        console.log('🔍 Request URL:', config.url);
        console.log('🔍 Request method:', config.method?.toUpperCase());
      } else {
        console.warn('⚠️ No auth token available for request');
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response successful:', response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ API Error details:');
    console.error('  URL:', originalRequest?.url);
    console.error('  Method:', originalRequest?.method?.toUpperCase());
    console.error('  Status:', error.response?.status);
    console.error('  Response data:', error.response?.data);
    console.error('  Headers sent:', originalRequest?.headers);
    
    // If we get a 401 and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh for 401 error...');
      originalRequest._retry = true;
      
      try {
        // Try to refresh the session
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          throw refreshError;
        }
        
        if (session?.access_token) {
          console.log('✅ Token refreshed successfully');
          // Update the authorization header and retry
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers['Authorization'] = `Bearer ${session.access_token}`;
          console.log('🔄 Retrying original request with new token...');
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Clear session and redirect to login
        await supabase.auth.signOut();
      }
    }
    
    console.error('❌ Final API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;

// Group Management Types and Interfaces
export type GroupVisibility = 'public' | 'private' | 'invite_only'; // Updated to match backend
export type GroupCategory = 'fitness' | 'nutrition' | 'mental_health' | 'weight_loss' | 'muscle_building' | 'running' | 'yoga' | 'general'; // Updated to match backend
export type MemberRole = 'admin' | 'moderator' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  type: GroupVisibility; // Backend uses 'type' instead of 'visibility'
  image_url?: string; // Backend uses 'image_url' instead of 'cover_image'
  location?: string;
  rules?: string;
  tags?: string[];
  member_count: number;
  max_members?: number;
  admin_id?: string;
  is_active: boolean;
  is_featured?: boolean;
  owner?: {
    id: string;
    name: string;
    profile_image?: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  is_active: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    is_online?: boolean;
    last_active?: string;
  };
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  category: GroupCategory;
  visibility: GroupVisibility;
  location?: string;
  rules?: string;
  tags?: string[];
  cover_image?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  category?: GroupCategory;
  visibility?: GroupVisibility;
  location?: string;
  rules?: string;
  tags?: string[];
  cover_image?: string;
}

export interface GroupFilters {
  category?: GroupCategory;
  visibility?: GroupVisibility;
  search?: string;
  location?: string;
  tags?: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  groups?: T[]; // Backend uses 'groups' for group endpoints
  data?: T[]; // Generic data array for other endpoints
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Group API Service
export class GroupsAPI {
  /**
   * Create a new group
   * POST /groups
   */
  static async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    try {
      console.log('🔄 Creating new group:', groupData.name);
      const response = await apiClient.post('/groups', groupData);
      console.log('✅ Group created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating group:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create group');
    }
  }

  /**
   * Get all groups with filtering and pagination
   * GET /groups
   */
  static async getGroups(
    filters?: GroupFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Group>> {
    try {
      console.log('🔄 Fetching groups with filters:', filters);
      
      const params = new URLSearchParams();
      
      // Add filters
      if (filters?.category) params.append('category', filters.category);
      if (filters?.visibility) params.append('type', filters.visibility); // Backend uses 'type' parameter
      if (filters?.search) params.append('search', filters.search);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      
      // Add pagination
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/groups?${queryString}` : '/groups';
      
      const response = await apiClient.get(url);
      console.log('✅ Groups fetched successfully:', response.data);
      
      // Handle the new response structure from backend
      return {
        groups: response.data.groups || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 20,
        total_pages: response.data.total_pages || 1
      };
    } catch (error: any) {
      console.error('❌ Error fetching groups:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch groups');
    }
  }

  /**
   * Get group by ID
   * GET /groups/{id}
   */
  static async getGroupById(groupId: string): Promise<Group> {
    try {
      console.log('🔄 Fetching group by ID:', groupId);
      const response = await apiClient.get(`/groups/${groupId}`);
      console.log('✅ Group fetched successfully:', response.data.name);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching group:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch group');
    }
  }

  /**
   * Update group by ID
   * PATCH /groups/{id}
   */
  static async updateGroup(groupId: string, updateData: UpdateGroupRequest): Promise<Group> {
    try {
      console.log('🔄 Updating group:', groupId, updateData);
      const response = await apiClient.patch(`/groups/${groupId}`, updateData);
      console.log('✅ Group updated successfully:', response.data.name);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating group:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update group');
    }
  }

  /**
   * Delete (deactivate) group by ID
   * DELETE /groups/{id}
   */
  static async deleteGroup(groupId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Deleting group:', groupId);
      const response = await apiClient.delete(`/groups/${groupId}`);
      console.log('✅ Group deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error deleting group:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete group');
    }
  }

  /**
   * Join a group
   * POST /groups/{id}/join
   */
  static async joinGroup(groupId: string): Promise<GroupMember> {
    try {
      console.log('🔄 Joining group:', groupId);
      const response = await apiClient.post(`/groups/${groupId}/join`);
      console.log('✅ Successfully joined group');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error joining group:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to join group');
    }
  }

  /**
   * Leave a group
   * DELETE /groups/{id}/leave
   */
  static async leaveGroup(groupId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Leaving group:', groupId);
      const response = await apiClient.delete(`/groups/${groupId}/leave`);
      console.log('✅ Successfully left group');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error leaving group:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to leave group');
    }
  }

  /**
   * Get group members
   * GET /groups/{id}/members
   */
  static async getGroupMembers(
    groupId: string,
    pagination?: PaginationParams,
    role?: MemberRole
  ): Promise<PaginatedResponse<GroupMember>> {
    try {
      console.log('🔄 Fetching group members for group:', groupId);
      
      const params = new URLSearchParams();
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      if (role) params.append('role', role);
      
      const queryString = params.toString();
      const url = queryString ? `/groups/${groupId}/members?${queryString}` : `/groups/${groupId}/members`;
      
      const response = await apiClient.get(url);
      console.log('✅ Group members fetched successfully:', response.data.pagination);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching group members:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch group members');
    }
  }

  /**
   * Update member role (admin only)
   * PATCH /groups/{id}/members/{memberId}
   */
  static async updateMemberRole(
    groupId: string, 
    memberId: string, 
    newRole: MemberRole
  ): Promise<GroupMember> {
    try {
      console.log('🔄 Updating member role:', memberId, 'to', newRole);
      const response = await apiClient.patch(`/groups/${groupId}/members/${memberId}`, {
        role: newRole
      });
      console.log('✅ Member role updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating member role:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update member role');
    }
  }

  /**
   * Remove member from group (admin/moderator only)
   * DELETE /groups/{id}/members/{memberId}
   */
  static async removeMember(groupId: string, memberId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Removing member from group:', memberId);
      const response = await apiClient.delete(`/groups/${groupId}/members/${memberId}`);
      console.log('✅ Member removed successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error removing member:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to remove member');
    }
  }

  /**
   * Get user's groups
   * GET /groups/my-groups (or fallback to /groups with filtering)
   */
  static async getMyGroups(paginationParams?: PaginationParams): Promise<PaginatedResponse<Group & { my_role: MemberRole }>> {
    try {
      console.log('🔄 Fetching user groups');
      
      const params = new URLSearchParams();
      if (paginationParams?.page) params.append('page', paginationParams.page.toString());
      if (paginationParams?.limit) params.append('limit', paginationParams.limit.toString());
      
      const queryString = params.toString();
      
      // Try the dedicated my-groups endpoint first
      try {
        const url = queryString ? `/groups?${queryString}` : '/groups/my-groups';
        const response = await apiClient.get(url);
        console.log('✅ User groups fetched successfully from /groups/my-groups:', response.data);
        
        return {
          groups: response.data.groups || [],
          total: response.data.total || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 20,
          total_pages: response.data.total_pages || 1
        };
      } catch (endpointError: any) {
        // If the my-groups endpoint doesn't exist (404), try fallback
        if (endpointError.response?.status === 404) {
          console.log('🔄 /groups/my-groups not found, falling back to general /groups endpoint');
          
          // Fallback: use general groups endpoint (this might need backend support for user filtering)
          const fallbackParams = new URLSearchParams(params);
          fallbackParams.append('member', 'true'); // or whatever parameter the backend expects
          
          const fallbackUrl = `/groups?${fallbackParams.toString()}`;
          const fallbackResponse = await apiClient.get(fallbackUrl);
          console.log('✅ User groups fetched successfully from fallback:', fallbackResponse.data);
          
          return {
            groups: fallbackResponse.data.groups || [],
            total: fallbackResponse.data.total || 0,
            page: fallbackResponse.data.page || 1,
            limit: fallbackResponse.data.limit || 20,
            total_pages: fallbackResponse.data.total_pages || 1
          };
        }
        
        // Re-throw if it's not a 404
        throw endpointError;
      }
    } catch (error: any) {
      console.error('❌ Error fetching user groups:', error.response?.data || error.message);
      
      // Provide more specific error messages based on status code
      if (error.response?.status === 500) {
        throw new Error('Internal server error - the server is experiencing issues. Please try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required - please log in again');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden - insufficient permissions');
      } else if (error.response?.status === 404) {
        throw new Error('Groups endpoint not found - please update the app or contact support');
      } else if (!error.response) {
        throw new Error('Network error - please check your internet connection');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to fetch user groups');
    }
  }

  /**
   * Search groups
   * GET /groups/search
   */
  static async searchGroups(
    query: string,
    filters?: Omit<GroupFilters, 'search'>,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Group>> {
    try {
      console.log('🔄 Searching groups with query:', query);
      
      const params = new URLSearchParams();
      params.append('q', query);
      
      // Add filters
      if (filters?.category) params.append('category', filters.category);
      if (filters?.visibility) params.append('type', filters.visibility); // Backend uses 'type' parameter
      if (filters?.location) params.append('location', filters.location);
      if (filters?.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      
      // Add pagination
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      
      const response = await apiClient.get(`/groups/search?${params.toString()}`);
      console.log('✅ Groups search completed:', response.data.pagination);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error searching groups:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to search groups');
    }
  }

  /**
   * Get group statistics (admin only)
   * GET /groups/{id}/stats
   */
  static async getGroupStats(groupId: string): Promise<{
    member_count: number;
    active_members: number;
    posts_count: number;
    weekly_activity: number;
    growth_rate: number;
  }> {
    try {
      console.log('🔄 Fetching group stats for:', groupId);
      const response = await apiClient.get(`/groups/${groupId}/stats`);
      console.log('✅ Group stats fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching group stats:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch group stats');
    }
  }
}