import { Flex } from '@radix-ui/themes'
import { FormSelectField } from '../common/FormSelectField'
import { FormDateField } from '../common/FormDateField'
import { FormTextAreaField } from '../common/FormTextAreaField'
import { FormErrorAlert } from '../common/FormErrorAlert'

export function RiwayatWaliKelasFormFields({ 
  formData, 
  setFormData, 
  waliKelasList, 
  kelasList, 
  tahunAjaranList,
  error 
}) {
  return (
    <Flex direction="column" gap="3">
      <FormSelectField
        label="Wali Kelas"
        value={formData.id_wali_kelas}
        onChange={(value) => setFormData({ ...formData, id_wali_kelas: value })}
        placeholder="Pilih wali kelas"
        options={waliKelasList}
        required
        renderOption={(wk) => `${wk.nama_lengkap}${wk.nip ? ` (${wk.nip})` : ''}`}
      />

      <FormSelectField
        label="Kelas"
        value={formData.id_kelas}
        onChange={(value) => setFormData({ ...formData, id_kelas: value })}
        placeholder="Pilih kelas"
        options={kelasList}
        required
        renderOption={(k) => `${k.tingkat} ${k.nama_sub_kelas}`}
      />

      <FormSelectField
        label="Tahun Ajaran"
        value={formData.id_tahun_ajaran}
        onChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
        placeholder="Pilih tahun ajaran"
        options={tahunAjaranList}
        required
      />

      <FormDateField
        label="Tanggal Mulai"
        value={formData.tanggal_mulai}
        onChange={(value) => setFormData({ ...formData, tanggal_mulai: value })}
        required
      />

      <FormDateField
        label="Tanggal Selesai"
        value={formData.tanggal_selesai}
        onChange={(value) => setFormData({ ...formData, tanggal_selesai: value })}
        helpText="Opsional - Diisi jika penugasan sudah selesai"
      />

      <FormSelectField
        label="Status"
        value={formData.status}
        onChange={(value) => setFormData({ ...formData, status: value })}
        options={[
          { id: 'aktif', nama: 'Aktif' },
          { id: 'selesai', nama: 'Selesai' }
        ]}
        required
      />

      <FormTextAreaField
        label="Catatan"
        value={formData.catatan}
        onChange={(value) => setFormData({ ...formData, catatan: value })}
        placeholder="Catatan tambahan (opsional)"
      />

      <FormErrorAlert error={error} />
    </Flex>
  )
}
