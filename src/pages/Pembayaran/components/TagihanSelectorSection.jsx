import { Card, Text, Select } from '@radix-ui/themes'
import { formatCurrency } from '../utils/currencyHelpers'

export function TagihanSelectorSection({ 
  tahunAjaranList, 
  tingkatList, 
  kelasList, 
  siswaList, 
  tagihanList, 
  selectedTagihan,
  selectedTahunAjaran,
  onTahunAjaranChange,
  selectedTingkat,
  onTingkatChange,
  selectedKelas,
  onKelasChange,
  selectedSiswa,
  onSiswaChange,
  onTagihanChange,
  tagihanSummary
}) {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="p-6 space-y-4">
        <Text size="3" weight="bold">1. Pilih Tagihan</Text>
        
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Text size="2" mb="1" weight="medium">Tahun Ajaran</Text>
            <Select.Root value={selectedTahunAjaran} onValueChange={onTahunAjaranChange}>
              <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tahun ajaran" />
              <Select.Content style={{ borderRadius: 0 }}>
                {tahunAjaranList.map(ta => (
                  <Select.Item key={ta.id} value={ta.id}>
                    {ta.nama}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div>
            <Text size="2" mb="1" weight="medium">Tingkat</Text>
            <Select.Root value={selectedTingkat} onValueChange={onTingkatChange}>
              <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tingkat" />
              <Select.Content style={{ borderRadius: 0 }}>
                {tingkatList.map(t => (
                  <Select.Item key={t} value={t}>
                    {t}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div>
            <Text size="2" mb="1" weight="medium">Kelas</Text>
            <Select.Root value={selectedKelas} onValueChange={onKelasChange}>
              <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih kelas" />
              <Select.Content style={{ borderRadius: 0 }}>
                {kelasList.map(k => (
                  <Select.Item key={k.id} value={k.id}>
                    {k.nama}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div>
            <Text size="2" mb="1" weight="medium">Siswa</Text>
            <Select.Root value={selectedSiswa} onValueChange={onSiswaChange}>
              <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih siswa" />
              <Select.Content style={{ borderRadius: 0 }}>
                {siswaList.map(s => (
                  <Select.Item key={s.id} value={s.id}>
                    {s.siswa?.nama_lengkap}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        
        {/* Tagihan Selection */}
        <div>
          <Text size="2" mb="1" weight="medium">Tagihan *</Text>
          <Select.Root value={selectedTagihan} onValueChange={onTagihanChange}>
            <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tagihan" />
            <Select.Content style={{ borderRadius: 0 }}>
              {tagihanList.map(t => (
                <Select.Item key={t.id} value={t.id}>
                  {t.nomor_tagihan} - {t.judul} ({t.riwayat_kelas_siswa?.siswa?.nama_lengkap}) - {formatCurrency(t.total_tagihan)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Selected Tagihan Info */}
        {tagihanSummary && (
          <div className="p-4 bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex justify-between">
              <Text size="2" className="text-blue-900">Total Tagihan</Text>
              <Text size="2" weight="bold" className="text-blue-900">
                {formatCurrency(tagihanSummary.total_tagihan)}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text size="2" className="text-blue-900">Sudah Dibayar</Text>
              <Text size="2" weight="bold" className="text-green-700">
                {formatCurrency(tagihanSummary.total_dibayar || 0)}
              </Text>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-300">
              <Text size="2" weight="bold" className="text-blue-900">Sisa Tagihan</Text>
              <Text size="3" weight="bold" className="text-orange-700">
                {formatCurrency(tagihanSummary.sisa_tagihan || tagihanSummary.total_tagihan)}
              </Text>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}