import { useState, useEffect } from 'react'
import { Badge, Text } from '@radix-ui/themes'
import { Calendar, Clock, FileText, Users, UserCheck, School, BookOpen } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'
import { db } from '../../../../offline/db'

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
    <div className="space-y-3">
      {/* Informasi Wali Kelas */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <UserCheck className="h-4 w-4 text-indigo-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Wali Kelas
          </Text>
        </div>
        <Text size="3" weight="bold" className="text-slate-900 mb-1">
          {waliKelasName}
        </Text>
        {riwayat.wali_kelas?.nip && (
          <Text size="1" className="text-slate-500 block">
            NIP: {riwayat.wali_kelas.nip}
          </Text>
        )}
      </div>

      {/* Kelas & Tahun Ajaran */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <School className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Kelas & Tahun Ajaran
          </Text>
        </div>
        <Text size="2" className="text-slate-900 font-semibold">
          Kelas {kelasName}
        </Text>
        <Text size="2" className="text-slate-600 block mt-1">
          {tahunAjaranName}
        </Text>
      </div>

      {/* Periode Penugasan */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-green-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Periode Penugasan
          </Text>
        </div>
        <Text size="2" className="text-slate-900 font-semibold">
          {formatDate(riwayat.tanggal_mulai)} - {riwayat.tanggal_selesai ? formatDate(riwayat.tanggal_selesai) : 'sekarang'}
        </Text>
        <Text size="1" className="text-slate-500 block mt-1">
          Durasi {calculateDuration(riwayat.tanggal_mulai, riwayat.tanggal_selesai)}
        </Text>
      </div>

      {/* Catatan */}
      {riwayat.catatan && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Catatan
            </Text>
          </div>
          <Text size="2" className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {riwayat.catatan}
          </Text>
        </div>
      )}

      {/* Daftar Siswa */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Daftar Siswa ({students.length})
          </Text>
        </div>

        {studentsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-100 animate-pulse" style={{ borderRadius: 0 }} />
            ))}
          </div>
        ) : studentsError ? (
          <div className="text-center py-4">
            <Text size="2" className="text-red-600">
              {studentsError}
            </Text>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-4">
            <Text size="2" className="text-slate-400">
              Belum ada siswa
            </Text>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[300px] overflow-auto excel-scrollbar">
            {students.map((item, index) => (
              <div
                key={item.id}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Text size="1" className="text-slate-500 font-mono shrink-0">
                        {index + 1}.
                      </Text>
                      <Text size="2" weight="medium" className="text-slate-900 truncate">
                        {item.siswa?.nama_lengkap || 'Tanpa nama'}
                      </Text>
                    </div>
                    {item.siswa?.nisn && (
                      <Text size="1" className="text-slate-500 font-mono block mt-0.5 ml-5">
                        NISN: {item.siswa.nisn}
                      </Text>
                    )}
                  </div>
                  <Badge 
                    color={getStudentMeta(item.status).color} 
                    variant="soft" 
                    size="1" 
                    style={{ borderRadius: 0, flexShrink: 0 }}
                  >
                    {getStudentMeta(item.status).label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ID */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            ID
          </Text>
        </div>
        <Text size="1" className="text-slate-500 font-mono break-all">
          {riwayat.id}
        </Text>
      </div>
    </div>
  )
}
