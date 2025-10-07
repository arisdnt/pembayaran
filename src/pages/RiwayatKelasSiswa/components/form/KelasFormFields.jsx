import { Text, Select } from '@radix-ui/themes'
import { Calendar, School, User, FileText } from 'lucide-react'

export function KelasFormFields({
  formData,
  setFormData,
  kelasList,
  tahunAjaranList
}) {
  return (
    <div className="space-y-4">
      <label className="block">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar className="h-3.5 w-3.5 text-green-500" />
          <Text as="div" size="2" weight="medium">
            Tahun Ajaran <span className="text-red-600">*</span>
          </Text>
        </div>
        <Select.Root
          value={formData.id_tahun_ajaran}
          onValueChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
          required
        >
          <Select.Trigger style={{ borderRadius: 0, width: '100%', height: '40px' }} placeholder="Pilih tahun ajaran..." />
          <Select.Content style={{ borderRadius: 0 }}>
            {tahunAjaranList.map(ta => (
              <Select.Item key={ta.id} value={ta.id}>
                {ta.nama} {ta.status_aktif && '🟢'}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </label>

      <label className="block">
        <div className="flex items-center gap-1.5 mb-1.5 mt-3">
          <School className="h-3.5 w-3.5 text-blue-500" />
          <Text as="div" size="2" weight="medium">
            Kelas <span className="text-red-600">*</span>
          </Text>
        </div>
        <Select.Root
          value={formData.id_kelas}
          onValueChange={(value) => setFormData({ ...formData, id_kelas: value })}
          required
        >
          <Select.Trigger style={{ borderRadius: 0, width: '100%', height: '40px' }} placeholder="Pilih kelas..." />
          <Select.Content style={{ borderRadius: 0 }}>
            {kelasList.map(kelas => (
              <Select.Item key={kelas.id} value={kelas.id}>
                Kelas {kelas.tingkat} {kelas.nama_sub_kelas}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </label>

      <label className="block">
        <div className="flex items-center gap-1.5 mb-1.5 mt-3">
          <User className="h-3.5 w-3.5 text-purple-500" />
          <Text as="div" size="2" weight="medium">
            Status <span className="text-red-600">*</span>
          </Text>
        </div>
        <Select.Root
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
          required
        >
          <Select.Trigger style={{ borderRadius: 0, width: '100%', height: '40px' }} />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="aktif">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Aktif
              </div>
            </Select.Item>
            <Select.Item value="pindah_kelas">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Pindah Kelas
              </div>
            </Select.Item>
            <Select.Item value="lulus">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Lulus
              </div>
            </Select.Item>
            <Select.Item value="keluar">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Keluar
              </div>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </label>

      <label className="block">
        <div className="flex items-center gap-1.5 mb-1.5 mt-3">
          <FileText className="h-3.5 w-3.5 text-orange-500" />
          <Text as="div" size="2" weight="medium">
            Catatan
          </Text>
        </div>
        <input
          type="text"
          placeholder="Catatan tambahan (opsional)"
          value={formData.catatan}
          onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
          className="w-full px-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          style={{ borderRadius: 0, height: '40px' }}
        />
      </label>
    </div>
  )
}
