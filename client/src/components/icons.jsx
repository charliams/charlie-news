export function ThumbUp({ size = 22, color = 'currentColor', fill = 'none', sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 10.5v9.5H4.6c-.9 0-1.6-.7-1.6-1.6v-6.3c0-.9.7-1.6 1.6-1.6H7zM7 10.5l4-7.2c.2-.4.6-.6 1-.6 1.1 0 2 .9 2 2v3.3h4.6c1.2 0 2.1 1.1 1.8 2.3l-1.6 6.5c-.2.9-1 1.5-1.9 1.5H7"
        stroke={color} strokeWidth={sw} fill={fill} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

export function ThumbDown({ size = 22, color = 'currentColor', fill = 'none', sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: 'scaleY(-1)' }}>
      <path d="M7 10.5v9.5H4.6c-.9 0-1.6-.7-1.6-1.6v-6.3c0-.9.7-1.6 1.6-1.6H7zM7 10.5l4-7.2c.2-.4.6-.6 1-.6 1.1 0 2 .9 2 2v3.3h4.6c1.2 0 2.1 1.1 1.8 2.3l-1.6 6.5c-.2.9-1 1.5-1.9 1.5H7"
        stroke={color} strokeWidth={sw} fill={fill} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

export function ExternalIcon({ size = 13, color = 'currentColor', sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 3H3.5C2.7 3 2 3.7 2 4.5v8C2 13.3 2.7 14 3.5 14h8c.8 0 1.5-.7 1.5-1.5V10" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M9.5 2.5H14V7M14 2.5L7.5 9" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function SparkIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" fill={color}/>
    </svg>
  )
}

export function ShuffleIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M16 3l4 4-4 4M21 7h-5c-2 0-3 1-4 2l-1 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 7h4c2 0 3 1 4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 21l4-4-4-4M21 17h-5c-2 0-3-1-4-2l-4-5H3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function GearIcon({ size = 19, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
