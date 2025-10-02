import { Text } from '@radix-ui/themes'
import { Calendar, FileText } from 'lucide-react'

export function TimelineSection({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3 mb-4">
        <Text size="3" weight="bold" className="text-slate-900">
          Timeline & Detail
        </Text>
        <Text size="2" className="text-slate-600">
          Tanggal dan informasi tambahan
        </Text>
      </div>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-600" />
            Tanggal Masuk <span className="text-red-600">*</span>
          </div>
        </Text>
        <input
          type="date"
          value={formData.tanggal_masuk}
          onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ height: '40px' }}
          required
        />
      </label>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-600" />
            Tanggal Keluar
          </div>
        </Text>
        <input
          type="date"
          value={formData.tanggal_keluar}
          onChange={(e) => setFormData({ ...formData, tanggal_keluar: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ height: '40px' }}
        />
      </label>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-600" />
            Catatan
          </div>
        </Text>
        <input
          type="text"
          placeholder="Catatan tambahan (opsional)..."
          value={formData.catatan}
          onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ height: '40px' }}
        />
      </label>

      {formData.tanggal_masuk && (
        <div className="bg-blue-50 border border-blue-200 p-3" style={{ borderRadius: 0 }}>
          <Text size="2" weight="medium" className="text-blue-800 mb-1 block">
            Informasi Durasi
          </Text>
          <Text size="1" className="text-blue-700">
            Mulai: {new Date(formData.tanggal_masuk).toLocaleDateString('id-ID')}
          </Text>
          {formData.tanggal_keluar && (
            <Text size="1" className="text-blue-700 block">
              Selesai: {new Date(formData.tanggal_keluar).toLocaleDateString('id-ID')}
            </Text>
          )}
        </div>
      )}
    </div>
  )
}
