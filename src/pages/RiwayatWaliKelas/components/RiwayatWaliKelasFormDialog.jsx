import { Dialog, Text, TextField, Select, Button } from '@radix-ui/themes'
import { UserCheck, Edit3, X, Calendar, FileText, AlertCircle } from 'lucide-react'
import { useRiwayatWaliKelasForm } from '../../../hooks/useRiwayatWaliKelasForm'

function RiwayatWaliKelasFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEdit,
  waliKelasList,
  kelasList,
  tahunAjaranList
}) {
  const { formData, setFormData, submitting, error, handleSubmit } = useRiwayatWaliKelasForm(
    initialData,
    onSubmit,
    isEdit,
    onOpenChange
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '900px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? (
                <Edit3 className="h-5 w-5 text-white" />
              ) : (
                <UserCheck className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Riwayat Wali Kelas' : 'Tambah Riwayat Wali Kelas'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui data riwayat penugasan wali kelas' : 'Tambahkan riwayat penugasan wali kelas baru'}
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Wali Kelas */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <UserCheck className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Wali Kelas <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <Select.Root
                    value={formData.id_wali_kelas}
                    onValueChange={(value) => setFormData({ ...formData, id_wali_kelas: value })}
                    required
                  >
                    <Select.Trigger
                      placeholder="Pilih wali kelas"
                      className="w-full border-slate-300"
                      style={{ borderRadius: 0 }}
                    />
                    <Select.Content style={{ borderRadius: 0 }}>
                      {waliKelasList.map((wk) => (
                        <Select.Item key={wk.id} value={wk.id}>
                          {wk.nama_lengkap}{wk.nip ? ` (${wk.nip})` : ''}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                {/* Kelas */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <UserCheck className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Kelas <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <Select.Root
                    value={formData.id_kelas}
                    onValueChange={(value) => setFormData({ ...formData, id_kelas: value })}
                    required
                  >
                    <Select.Trigger
                      placeholder="Pilih kelas"
                      className="w-full border-slate-300"
                      style={{ borderRadius: 0 }}
                    />
                    <Select.Content style={{ borderRadius: 0 }}>
                      {kelasList.map((k) => (
                        <Select.Item key={k.id} value={k.id}>
                          {k.tingkat} {k.nama_sub_kelas}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                {/* Tahun Ajaran */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Tahun Ajaran <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <Select.Root
                    value={formData.id_tahun_ajaran}
                    onValueChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
                    required
                  >
                    <Select.Trigger
                      placeholder="Pilih tahun ajaran"
                      className="w-full border-slate-300"
                      style={{ borderRadius: 0 }}
                    />
                    <Select.Content style={{ borderRadius: 0 }}>
                      {tahunAjaranList.map((ta) => (
                        <Select.Item key={ta.id} value={ta.id}>
                          {ta.nama}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Tanggal Mulai */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <TextField.Root
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    className="border-slate-300"
                    style={{ borderRadius: 0 }}
                    required
                  />
                </div>

                {/* Tanggal Selesai */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Tanggal Selesai
                    </Text>
                  </label>
                  <TextField.Root
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    className="border-slate-300"
                    style={{ borderRadius: 0 }}
                  />
                  <Text size="1" className="text-slate-500 mt-1 block">
                    Opsional - Diisi jika penugasan sudah selesai
                  </Text>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <AlertCircle className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Status <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <Select.Root
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    required
                  >
                    <Select.Trigger
                      className="w-full border-slate-300"
                      style={{ borderRadius: 0 }}
                    />
                    <Select.Content style={{ borderRadius: 0 }}>
                      <Select.Item value="aktif">✓ Aktif</Select.Item>
                      <Select.Item value="selesai">◉ Selesai</Select.Item>
                      <Select.Item value="diganti">🔄 Diganti</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            </div>

            {/* Catatan - Full Width */}
            <div className="mt-6">
              <label className="flex items-center gap-1.5 mb-2">
                <FileText className="h-3.5 w-3.5 text-slate-600" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Catatan
                </Text>
              </label>
              <textarea
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                placeholder="Catatan tambahan (opsional)"
                className="w-full min-h-[100px] px-3 py-2 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderRadius: 0 }}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <Text size="2" weight="medium" className="text-red-700">
                    Terjadi kesalahan
                  </Text>
                  <Text size="2" className="text-red-600">
                    {error}
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Excel style */}
          <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
                className="px-6 py-2 border border-slate-400 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 border font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  isEdit
                    ? 'bg-amber-600 border-amber-700 hover:bg-amber-700'
                    : 'bg-green-600 border-green-700 hover:bg-green-700'
                }`}
              >
                {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RiwayatWaliKelasFormDialog
