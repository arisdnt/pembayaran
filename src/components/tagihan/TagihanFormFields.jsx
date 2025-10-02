import { Text, TextField, TextArea, Select, Card } from '@radix-ui/themes'

export function TagihanFormFields({ formData, setFormData, riwayatKelasSiswaList }) {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="p-6 space-y-4">
        <Text size="3" weight="bold">Informasi Tagihan</Text>
        
        <div>
          <Text size="2" mb="1" weight="medium">Siswa *</Text>
          <Select.Root value={formData.id_riwayat_kelas_siswa} onValueChange={(v) => setFormData({...formData, id_riwayat_kelas_siswa: v})}>
            <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih siswa" />
            <Select.Content style={{ borderRadius: 0 }}>
              {riwayatKelasSiswaList?.map(s => (
                <Select.Item key={s.id} value={s.id}>
                  {s.siswa?.nama_lengkap} - {s.kelas?.tingkat} {s.kelas?.nama_sub_kelas} ({s.tahun_ajaran?.nama})
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div>
          <Text size="2" mb="1" weight="medium">Nomor Tagihan *</Text>
          <TextField.Root
            value={formData.nomor_tagihan}
            onChange={(e) => setFormData({...formData, nomor_tagihan: e.target.value})}
            placeholder="TGH-2024-001"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div>
          <Text size="2" mb="1" weight="medium">Judul *</Text>
          <TextField.Root
            value={formData.judul}
            onChange={(e) => setFormData({...formData, judul: e.target.value})}
            placeholder="Tagihan SPP Januari 2024"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div>
          <Text size="2" mb="1" weight="medium">Deskripsi</Text>
          <TextArea
            value={formData.deskripsi}
            onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
            placeholder="Deskripsi tagihan (opsional)"
            style={{ borderRadius: 0 }}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text size="2" mb="1" weight="medium">Tanggal Tagihan *</Text>
            <input
              type="date"
              value={formData.tanggal_tagihan}
              onChange={(e) => setFormData({...formData, tanggal_tagihan: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Text size="2" mb="1" weight="medium">Jatuh Tempo *</Text>
            <input
              type="date"
              value={formData.tanggal_jatuh_tempo}
              onChange={(e) => setFormData({...formData, tanggal_jatuh_tempo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
