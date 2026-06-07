import { useState, useEffect } from 'react'

const KEY = 'charlie_settings_v1'
const DEFAULTS = {
  theme: 'warm',
  accent: 'oklch(0.58 0.14 150)',  // green
  dark: false,
  summaryLines: 3,
}

export function useSettings() {
  const [settings, setSettingsRaw] = useState(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }
    } catch {
      return { ...DEFAULTS }
    }
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  const setSetting = (key, value) =>
    setSettingsRaw(prev => ({ ...prev, [key]: value }))

  return [settings, setSetting]
}
