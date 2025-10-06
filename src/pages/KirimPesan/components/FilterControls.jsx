import { Button, Select, Text } from '@radix-ui/themes'
import { Filter, BookOpen, GraduationCap, School, Settings } from 'lucide-react'

export default function FilterControls({
  tahunAjaranList,
  tingkatList,
  filteredKelas,
  selectedTA,
  selectedTingkat,
  selectedKelas,
  rateMs,
  loading,
  sending,
  onTAChange,
  onTingkatChange,
  onKelasChange,
  onRateMsChange,
  onGenerate,
  onKirim,
  onCancel,
  onSettings,
  messageCount
}) {
  return (
    <div className="mb-4 pb-4 border-b flex-shrink-0">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="medium" className="text-slate-700">Filter:</Text>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-blue-500" />
          <Select.Root value={selectedTA} onValueChange={onTAChange}>
            <Select.Trigger style={{ borderRadius: 0, width: '200px' }} placeholder="Tahun Ajaran" />
            <Select.Content style={{ borderRadius: 0 }}>
              {tahunAjaranList.map(ta => (
                <Select.Item key={ta.id} value={ta.id}>
                  {ta.nama} {ta.status_aktif && '(Aktif)'}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
          <Select.Root value={selectedTingkat} onValueChange={onTingkatChange}>
            <Select.Trigger style={{ borderRadius: 0, width: '140px' }} placeholder="Tingkat" />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="_all">Semua Tingkat</Select.Item>
              {tingkatList.map(t => (
                <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2">
          <School className="h-3.5 w-3.5 text-green-500" />
          <Select.Root value={selectedKelas} onValueChange={onKelasChange}>
            <Select.Trigger style={{ borderRadius: 0, width: '160px' }} placeholder="Kelas" />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="_all">Semua Kelas</Select.Item>
              {filteredKelas.map(k => (
                <Select.Item key={k.id} value={k.id}>{k.tingkat} - {k.nama_sub_kelas}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            onClick={onSettings}
            variant="soft"
            color="gray"
            className="cursor-pointer"
            style={{ borderRadius: 0 }}
            size="2"
          >
            <Settings className="h-4 w-4 mr-1" />
            Pengaturan
          </Button>
          <Button
            disabled={loading}
            onClick={onGenerate}
            className="cursor-pointer"
            style={{ borderRadius: 0 }}
            size="2"
          >
            {loading ? 'Memproses...' : 'Generate'}
          </Button>
          <Button
            disabled={sending || messageCount === 0}
            onClick={onKirim}
            color="green"
            className="cursor-pointer"
            style={{ borderRadius: 0 }}
            size="2"
          >
            {sending ? 'Mengirim...' : 'Kirim Pesan'}
          </Button>
          <Button
            disabled={!sending}
            onClick={onCancel}
            color="red"
            variant="soft"
            className="cursor-pointer"
            style={{ borderRadius: 0 }}
            size="2"
          >
            Hentikan
          </Button>
        </div>
      </div>
    </div>
  )
}
