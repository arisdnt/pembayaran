import { TextField, Text, Switch } from '@radix-ui/themes'
import { User, Key, Phone, Mail, ToggleLeft } from 'lucide-react'

export function FormFields({ formData, setFormData }) {
  return (
    <>
      {/* Row 1: Nama Lengkap - Full Width */}
      <div className="mb-4">
        <label>
          <div className="flex items-center gap-1.5 mb-1">
            <User className="h-3.5 w-3.5 text-indigo-500" />
            <Text as="div" size="2" weight="medium">
              Nama Lengkap <span className="text-red-600">*</span>
            </Text>
          </div>
          <TextField.Root
            placeholder="Masukkan nama lengkap wali kelas"
            value={formData.nama_lengkap}
            onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
            style={{ borderRadius: 0 }}
            required
          />
        </label>
      </div>

      {/* Row 2: NIP & Nomor Telepon - 2 Columns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label>
          <div className="flex items-center gap-1.5 mb-1">
            <Key className="h-3.5 w-3.5 text-purple-500" />
            <Text as="div" size="2" weight="medium">
              NIP
            </Text>
          </div>
          <TextField.Root
            placeholder="Nomor Induk Pegawai"
            value={formData.nip}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            style={{ borderRadius: 0 }}
          />
          <Text size="1" className="text-slate-500 mt-1">
            Opsional - Nomor identitas pegawai
          </Text>
        </label>

        <label>
          <div className="flex items-center gap-1.5 mb-1">
            <Phone className="h-3.5 w-3.5 text-green-500" />
            <Text as="div" size="2" weight="medium">
              Nomor Telepon
            </Text>
          </div>
          <TextField.Root
            placeholder="Contoh: 08123456789"
            value={formData.nomor_telepon}
            onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
            style={{ borderRadius: 0 }}
          />
          <Text size="1" className="text-slate-500 mt-1">
            Nomor kontak wali kelas
          </Text>
        </label>
      </div>

      {/* Row 3: Email - Full Width */}
      <div className="mb-4">
        <label>
          <div className="flex items-center gap-1.5 mb-1">
            <Mail className="h-3.5 w-3.5 text-amber-500" />
            <Text as="div" size="2" weight="medium">
              Email
            </Text>
          </div>
          <TextField.Root
            type="email"
            placeholder="Contoh: nama@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ borderRadius: 0 }}
          />
          <Text size="1" className="text-slate-500 mt-1">
            Opsional - Untuk komunikasi resmi
          </Text>
        </label>
      </div>

      {/* Row 4: Status Aktif */}
      <div className="border-t-2 border-slate-200 pt-4">
        <label>
          <div className="flex items-center gap-1.5 mb-2">
            <ToggleLeft className="h-3.5 w-3.5 text-slate-500" />
            <Text as="div" size="2" weight="medium">
              Status Kepegawaian
            </Text>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 shadow-sm">
            <Switch
              checked={formData.status_aktif}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status_aktif: checked })
              }
              size="2"
            />
            <div className="flex-1">
              <Text size="2" weight="medium" className="text-slate-900 block">
                {formData.status_aktif ? 'Status Aktif' : 'Status Nonaktif'}
              </Text>
              <Text size="1" className="text-slate-500">
                {formData.status_aktif 
                  ? 'Wali kelas dapat ditugaskan untuk mengajar' 
                  : 'Wali kelas tidak dapat ditugaskan'}
              </Text>
            </div>
          </div>
        </label>
      </div>
    </>
  )
}
