/**
 * Animation utilities for enhanced user interactions
 * Provides smooth, engaging animations for the achievements section
 */

import { Animated, Easing } from 'react-native';

export class AnimationUtils {
  /**
   * Create a spring animation for achievement card interactions
   */
  static createSpringAnimation(
    animatedValue: Animated.Value,
    toValue: number,
    config?: {
      tension?: number;
      friction?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    return Animated.spring(animatedValue, {
      toValue,
      tension: config?.tension || 100,
      friction: config?.friction || 8,
      useNativeDriver: config?.useNativeDriver ?? true,
    });
  }

  /**
   * Create a bounce animation sequence for achievement unlock
   */
  static createBounceSequence(
    animatedValue: Animated.Value,
    config?: {
      scale?: number;
      duration?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const scale = config?.scale || 1.1;
    const duration = config?.duration || 150;
    const useNativeDriver = config?.useNativeDriver ?? true;

    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: duration / 2,
        easing: Easing.out(Easing.quad),
        useNativeDriver,
      }),
      Animated.timing(animatedValue, {
        toValue: scale,
        duration: duration,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.out(Easing.quad),
        useNativeDriver,
      }),
    ]);
  }

  /**
   * Create a fade in animation with optional slide
   */
  static createFadeInAnimation(
    animatedValue: Animated.Value,
    config?: {
      duration?: number;
      delay?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const duration = config?.duration || 300;
    const delay = config?.delay || 0;
    const useNativeDriver = config?.useNativeDriver ?? true;

    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver,
    });
  }

  /**
   * Create a scale pulse animation for highlighting
   */
  static createPulseAnimation(
    animatedValue: Animated.Value,
    config?: {
      scale?: number;
      duration?: number;
      iterations?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const scale = config?.scale || 1.05;
    const duration = config?.duration || 800;
    const iterations = config?.iterations || 1;
    const useNativeDriver = config?.useNativeDriver ?? true;

    const pulseSequence = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: scale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver,
      }),
    ]);

    return iterations === -1 
      ? Animated.loop(pulseSequence)
      : Animated.loop(pulseSequence, { iterations });
  }

  /**
   * Create a shimmer effect animation for loading states
   */
  static createShimmerAnimation(
    animatedValue: Animated.Value,
    config?: {
      duration?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const duration = config?.duration || 1500;
    const useNativeDriver = config?.useNativeDriver ?? true;

    const shimmerSequence = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver,
      }),
    ]);

    return Animated.loop(shimmerSequence);
  }

  /**
   * Create a parallax scrolling effect
   */
  static createParallaxAnimation(
    scrollY: Animated.Value,
    config?: {
      factor?: number;
      range?: [number, number];
    }
  ): Animated.AnimatedInterpolation<number> {
    const factor = config?.factor || 0.5;
    const [inputStart = 0, inputEnd = 100] = config?.range || [];

    return scrollY.interpolate({
      inputRange: [inputStart, inputEnd],
      outputRange: [0, (inputEnd - inputStart) * factor],
      extrapolate: 'clamp',
    });
  }

  /**
   * Create a staggered animation for multiple elements
   */
  static createStaggeredAnimation(
    animatedValues: Animated.Value[],
    config?: {
      staggerDelay?: number;
      duration?: number;
      toValue?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const staggerDelay = config?.staggerDelay || 100;
    const duration = config?.duration || 300;
    const toValue = config?.toValue || 1;
    const useNativeDriver = config?.useNativeDriver ?? true;

    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue,
        duration,
        delay: index * staggerDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      })
    );

    return Animated.parallel(animations);
  }

  /**
   * Create a progress bar fill animation
   */
  static createProgressAnimation(
    animatedValue: Animated.Value,
    targetProgress: number,
    config?: {
      duration?: number;
      easing?: (value: number) => number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const duration = config?.duration || 1000;
    const easing = config?.easing || Easing.out(Easing.cubic);
    const useNativeDriver = config?.useNativeDriver ?? false; // Layout animations need false

    return Animated.timing(animatedValue, {
      toValue: targetProgress,
      duration,
      easing,
      useNativeDriver,
    });
  }

  /**
   * Create a rotation animation
   */
  static createRotationAnimation(
    animatedValue: Animated.Value,
    config?: {
      degrees?: number;
      duration?: number;
      iterations?: number;
      useNativeDriver?: boolean;
    }
  ): Animated.CompositeAnimation {
    const degrees = config?.degrees || 360;
    const duration = config?.duration || 1000;
    const iterations = config?.iterations || 1;
    const useNativeDriver = config?.useNativeDriver ?? true;

    const rotationAnimation = Animated.timing(animatedValue, {
      toValue: degrees,
      duration,
      easing: Easing.linear,
      useNativeDriver,
    });

    return iterations === -1 
      ? Animated.loop(rotationAnimation)
      : Animated.loop(rotationAnimation, { iterations });
  }
}

// Predefined animation presets
export const animationPresets = {
  // Achievement card interactions
  achievementTap: (animatedValue: Animated.Value) =>
    AnimationUtils.createBounceSequence(animatedValue, { scale: 1.05 }),
  
  achievementUnlock: (animatedValue: Animated.Value) =>
    AnimationUtils.createBounceSequence(animatedValue, { scale: 1.2, duration: 200 }),
  
  // UI feedback animations
  buttonPress: (animatedValue: Animated.Value) =>
    AnimationUtils.createSpringAnimation(animatedValue, 0.95),
  
  buttonRelease: (animatedValue: Animated.Value) =>
    AnimationUtils.createSpringAnimation(animatedValue, 1),
  
  // Progress animations
  progressFill: (animatedValue: Animated.Value, progress: number) =>
    AnimationUtils.createProgressAnimation(animatedValue, progress, { duration: 800 }),
  
  // Loading states
  shimmer: (animatedValue: Animated.Value) =>
    AnimationUtils.createShimmerAnimation(animatedValue),
  
  pulse: (animatedValue: Animated.Value) =>
    AnimationUtils.createPulseAnimation(animatedValue, { iterations: -1 }),
};

export default AnimationUtils;
