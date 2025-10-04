import { useMemo } from 'react'

export function useFilterOptions(data) {
  return useMemo(() => {
    const tahunAjaranMap = new Map()
    const tingkatSet = new Set()
    const kelasMap = new Map()

    data.forEach((item) => {
      const tahun = item.tahun_ajaran_terbaru
      if (tahun?.id && !tahunAjaranMap.has(tahun.id)) {
        tahunAjaranMap.set(tahun.id, {
          value: tahun.id,
          label: tahun.nama || 'Tanpa Tahun Ajaran',
        })
      }

      const tingkat = item.kelas_terbaru?.tingkat
      if (tingkat) {
        tingkatSet.add(String(tingkat))
      }

      const kelas = item.kelas_terbaru
      if (kelas?.id && !kelasMap.has(kelas.id)) {
        const label = [kelas.tingkat, kelas.nama_sub_kelas]
          .filter(Boolean)
          .join(' ') || 'Tanpa Kelas'
        kelasMap.set(kelas.id, {
          value: kelas.id,
          label,
          tingkat: kelas.tingkat ? String(kelas.tingkat) : null,
        })
      }
    })

    return {
      tahunAjaranOptions: Array.from(tahunAjaranMap.values()).sort((a, b) => 
        a.label.localeCompare(b.label)
      ),
      tingkatOptions: Array.from(tingkatSet).sort((a, b) => 
        a.localeCompare(b, undefined, { numeric: true })
      ),
      kelasOptions: Array.from(kelasMap.values()).sort((a, b) => 
        a.label.localeCompare(b.label)
      ),
    }
  }, [data])
}
