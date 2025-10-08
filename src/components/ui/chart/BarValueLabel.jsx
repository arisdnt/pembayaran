export function BarValueLabel(props) {
  const { x = 0, y = 0, width = 0, height = 0, value, variant = 'verticalTop', fontSize = 12, padding = 4 } = props
  const text = (value ?? 0).toLocaleString('id-ID')
  const approxChar = 7 // approx px per char for this font size
  const rectW = Math.max(24, text.length * approxChar + padding * 2)
  const rectH = Math.max(16, fontSize + padding * 2)

  let rectX = x
  let rectY = y
  let textX = x
  let textY = y

  if (variant === 'verticalTop') {
    rectX = x + (width - rectW) / 2
    rectY = Math.max(y + 2, y + 2) // inside top
    textX = rectX + rectW / 2
    textY = rectY + rectH / 2 + fontSize * 0.35
  } else if (variant === 'horizontalRight') {
    rectX = x + Math.max(0, width - rectW - 4)
    rectY = y + (height - rectH) / 2
    textX = rectX + rectW / 2
    textY = rectY + rectH / 2 + fontSize * 0.35
  } else {
    // fallback: center
    rectX = x + (width - rectW) / 2
    rectY = y + (height - rectH) / 2
    textX = rectX + rectW / 2
    textY = rectY + rectH / 2 + fontSize * 0.35
  }

  return (
    <g>
      <rect x={rectX} y={rectY} width={rectW} height={rectH} fill="#ffffff" stroke="#94a3b8" />
      <text x={textX} y={textY} textAnchor="middle" fill="#000000" fontSize={fontSize}>
        {text}
      </text>
    </g>
  )
}

