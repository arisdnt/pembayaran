import { Text, Select, Badge } from '@radix-ui/themes'
import { User } from 'lucide-react'

export function TargetSiswaSection({
  targetType,
  onTargetTypeChange,
  selectedTahunAjaran,
  onTahunAjaranChange,
  selectedTingkat,
  onTingkatChange,
  selectedKelas,
  onKelasChange,
  selectedSiswa,
  onSiswaChange,
  tahunAjaranList,
  tingkatList,
  kelasList,
  riwayatKelasSiswaList,
  filteredSiswaCount
}) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Target Siswa
          </Text>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Tahun Ajaran - Always visible */}
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Tahun Ajaran <span className="text-red-500">*</span>
              </Text>
            </label>
            <Select.Root value={selectedTahunAjaran} onValueChange={onTahunAjaranChange}>
              <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tahun ajaran" />
              <Select.Content style={{ borderRadius: 0 }}>
                {tahunAjaranList?.map(ta => (
                  <Select.Item key={ta.id} value={ta.id}>{ta.nama}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          {/* Target Tagihan - Always visible */}
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Text size="2" weight="medium" className="text-slate-700">
                Target Tagihan <span className="text-red-500">*</span>
              </Text>
            </label>
            <Select.Root value={targetType} onValueChange={onTargetTypeChange}>
              <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" />
              <Select.Content style={{ borderRadius: 0 }}>
                <Select.Item value="siswa">Siswa Individual</Select.Item>
                <Select.Item value="kelas">Satu Kelas</Select.Item>
                <Select.Item value="tingkat">Satu Tingkat</Select.Item>
                <Select.Item value="semua">Semua Siswa</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          {targetType === 'tingkat' && (
            <div>
              <label className="flex items-center gap-1.5 mb-2">
                <Text size="2" weight="medium" className="text-slate-700">
                  Tingkat <span className="text-red-500">*</span>
                </Text>
              </label>
              <Select.Root value={selectedTingkat} onValueChange={onTingkatChange}>
                <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tingkat" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {tingkatList?.map(t => (
                    <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          )}

          {targetType === 'kelas' && (
            <>
              <div>
                <label className="flex items-center gap-1.5 mb-2">
                  <Text size="2" weight="medium" className="text-slate-700">
                    Tingkat <span className="text-red-500">*</span>
                  </Text>
                </label>
                <Select.Root value={selectedTingkat} onValueChange={onTingkatChange}>
                  <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tingkat" />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {tingkatList?.map(t => (
                      <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              {selectedTingkat && (
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Text size="2" weight="medium" className="text-slate-700">
                      Kelas <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <Select.Root value={selectedKelas} onValueChange={onKelasChange}>
                    <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih kelas" />
                    <Select.Content style={{ borderRadius: 0 }}>
                      {kelasList?.filter(k => k.tingkat === selectedTingkat).map(k => (
                        <Select.Item key={k.id} value={k.id}>{k.tingkat} {k.nama_sub_kelas}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              )}
            </>
          )}

          {targetType === 'siswa' && (
            <div className="col-span-2">
              <label className="flex items-center gap-1.5 mb-2">
                <Text size="2" weight="medium" className="text-slate-700">
                  Siswa <span className="text-red-500">*</span>
                </Text>
              </label>
              <Select.Root value={selectedSiswa} onValueChange={onSiswaChange}>
                <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih siswa" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {riwayatKelasSiswaList?.map(s => (
                    <Select.Item key={s.id} value={s.id}>
                      {s.siswa?.nama_lengkap} - {s.kelas?.tingkat} {s.kelas?.nama_sub_kelas} ({s.tahun_ajaran?.nama})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {selectedTahunAjaran && riwayatKelasSiswaList?.length === 0 && (
                <Text size="1" className="text-amber-600 mt-1">
                  Tidak ada siswa untuk tahun ajaran yang dipilih
                </Text>
              )}
            </div>
          )}
        </div>

        {selectedTahunAjaran && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-2 border-blue-300 mt-4">
            <Text size="2" weight="medium" className="text-blue-900">
              Target: {filteredSiswaCount} siswa
            </Text>
            {filteredSiswaCount === 0 && (
              <Text size="1" className="text-blue-700">
                • Tidak ada siswa yang sesuai filter
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
