export function getTipeBadgeColor(tipe) {
  switch (tipe) {
    case 'bulanan': return 'blue'
    case 'tahunan': return 'purple'
    case 'sekali': return 'green'
    default: return 'gray'
  }
}
