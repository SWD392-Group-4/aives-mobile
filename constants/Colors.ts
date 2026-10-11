export const Theme = {
  primary: '#2563EB',      // Royal Blue (AIVES signature)
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  secondary: '#0D9488',    // Teal
  accent: '#F59E0B',       // Amber
  success: '#10B981',      // Emerald
  danger: '#EF4444',       // Red
  warning: '#F59E0B',
  dark: '#0F172A',         // Slate 900
  cardBg: '#FFFFFF',
  background: '#F8FAFC',   // Slate 50
  text: '#1E293B',         // Slate 800
  textSecondary: '#64748B',// Slate 500
  border: '#E2E8F0',       // Slate 200
  white: '#FFFFFF',
};

export default {
  light: {
    text: Theme.text,
    background: Theme.background,
    tint: Theme.primary,
    tabIconDefault: '#94A3B8',
    tabIconSelected: Theme.primary,
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: '#38BDF8',
    tabIconDefault: '#64748B',
    tabIconSelected: '#38BDF8',
  },
};
