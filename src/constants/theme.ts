/**
 * DARK_PREMIUM preset with the workshop palette overrides from the design doc.
 * The `name` field stays exactly as the preset declares it.
 */
export const theme = {
  name: 'dark-premium',

  colors: {
    bg: {
      primary: '#102022',
      secondary: '#163038',
      tertiary: '#263B59',
      accent: '#1B3140',
    },
    accent: {
      primary: '#2A9DAB',
      secondary: '#49C6D4',
      warm: '#E03C28',
      cool: '#263B59',
      success: '#4FBF8B',
    },
    text: {
      primary: '#E9EFF0',
      secondary: '#E9EFF0CC',
      tertiary: '#E9EFF0B3',
      accent: '#49C6D4',
      muted: '#E9EFF066',
      onTeal: '#102022',
    },
    ui: {
      border: '#E9EFF01F',
      borderStrong: '#E9EFF033',
      divider: '#E9EFF014',
      fine: '#E9EFF008',
      glass: 'rgba(38, 59, 89, 0.55)',
      overlay: '#102022CC',
      scrim: '#102022E6',
    },
  },

  gradients: {
    screen: ['#102022', '#263B59', '#102022'] as const,
    screenAlt: ['#263B59', '#19303A', '#102022'] as const,
    loader: ['#0A1416', '#102022', '#16303A'] as const,
    surface: ['#1B3140', '#162A33'] as const,
    teal: ['#2A9DAB', '#263B59'] as const,
    action: ['#E03C28', '#C02F1E'] as const,
    header: ['#102022CC', '#102022E6'] as const,
  },

  typography: {
    hero: { fontSize: 40, lineHeight: 48, fontWeight: '800' as const, letterSpacing: -0.5 },
    display: { fontSize: 48, lineHeight: 56, fontWeight: '800' as const, letterSpacing: -1 },
    title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: -0.2 },
    cardTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, letterSpacing: 0 },
    value: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const, letterSpacing: -0.3 },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, letterSpacing: 0.1 },
    support: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const, letterSpacing: 0.1 },
    button: { fontSize: 20, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.6 },
    buttonSm: { fontSize: 16, lineHeight: 24, fontWeight: '700' as const, letterSpacing: 0.6 },
    caption: { fontSize: 12, lineHeight: 18, fontWeight: '500' as const, letterSpacing: 0.6 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 32 },

  radius: { sm: 8, md: 14, lg: 16, xl: 18, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 4,
    },
    action: {
      shadowColor: '#E03C28',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 14,
      elevation: 6,
    },
    teal: {
      shadowColor: '#2A9DAB',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 5,
    },
  },

  animation: {
    press: { tension: 160, friction: 20 },
    fade: 180,
    quick: 150,
  },
};

export type Theme = typeof theme;
export default theme;
