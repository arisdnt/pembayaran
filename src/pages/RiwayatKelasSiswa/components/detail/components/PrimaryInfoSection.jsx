import { Text, Select } from '@radix-ui/themes'
import { School, Calendar, CheckCircle, User } from 'lucide-react'
import { SiswaAutocomplete } from '../../form/SiswaAutocomplete'
import { useMemo } from 'react'

export function PrimaryInfoSection({
  formData,
  setFormData,
  siswaList,
  kelasList,
  tahunAjaranList
}) {
  const selectedSiswa = useMemo(
    () => siswaList.find((s) => s.id === formData.id_siswa),
    [formData.id_siswa, siswaList]
  )

  return (
    <div>
      <div className="border-b-2 border-slate-300 pb-3 mb-4">
        <Text size="3" weight="bold" className="text-slate-900">
          Informasi Utama
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Text as="div" size="2" mb="2" weight="medium">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-600" />
              Siswa <span className="text-red-600">*</span>
            </div>
          </Text>
          <SiswaAutocomplete
            value={formData.id_siswa}
            onChange={(value) => setFormData({ ...formData, id_siswa: value })}
            siswaList={siswaList}
            required
          />
        </div>

        <label>
          <Text as="div" size="2" mb="2" weight="medium">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-slate-600" />
              Kelas <span className="text-red-600">*</span>
            </div>
          </Text>
          <Select.Root
            value={formData.id_kelas}
            onValueChange={(value) => setFormData({ ...formData, id_kelas: value })}
            required
          >
            <Select.Trigger
              style={{ borderRadius: 0, width: '100%', height: '40px' }}
              placeholder="Pilih kelas"
              className="cursor-pointer"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              {kelasList.map((kelas) => (
                <Select.Item key={kelas.id} value={kelas.id}>
                  {kelas.tingkat} {kelas.nama_sub_kelas}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>

        <label>
          <Text as="div" size="2" mb="2" weight="medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-600" />
              Tahun Ajaran <span className="text-red-600">*</span>
            </div>
          </Text>
          <Select.Root
            value={formData.id_tahun_ajaran}
            onValueChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
            required
          >
            <Select.Trigger
              style={{ borderRadius: 0, width: '100%', height: '40px' }}
              placeholder="Pilih tahun ajaran"
              className="cursor-pointer"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              {tahunAjaranList.map((tahun) => (
                <Select.Item key={tahun.id} value={tahun.id}>
                  {tahun.nama}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>

        <label>
          <Text as="div" size="2" mb="2" weight="medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-slate-600" />
              Status <span className="text-red-600">*</span>
            </div>
          </Text>
          <Select.Root
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
            required
          >
            <Select.Trigger
              style={{ borderRadius: 0, width: '100%', height: '40px' }}
              className="cursor-pointer"
            />
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
      </div>

      {/* Informasi Siswa Terpilih */}
      <div className="border-2 border-slate-300 bg-slate-50 px-3 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-700" />
          <Text size="2" weight="medium" className="text-slate-700">
            Siswa Terpilih:
          </Text>
        </div>
        {selectedSiswa ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
            <Text size="2" weight="medium" className="text-slate-900 truncate">
              {selectedSiswa.nama_lengkap}
            </Text>
            {selectedSiswa.nisn && (
              <>
                <span className="text-slate-400">•</span>
                <Text size="1" className="text-slate-600 font-mono">
                  NISN: {selectedSiswa.nisn}
                </Text>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-300 rounded-full flex-shrink-0"></div>
            <Text size="2" className="text-slate-500 italic">
              Belum ada siswa terpilih
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
