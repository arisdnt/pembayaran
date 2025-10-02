import { Text, TextField } from '@radix-ui/themes'
import { Calendar } from 'lucide-react'

export function InformasiTagihanSection({ formData, onChange }) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Informasi Tagihan
          </Text>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Nomor Tagihan <span className="text-red-500">*</span>
              </Text>
            </label>
            <TextField.Root
              value={formData.nomor_tagihan}
              onChange={(e) => onChange('nomor_tagihan', e.target.value)}
              placeholder="TGH-2024-001"
              style={{ borderRadius: 0 }}
              className="border-slate-300"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Judul <span className="text-red-500">*</span>
              </Text>
            </label>
            <TextField.Root
              value={formData.judul}
              onChange={(e) => onChange('judul', e.target.value)}
              placeholder="Tagihan SPP Januari 2024"
              style={{ borderRadius: 0 }}
              className="border-slate-300"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Tanggal Tagihan <span className="text-red-500">*</span>
              </Text>
            </label>
            <input
              type="date"
              value={formData.tanggal_tagihan}
              onChange={(e) => onChange('tanggal_tagihan', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderRadius: 0 }}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Jatuh Tempo <span className="text-red-500">*</span>
              </Text>
            </label>
            <input
              type="date"
              value={formData.tanggal_jatuh_tempo}
              onChange={(e) => onChange('tanggal_jatuh_tempo', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderRadius: 0 }}
            />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Deskripsi
              </Text>
            </label>
            <TextField.Root
              value={formData.deskripsi}
              onChange={(e) => onChange('deskripsi', e.target.value)}
              placeholder="Deskripsi tagihan (opsional)"
              style={{ borderRadius: 0 }}
              className="border-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
