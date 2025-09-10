// Professional color palette with WCAG AA/AAA compliance
const primaryLight = '#0E7C86';    // Teal - Accessible, professional
const primaryDark = '#4ECDC4';     // Brighter teal for dark mode
const secondaryLight = '#FF6B6B';  // Coral accent - good contrast
const secondaryDark = '#FF8E8E';   // Brighter coral for dark mode
const successLight = '#2E7D32';    // Green - success states
const successDark = '#81C784';     // Light green for dark mode
const warningLight = '#F57C00';    // Amber - warning states
const warningDark = '#FFB74D';     // Light amber for dark mode
const dangerLight = '#D32F2F';     // Red - error states
const dangerDark = '#EF9A9A';      // Light red for dark mode

// Neutral tones with proper contrast ratios
const neutral50Light = '#FAFAFA';
const neutral100Light = '#F5F5F5';
const neutral200Light = '#EEEEEE';
const neutral300Light = '#E0E0E0';
const neutral400Light = '#BDBDBD';
const neutral500Light = '#9E9E9E';
const neutral600Light = '#757575';
const neutral700Light = '#616161';
const neutral800Light = '#424242';
const neutral900Light = '#212121';

const neutral50Dark = '#121212';
const neutral100Dark = '#1E1E1E';
const neutral200Dark = '#232323';
const neutral300Dark = '#2D2D2D';
const neutral400Dark = '#454545';
const neutral500Dark = '#6B6B6B';
const neutral600Dark = '#909090';
const neutral700Dark = '#B5B5B5';
const neutral800Dark = '#D0D0D0';
const neutral900Dark = '#ECEDEE';

export const Colors = {
  light: {
    text: neutral900Light,
    textSecondary: neutral700Light,
    background: neutral50Light,
    surface: '#FFFFFF',
    surfaceVariant: neutral100Light,
    card: '#FFFFFF',
    border: neutral300Light,
    divider: neutral200Light,
    muted: neutral500Light,
    tint: primaryLight,
    primary: primaryLight,
    secondary: secondaryLight,
    success: successLight,
    warning: warningLight,
    danger: dangerLight,
    icon: neutral600Light,
    tabIconDefault: neutral500Light,
    tabIconSelected: primaryLight,
    
    // Additional professional colors
    accent: '#4361EE',        // Blue accent for CTAs
    info: '#2196F3',         // Blue for information
    highlight: '#FFF9C4',    // Light yellow for highlights
    
    // State colors
    disabled: neutral400Light,
    placeholder: neutral500Light,
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Gradients
    gradientStart: primaryLight,
    gradientEnd: '#0E4C86',
  },
  dark: {
    text: neutral900Dark,
    textSecondary: neutral700Dark,
    background: neutral50Dark,
    surface: neutral100Dark,
    surfaceVariant: neutral200Dark,
    card: neutral100Dark,
    border: neutral400Dark,
    divider: neutral300Dark,
    muted: neutral500Dark,
    tint: primaryDark,
    primary: primaryDark,
    secondary: secondaryDark,
    success: successDark,
    warning: warningDark,
    danger: dangerDark,
    icon: neutral600Dark,
    tabIconDefault: neutral500Dark,
    tabIconSelected: primaryDark,
    
    // Additional professional colors
    accent: '#5E81FF',        // Brighter blue accent
    info: '#64B5F6',         // Light blue for information
    highlight: '#4A5568',    // Dark blue-gray for highlights
    
    // State colors
    disabled: neutral500Dark,
    placeholder: neutral600Dark,
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Gradients
    gradientStart: primaryDark,
    gradientEnd: '#4E86DC',
  },
};

// Utility function to get color based on theme
export const getThemeColor = (colorScheme: 'light' | 'dark') => {
  return Colors[colorScheme];
};

// Common styles using these colors
export const CommonStyles = {
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    }
  },
  card: {
    light: {
      backgroundColor: Colors.light.surface,
      borderColor: Colors.light.border,
    },
    dark: {
      backgroundColor: Colors.dark.surface,
      borderColor: Colors.dark.border,
    }
  }
};