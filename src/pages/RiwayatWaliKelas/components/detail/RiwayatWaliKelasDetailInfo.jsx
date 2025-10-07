import { useState, useEffect } from 'react'
import { Badge, Text } from '@radix-ui/themes'
import { Calendar, Clock, FileText, Users } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'
import { db } from '../../../../offline/db'

const Section = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`border-b border-slate-200 pb-4 mb-4 ${className}`}>
    <div className="flex items-center gap-1.5 mb-3">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
      <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider text-[0.65rem]">
        {title}
      </Text>
    </div>
    <div className="ml-5 space-y-2">
      {children}
    </div>
  </div>
)

const studentStatusMeta = {
  aktif: { color: 'green', label: 'Aktif' },
  selesai: { color: 'blue', label: 'Selesai' },
  mutasi: { color: 'amber', label: 'Mutasi' },
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
  } catch {
    return '—'
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return '—'
  try {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id })
  } catch {
    return '—'
  }
}

const calculateDuration = (startDate, endDate) => {
  if (!startDate) return '—'
  try {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const days = differenceInDays(end, start)

    if (days < 30) return `${days} hari`
    if (days < 365) return `${Math.floor(days / 30)} bulan`

    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    return months > 0 ? `${years} tahun ${months} bulan` : `${years} tahun`
  } catch {
    return '—'
  }
}

const getStudentMeta = (status) => studentStatusMeta[status] || { color: 'gray', label: status || 'Tidak diketahui' }

export function RiwayatWaliKelasDetailInfo({ riwayat }) {
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [studentsError, setStudentsError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadStudents() {
      if (!riwayat?.id_kelas || !riwayat?.id_tahun_ajaran) {
        setStudents([])
        setStudentsError('')
        setStudentsLoading(false)
        return
      }

      setStudentsLoading(true)
      setStudentsError('')

      const list = await db.riwayat_kelas_siswa
        .where('id_kelas')
        .equals(riwayat.id_kelas)
        .toArray()
      const filtered = list.filter(r => r.id_tahun_ajaran === riwayat.id_tahun_ajaran)
      const siswaMap = new Map((await db.siswa.toArray()).map(s => [s.id, s]))
      const withSiswa = filtered.map(r => ({
        ...r,
        siswa: siswaMap.get(r.id_siswa) ? { id: r.id_siswa, nama_lengkap: siswaMap.get(r.id_siswa).nama_lengkap, nisn: siswaMap.get(r.id_siswa).nisn } : null,
      }))
      if (ignore) return
      const sorted = withSiswa.sort((a, b) => {
        const nameA = a.siswa?.nama_lengkap?.toLocaleLowerCase('id-ID') || ''
        const nameB = b.siswa?.nama_lengkap?.toLocaleLowerCase('id-ID') || ''
        return nameA.localeCompare(nameB, 'id-ID')
      })
      setStudents(sorted)
      
      setStudentsLoading(false)
    }

    loadStudents()

    return () => {
      ignore = true
    }
  }, [riwayat?.id_kelas, riwayat?.id_tahun_ajaran])

  if (!riwayat) return null

  const waliKelasName = riwayat.wali_kelas?.nama_lengkap || '—'
  const kelasName = riwayat.kelas ? `${riwayat.kelas.tingkat || ''} ${riwayat.kelas.nama_sub_kelas || ''}`.trim() : '—'
  const tahunAjaranName = riwayat.tahun_ajaran?.nama || '—'

  return (
    <div className="space-y-4">
      {/* Informasi Wali Kelas */}
      <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-4">
        <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-2 block">
          Wali Kelas
        </Text>
        <Text size="4" weight="bold" className="text-slate-900 leading-tight">
          {waliKelasName}
        </Text>
        {riwayat.wali_kelas?.nip && (
          <Text size="2" className="text-slate-500 block mt-1">
            NIP: {riwayat.wali_kelas.nip}
          </Text>
        )}
        <Text size="2" className="text-slate-600 block mt-2">
          {tahunAjaranName} • Kelas {kelasName}
        </Text>
      </div>

      {/* Periode Penugasan */}
      <Section title="Periode Penugasan" icon={Calendar}>
        <Text size="2" className="text-slate-800">
          {formatDate(riwayat.tanggal_mulai)} - {riwayat.tanggal_selesai ? formatDate(riwayat.tanggal_selesai) : 'sekarang'}
        </Text>
        <Text size="1" className="text-slate-500 block mt-1">
          Durasi {calculateDuration(riwayat.tanggal_mulai, riwayat.tanggal_selesai)}
        </Text>
      </Section>

      {/* Catatan */}
      {riwayat.catatan && (
        <Section title="Catatan" icon={FileText}>
          <Text size="2" className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {riwayat.catatan}
          </Text>
        </Section>
      )}

      {/* Daftar Siswa */}
      <Section title="Daftar Siswa" icon={Users}>
        <div>
        {studentsLoading ? (
          <Text size="2" className="text-slate-500">
            Memuat daftar siswa...
          </Text>
        ) : studentsError ? (
          <Text size="2" className="text-red-600">
            {studentsError}
          </Text>
        ) : students.length === 0 ? (
          <Text size="1" className="text-slate-500">
            Tidak ada siswa yang terhubung dengan wali kelas ini pada tahun ajaran terpilih.
          </Text>
        ) : (
          <div className="max-h-[500px] overflow-y-auto border border-slate-200">
            {students.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 px-2 py-2 border-b border-slate-100 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <Text size="1" className="text-slate-500 font-mono w-6 shrink-0">
                  {index + 1}.
                </Text>
                <div className="flex-1 min-w-0">
                  <Text size="2" weight="medium" className="text-slate-900 truncate block">
                    {item.siswa?.nama_lengkap || 'Tanpa nama'}
                  </Text>
                  {item.siswa?.nisn && (
                    <Text size="1" className="text-slate-500 font-mono block mt-0.5">
                      NISN: {item.siswa.nisn}
                    </Text>
                  )}
                </div>
                <Badge color={getStudentMeta(item.status).color} variant="soft" size="1" style={{ borderRadius: 0 }}>
                  {getStudentMeta(item.status).label}
                </Badge>
              </div>
            ))}
          </div>
        )}
        </div>
      </Section>
    </div>
  )
}
