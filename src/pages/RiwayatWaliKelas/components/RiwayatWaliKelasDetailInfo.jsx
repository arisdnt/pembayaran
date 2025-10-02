import { useState, useEffect } from 'react'
import { Badge, Text } from '@radix-ui/themes'
import { Calendar, Clock, FileText, Users } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'
import { supabase } from '../../../lib/supabaseClient'

const FieldItem = ({ label, icon: Icon, children, className = '' }) => (
  <div className={`border-b border-slate-200 pb-3 ${className}`}>
    <div className="flex items-center gap-2 mb-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
      <Text size="1" className="text-slate-600 font-medium uppercase tracking-wide">
        {label}
      </Text>
    </div>
    <div className="pl-5">{children}</div>
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

      const { data, error } = await supabase
        .from('riwayat_kelas_siswa')
        .select(`
          id,
          status,
          tanggal_masuk,
          tanggal_keluar,
          siswa:id_siswa(id, nama_lengkap, nisn)
        `)
        .eq('id_kelas', riwayat.id_kelas)
        .eq('id_tahun_ajaran', riwayat.id_tahun_ajaran)

      if (ignore) return

      if (error) {
        setStudents([])
        setStudentsError('Gagal memuat daftar siswa: ' + error.message)
      } else {
        const sorted = (data ?? []).sort((a, b) => {
          const nameA = a.siswa?.nama_lengkap?.toLocaleLowerCase('id-ID') || ''
          const nameB = b.siswa?.nama_lengkap?.toLocaleLowerCase('id-ID') || ''
          return nameA.localeCompare(nameB, 'id-ID')
        })
        setStudents(sorted)
      }

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
      <div className="bg-slate-50 border border-slate-200 px-4 py-3">
        <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
          Kaitan Wali Kelas & Tahun Ajaran
        </Text>
        <Text size="3" weight="bold" className="text-slate-900 block mt-1 leading-tight">
          {waliKelasName}
        </Text>
        {riwayat.wali_kelas?.nip && (
          <Text size="1" className="text-slate-500">
            NIP: {riwayat.wali_kelas.nip}
          </Text>
        )}
        <Text size="2" className="text-slate-600">
          Tahun Ajaran {tahunAjaranName}
        </Text>
        <Text size="2" className="text-slate-600">
          Kelas {kelasName || '—'}
        </Text>
        {riwayat.tahun_ajaran?.tanggal_mulai && riwayat.tahun_ajaran?.tanggal_selesai && (
          <Text size="1" className="text-slate-500">
            {formatDate(riwayat.tahun_ajaran.tanggal_mulai)} - {formatDate(riwayat.tahun_ajaran.tanggal_selesai)}
          </Text>
        )}
      </div>

      <FieldItem label="Daftar Siswa" icon={Users} className="border-b-0">
        {studentsLoading ? (
          <Text size="2" className="text-slate-500">
            Memuat daftar siswa...
          </Text>
        ) : studentsError ? (
          <Text size="2" className="text-red-600">
            {studentsError}
          </Text>
        ) : students.length === 0 ? (
          <Text size="2" className="text-slate-500">
            Belum ada siswa yang terhubung dengan wali kelas ini pada tahun ajaran terpilih.
          </Text>
        ) : (
          <div className="space-y-3">
            <Text size="1" className="text-slate-500" style={{ paddingLeft: '0.75rem' }}>
              Total {students.length} siswa terdata.
            </Text>
            <ul className="border border-slate-200 divide-y divide-slate-200 bg-white">
              {students.map((item) => {
                const meta = getStudentMeta(item.status)
                return (
                  <li key={item.id} className="px-3 py-2 flex items-start justify-between gap-3">
                    <div>
                      <Text size="2" weight="medium" className="text-slate-800 leading-tight">
                        {item.siswa?.nama_lengkap || 'Tanpa nama'}
                      </Text>
                      {item.siswa?.nisn && (
                        <Text size="1" className="text-slate-500 block">
                          NISN: {item.siswa.nisn}
                        </Text>
                      )}
                    </div>
                    <Badge color={meta.color} variant="soft" radius="full">
                      {meta.label}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </FieldItem>

      <FieldItem label="Periode Penugasan" icon={Calendar}>
        <Text size="2" className="text-slate-800">
          {formatDate(riwayat.tanggal_mulai)} - {riwayat.tanggal_selesai ? formatDate(riwayat.tanggal_selesai) : 'sekarang'}
        </Text>
        <Text size="1" className="text-slate-500 block mt-1">
          Durasi {calculateDuration(riwayat.tanggal_mulai, riwayat.tanggal_selesai)}
        </Text>
      </FieldItem>

      {riwayat.catatan && (
        <FieldItem label="Catatan" icon={FileText} className="border-b-0">
          <Text size="2" className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {riwayat.catatan}
          </Text>
        </FieldItem>
      )}

      <div className="pt-4 mt-4 border-t-2 border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-slate-400" />
          <Text size="1" className="text-slate-500">
            Dibuat: {formatDateTime(riwayat.created_at)}
          </Text>
        </div>
        {riwayat.updated_at && riwayat.updated_at !== riwayat.created_at && (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-slate-400" />
            <Text size="1" className="text-slate-500">
              Diperbarui: {formatDateTime(riwayat.updated_at)}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
