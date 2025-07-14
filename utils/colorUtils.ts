/**
 * Color utilities for vibrant and modern UI design
 * Enhanced for the HealYou fitness app brand identity
 */

export interface AchievementColorScheme {
  primary: string;
  secondary: string;
  gradient: [string, string];
  shadow: string;
  text: string;
  accent: string;
}

// Brand-consistent achievement color schemes
export const achievementColorSchemes: Record<string, AchievementColorScheme> = {
  primary: {
    primary: '#2DD4BF',
    secondary: '#14B8A6',
    gradient: ['#2DD4BF', '#14B8A6'],
    shadow: '#2DD4BF',
    text: '#FFFFFF',
    accent: 'rgba(255, 255, 255, 0.2)'
  },
  success: {
    primary: '#10B981',
    secondary: '#059669',
    gradient: ['#10B981', '#059669'],
    shadow: '#10B981',
    text: '#FFFFFF',
    accent: 'rgba(255, 255, 255, 0.2)'
  },
  warning: {
    primary: '#F59E0B',
    secondary: '#D97706',
    gradient: ['#F59E0B', '#D97706'],
    shadow: '#F59E0B',
    text: '#FFFFFF',
    accent: 'rgba(255, 255, 255, 0.2)'
  },
  info: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    gradient: ['#3B82F6', '#2563EB'],
    shadow: '#3B82F6',
    text: '#FFFFFF',
    accent: 'rgba(255, 255, 255, 0.2)'
  },
  locked: {
    primary: '#E5E7EB',
    secondary: '#9CA3AF',
    gradient: ['#E5E7EB', '#9CA3AF'],
    shadow: '#9CA3AF',
    text: '#6B7280',
    accent: 'rgba(107, 114, 128, 0.1)'
  }
};

// Vibrant gradient presets for modern UI
export const vibrantGradients = {
  teal: ['#2DD4BF', '#14B8A6'],
  emerald: ['#10B981', '#059669'],
  blue: ['#3B82F6', '#2563EB'],
  indigo: ['#6366F1', '#4F46E5'],
  purple: ['#8B5CF6', '#7C3AED'],
  pink: ['#EC4899', '#DB2777'],
  rose: ['#F43F5E', '#E11D48'],
  orange: ['#F97316', '#EA580C'],
  amber: ['#F59E0B', '#D97706'],
  lime: ['#84CC16', '#65A30D']
} as const;

// Shadow configurations for depth and visual hierarchy
export const shadowPresets = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
  },
  strong: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8
  },
  vibrant: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12
  })
};

// Opacity utilities for glassmorphism effects
export const glassEffects = {
  light: 'rgba(255, 255, 255, 0.1)',
  medium: 'rgba(255, 255, 255, 0.2)',
  strong: 'rgba(255, 255, 255, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.1)'
};

// Interactive state colors
export const interactionStates = {
  hover: (baseColor: string) => `${baseColor}E6`, // 90% opacity
  pressed: (baseColor: string) => `${baseColor}CC`, // 80% opacity
  disabled: (baseColor: string) => `${baseColor}66`, // 40% opacity
  focus: (baseColor: string) => `${baseColor}1A` // 10% opacity for background
};

// Animation timing presets
export const animationTimings = {
  quick: 150,
  normal: 250,
  slow: 350,
  bounce: 400
};

// Typography enhancement utilities
export const textEnhancements = {
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8
  }
};

/**
 * Get achievement color scheme based on completion status and type
 */
export const getAchievementColors = (
  isCompleted: boolean,
  type: 'primary' | 'success' | 'warning' | 'info' = 'primary'
): AchievementColorScheme => {
  if (!isCompleted) {
    return achievementColorSchemes.locked;
  }
  return achievementColorSchemes[type];
};

/**
 * Generate dynamic color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Convert opacity to hex (0-1 to 00-FF)
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${color}${alpha}`;
};

/**
 * Create vibrant shadow style for components
 */
export const createVibrantShadow = (color: string, intensity: 'soft' | 'medium' | 'strong' = 'medium') => {
  const presets = {
    soft: { opacity: 0.2, radius: 12, elevation: 6 },
    medium: { opacity: 0.3, radius: 16, elevation: 8 },
    strong: { opacity: 0.4, radius: 20, elevation: 12 }
  };
  
  const preset = presets[intensity];
  
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: preset.opacity,
    shadowRadius: preset.radius,
    elevation: preset.elevation
  };
};

export default {
  achievementColorSchemes,
  vibrantGradients,
  shadowPresets,
  glassEffects,
  interactionStates,
  animationTimings,
  textEnhancements,
  getAchievementColors,
  withOpacity,
  createVibrantShadow
};
