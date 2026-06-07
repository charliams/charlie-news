export const ACCENTS = {
  red:    { light: 'oklch(0.58 0.17 25)',  dark: 'oklch(0.70 0.16 25)'  },
  amber:  { light: 'oklch(0.62 0.15 60)',  dark: 'oklch(0.74 0.14 70)'  },
  green:  { light: 'oklch(0.58 0.14 150)', dark: 'oklch(0.72 0.13 155)' },
  blue:   { light: 'oklch(0.58 0.16 250)', dark: 'oklch(0.72 0.14 250)' },
  violet: { light: 'oklch(0.56 0.18 300)', dark: 'oklch(0.72 0.15 300)' },
}

const THEMES = {
  editorial: {
    label: 'Editorial',
    headlineFont: '"Newsreader", Georgia, serif',
    bodyFont: '-apple-system, "SF Pro Text", system-ui, sans-serif',
    labelFont: '"Newsreader", Georgia, serif',
    headlineWeight: 500,
    headlineTracking: '-0.01em',
    headlineLine: 1.18,
    labelStyle: 'serif-italic',
    card: 'paper',
    radius: 16,
    wordmarkFont: '"Newsreader", Georgia, serif',
    wordmarkWeight: 600,
    light: { bg: '#f7f4ec', surface: '#fffdf8', ink: '#211d18', sub: '#6b6155', faint: '#9c9286', hairline: 'rgba(33,29,24,0.10)', chipBg: '#efe9dc' },
    dark:  { bg: '#17150f', surface: '#211e16', ink: '#f3efe4', sub: '#b3a692', faint: '#7c7363', hairline: 'rgba(255,250,235,0.10)', chipBg: '#2a261b' },
  },
  minimal: {
    label: 'Minimal',
    headlineFont: '"Helvetica Neue", -apple-system, system-ui, sans-serif',
    bodyFont: '"Helvetica Neue", -apple-system, system-ui, sans-serif',
    labelFont: '"IBM Plex Mono", ui-monospace, monospace',
    headlineWeight: 700,
    headlineTracking: '-0.02em',
    headlineLine: 1.12,
    labelStyle: 'mono-caps',
    card: 'list',
    radius: 4,
    wordmarkFont: '"Helvetica Neue", system-ui, sans-serif',
    wordmarkWeight: 800,
    light: { bg: '#ffffff', surface: '#ffffff', ink: '#0c0c0d', sub: '#5d5d63', faint: '#a3a3aa', hairline: 'rgba(12,12,13,0.12)', chipBg: '#f2f2f4' },
    dark:  { bg: '#0a0a0b', surface: '#0a0a0b', ink: '#f4f4f6', sub: '#9a9aa2', faint: '#5d5d65', hairline: 'rgba(244,244,246,0.14)', chipBg: '#1a1a1d' },
  },
  warm: {
    label: 'Warm',
    headlineFont: '"Nunito", -apple-system, system-ui, sans-serif',
    bodyFont: '-apple-system, "SF Pro Text", system-ui, sans-serif',
    labelFont: '"Nunito", system-ui, sans-serif',
    headlineWeight: 800,
    headlineTracking: '-0.01em',
    headlineLine: 1.2,
    labelStyle: 'soft-caps',
    card: 'soft',
    radius: 22,
    wordmarkFont: '"Nunito", system-ui, sans-serif',
    wordmarkWeight: 900,
    light: { bg: '#f6efe6', surface: '#fffaf3', ink: '#2c2419', sub: '#7a6c58', faint: '#a89a88', hairline: 'rgba(44,36,25,0.08)', chipBg: '#efe4d4' },
    dark:  { bg: '#1c1812', surface: '#272118', ink: '#f6eee0', sub: '#bcab92', faint: '#857862', hairline: 'rgba(246,238,224,0.10)', chipBg: '#322a1e' },
  },
}

export const THEME_LIST = [
  { id: 'editorial', label: 'Editorial' },
  { id: 'minimal',   label: 'Minimal' },
  { id: 'warm',      label: 'Warm' },
]

export const ACCENT_OPTIONS = Object.keys(ACCENTS).map(name => ({
  name, light: ACCENTS[name].light, dark: ACCENTS[name].dark,
}))

export function resolveAccent(lightStr, dark) {
  const opt = ACCENT_OPTIONS.find(o => o.light === lightStr) || ACCENT_OPTIONS[0]
  return dark ? opt.dark : opt.light
}

export function buildTheme(themeId, accentResolved, dark) {
  const t = THEMES[themeId] || THEMES.editorial
  const mode = dark ? t.dark : t.light
  const acc = accentResolved || ACCENTS.green[dark ? 'dark' : 'light']
  return {
    id: themeId,
    label: t.label,
    headlineFont: t.headlineFont,
    bodyFont: t.bodyFont,
    labelFont: t.labelFont,
    wordmarkFont: t.wordmarkFont,
    wordmarkWeight: t.wordmarkWeight,
    headlineWeight: t.headlineWeight,
    headlineTracking: t.headlineTracking,
    headlineLine: t.headlineLine,
    labelStyle: t.labelStyle,
    card: t.card,
    radius: t.radius,
    accent: acc,
    dark: !!dark,
    ...mode,
  }
}
