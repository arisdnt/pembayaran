import { Text, Select, Badge } from '@radix-ui/themes'
import { Receipt, Calendar, GraduationCap, User } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function TagihanSelectorSection({
  tahunAjaranList,
  tingkatList,
  kelasList,
  siswaList,
  tagihanList,
  selectedTahunAjaran,
  onTahunAjaranChange,
  selectedTingkat,
  onTingkatChange,
  selectedKelas,
  onKelasChange,
  selectedSiswa,
  onSiswaChange,
  selectedTagihan,
  onTagihanChange,
  tagihanSummary
}) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Pilih Tagihan
          </Text>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Row 1: Tahun Ajaran & Tingkat */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tahun Ajaran */}
            <div>
              <label className="flex items-center gap-1.5 mb-2">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Tahun Ajaran <span className="text-red-500">*</span>
                </Text>
              </label>
              <Select.Root value={selectedTahunAjaran} onValueChange={onTahunAjaranChange}>
                <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tahun ajaran" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {tahunAjaranList.map(ta => (
                    <Select.Item key={ta.id} value={ta.id}>
                      {ta.nama} {ta.status_aktif && '(Aktif)'}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Tingkat */}
            <div>
              <label className="flex items-center gap-1.5 mb-2">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Tingkat <span className="text-red-500">*</span>
                </Text>
              </label>
              <Select.Root 
                value={selectedTingkat} 
                onValueChange={onTingkatChange}
                disabled={!selectedTahunAjaran}
              >
                <Select.Trigger 
                  style={{ borderRadius: 0 }} 
                  className="w-full border-slate-300" 
                  placeholder={selectedTahunAjaran ? "Pilih tingkat" : "Pilih tahun ajaran dulu"}
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  {tingkatList.map(t => (
                    <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          {/* Row 2: Kelas & Siswa */}
          <div className="grid grid-cols-2 gap-3">
            {/* Kelas */}
            <div>
              <label className="flex items-center gap-1.5 mb-2">
                <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Kelas
                </Text>
              </label>
              <Select.Root
                value={selectedKelas || undefined}
                onValueChange={(value) => onKelasChange(value === '__all__' ? '' : value)}
                disabled={!selectedTingkat}
              >
                <Select.Trigger
                  style={{ borderRadius: 0 }}
                  className="w-full border-slate-300"
                  placeholder={selectedTingkat ? "Semua kelas" : "Pilih tingkat dulu"}
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="__all__">Semua Kelas</Select.Item>
                  {kelasList
                    .filter(k => k.tingkat === selectedTingkat)
                    .map(k => (
                      <Select.Item key={k.id} value={k.id}>
                        {k.tingkat} {k.nama_sub_kelas}
                      </Select.Item>
                    ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Siswa */}
            <div>
              <label className="flex items-center gap-1.5 mb-2">
                <User className="h-3.5 w-3.5 text-teal-500" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Siswa <span className="text-red-500">*</span>
                </Text>
              </label>
              <Select.Root 
                value={selectedSiswa} 
                onValueChange={onSiswaChange}
                disabled={!selectedTahunAjaran}
              >
                <Select.Trigger 
                  style={{ borderRadius: 0 }} 
                  className="w-full border-slate-300" 
                  placeholder={selectedTahunAjaran ? "Pilih siswa" : "Pilih tahun ajaran dulu"}
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  {siswaList.map(s => (
                    <Select.Item key={s.id} value={s.id}>
                      {s.siswa?.nama_lengkap} - {s.kelas?.tingkat} {s.kelas?.nama_sub_kelas}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {selectedTahunAjaran && siswaList.length === 0 && (
                <Text size="1" className="text-amber-600 mt-1">
                  Tidak ada siswa sesuai filter
                </Text>
              )}
            </div>
          </div>

          {/* Row 3: Tagihan (full width) */}
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Receipt className="h-3.5 w-3.5 text-green-500" />
              <Text size="2" weight="medium" className="text-slate-700">
                Tagihan <span className="text-red-500">*</span>
              </Text>
            </label>
            <Select.Root 
              value={selectedTagihan} 
              onValueChange={onTagihanChange}
              disabled={!selectedSiswa}
            >
              <Select.Trigger 
                style={{ borderRadius: 0 }} 
                className="w-full border-slate-300" 
                placeholder={selectedSiswa ? "Pilih tagihan" : "Pilih siswa dulu"}
              />
              <Select.Content style={{ borderRadius: 0 }}>
                {tagihanList.map(t => (
                  <Select.Item key={t.id} value={t.id}>
                    {t.nomor_tagihan} - {t.judul}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            {selectedSiswa && tagihanList.length === 0 && (
              <Text size="1" className="text-amber-600 mt-1">
                Tidak ada tagihan untuk siswa ini
              </Text>
            )}
          </div>

          {/* Tagihan Summary */}
          {tagihanSummary && (
            <div className="border-t-2 border-slate-200 pt-4 mt-4">
              <Text size="1" weight="bold" className="text-slate-600 uppercase tracking-wider mb-3 block">
                Ringkasan Tagihan
              </Text>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text size="2" className="text-slate-600">Total Tagihan:</Text>
                  <Text size="2" weight="bold" className="text-slate-900 font-mono">
                    {formatCurrency(tagihanSummary.total)}
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text size="2" className="text-slate-600">Sudah Dibayar:</Text>
                  <Text size="2" weight="bold" className="text-green-600 font-mono">
                    {formatCurrency(tagihanSummary.sudahDibayar)}
                  </Text>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <Text size="2" weight="bold" className="text-slate-700">Sisa:</Text>
                  <Text size="3" weight="bold" className={`font-mono ${
                    tagihanSummary.sisa > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(tagihanSummary.sisa)}
                  </Text>
                </div>
              </div>

              {tagihanSummary.sisa <= 0 && (
                <div className="mt-3 px-3 py-2 bg-green-50 border-2 border-green-200">
                  <Text size="1" className="text-green-700">
                    ✓ Tagihan sudah lunas
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
