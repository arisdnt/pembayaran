import { Text } from '@radix-ui/themes'
import { Calendar, FileText } from 'lucide-react'
import { useMemo } from 'react'

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function TimelineSection({ formData, setFormData, tahunAjaranList = [] }) {
  const selectedTahun = useMemo(
    () => tahunAjaranList.find((tahun) => tahun.id === formData.id_tahun_ajaran),
    [formData.id_tahun_ajaran, tahunAjaranList]
  )

  const tanggalMasukDisplay = formatDateDisplay(formData.tanggal_masuk)
  const tanggalKeluarDisplay = formatDateDisplay(formData.tanggal_keluar)

  let tahunAjaranSummary = ''
  if (selectedTahun) {
    const parts = []
    if (selectedTahun.nama) parts.push(selectedTahun.nama)
    if (tanggalMasukDisplay) parts.push(tanggalMasukDisplay)
    if (selectedTahun.tanggal_selesai) {
      parts.push(tanggalKeluarDisplay || 'Tanggal selesai belum diatur')
    }
    tahunAjaranSummary = parts.join(' - ')
  }

  return (
    <div>
      <div className="border-b-2 border-slate-300 pb-3 mb-4">
        <Text size="3" weight="bold" className="text-slate-900">
          Timeline & Detail
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 border border-blue-200 bg-blue-50 px-3 py-2">
          <Text size="2" weight="medium" className="text-blue-800">
            Tanggal riwayat mengikuti tahun ajaran terpilih.
          </Text>
          {selectedTahun ? (
            <Text size="1" className="text-blue-700 block mt-1">
              {tahunAjaranSummary || 'Tanggal tahun ajaran belum lengkap'}
            </Text>
          ) : (
            <Text size="1" className="text-blue-700 block mt-1">
              Pilih tahun ajaran untuk mengisi tanggal secara otomatis.
            </Text>
          )}
        </div>

        <div className="border border-slate-200 bg-slate-50 px-3 py-3">
          <Text size="2" weight="medium" className="text-slate-800 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-600" />
            Tanggal Masuk
          </Text>
          <Text size="2" className="text-slate-700 mt-2 block">
            {tanggalMasukDisplay || 'Belum ditentukan'}
          </Text>
        </div>

        <div className="border border-slate-200 bg-slate-50 px-3 py-3">
          <Text size="2" weight="medium" className="text-slate-800 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-600" />
            Tanggal Keluar
          </Text>
          <Text size="2" className="text-slate-700 mt-2 block">
            {selectedTahun?.tanggal_selesai
              ? tanggalKeluarDisplay || 'Mengikuti akhir tahun ajaran'
              : 'Tidak tersedia'}
          </Text>
        </div>

        {formData.tanggal_masuk && (
          <div className="col-span-2 bg-blue-50 border border-blue-200 p-3" style={{ borderRadius: 0 }}>
            <Text size="2" weight="medium" className="text-blue-800 mb-1 block">
              Informasi Durasi
            </Text>
            <Text size="1" className="text-blue-700">
              Mulai: {tanggalMasukDisplay}
            </Text>
            {formData.tanggal_keluar && (
              <Text size="1" className="text-blue-700 block">
                Selesai: {tanggalKeluarDisplay}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
