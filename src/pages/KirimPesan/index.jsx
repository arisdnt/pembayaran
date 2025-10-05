import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../offline/db'
import { bulkInsertKirimPesan, deleteKirimPesanByContent, getPendingKirimPesan, updateKirimPesanStatusByContent } from '../../offline/actions/kirimPesan'
import { Button, Card, Flex, Select, Separator, Table, Text, Dialog } from '@radix-ui/themes'
import { format } from 'date-fns'
import { Copy, Check, BookOpen, GraduationCap, School, Clock, Filter, Trash2, CheckCircle2, AlertCircle, X, AlertTriangle, XCircle } from 'lucide-react'
import { sendWhatsAppBatch, normalizePhone } from '../../services/whatsappApi'

function formatCurrencyIDR(num) {
  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(num || 0))
  } catch {
    return `${num}`
  }
}


export default function KirimPesan() {
  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [tingkatList, setTingkatList] = useState([])

  const [selectedTA, setSelectedTA] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('_all')
  const [selectedKelas, setSelectedKelas] = useState('_all')

  // Force refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const forceRefresh = () => {
    console.log('[KirimPesan] Forcing refresh...')
    setRefreshTrigger(prev => prev + 1)
  }
  
  // Use IndexedDB as primary data source with manual refresh support
  const kirimPesanRaw = useLiveQuery(
    async () => {
      console.log('[KirimPesan] useLiveQuery executing... (refresh trigger:', refreshTrigger, ')')
      const data = await db.kirim_pesan.orderBy('tanggal_dibuat').toArray()
      console.log('[KirimPesan] Loaded messages:', data.length, 'rows')
      return data
    },
    [refreshTrigger] // Add refreshTrigger to force re-query
  )
  
  const kirimPesanData = kirimPesanRaw || []
  const kirimPesanLoading = kirimPesanRaw === undefined
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [rateMs, setRateMs] = useState(10000)
  const [logLines, setLogLines] = useState([])
  const [copied, setCopied] = useState(false)
  const [notification, setNotification] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: null })

  const logRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      // Load master lists from IndexedDB (synced data)
      const [ta, kk] = await Promise.all([
        db.tahun_ajaran.orderBy('tanggal_mulai').reverse().toArray(),
        db.kelas.orderBy('tingkat').toArray(),
      ])
      setTahunAjaranList(ta)
      setKelasList(kk)
      const uniqueTingkat = Array.from(new Set((kk || []).map(k => String(k.tingkat)))).sort((a,b) => (a.localeCompare(b, 'id', { numeric: true })))
      setTingkatList(uniqueTingkat)
      // Preselect active TA if any
      const aktif = ta.find(x => x.status_aktif)
      if (aktif) setSelectedTA(aktif.id)
    })()
  }, [])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logLines])

  const filteredKelas = useMemo(() => {
    if (!selectedTingkat || selectedTingkat === '_all') return kelasList
    return kelasList.filter(k => String(k.tingkat) === String(selectedTingkat))
  }, [kelasList, selectedTingkat])

  const generatePreview = async () => {
    if (!selectedTA) return []
    setLoading(true)
    try {
      // RKS filter by TA (+ tingkat / kelas optional)
      let rks = await db.riwayat_kelas_siswa.where('id_tahun_ajaran').equals(selectedTA).toArray()
      console.log('Total RKS ditemukan:', rks.length)
      if (selectedTingkat && selectedTingkat !== '_all') {
        const kelasIds = new Set(filteredKelas.map(k => k.id))
        rks = rks.filter(x => kelasIds.has(x.id_kelas))
        console.log('Setelah filter tingkat:', rks.length)
      }
      if (selectedKelas && selectedKelas !== '_all') {
        rks = rks.filter(x => x.id_kelas === selectedKelas)
        console.log('Setelah filter kelas:', rks.length)
      }

      const siswaMap = new Map()
      ;(await db.siswa.toArray()).forEach(s => siswaMap.set(s.id, s))
      const kelasMap = new Map()
      kelasList.forEach(k => kelasMap.set(k.id, k))
      
      // Collect tagihan & pembayaran for each RKS
      const tagihanAll = await db.tagihan.toArray()
      const tagihanByRks = new Map()
      tagihanAll.forEach(t => {
        const arr = tagihanByRks.get(t.id_riwayat_kelas_siswa) || []
        arr.push(t)
        tagihanByRks.set(t.id_riwayat_kelas_siswa, arr)
      })
      const rincianAll = await db.rincian_tagihan.toArray()
      const rincianByTagihan = new Map()
      rincianAll.forEach(r => {
        const arr = rincianByTagihan.get(r.id_tagihan) || []
        arr.push(r)
        rincianByTagihan.set(r.id_tagihan, arr)
      })
      const pembayaranAll = await db.pembayaran.toArray()
      const pembayaranByTagihan = new Map()
      pembayaranAll.forEach(p => {
        const arr = pembayaranByTagihan.get(p.id_tagihan) || []
        arr.push(p)
        pembayaranByTagihan.set(p.id_tagihan, arr)
      })
      const rincianBayarAll = await db.rincian_pembayaran.toArray()
      const rincianBayarByPembayaran = new Map()
      rincianBayarAll.forEach(rp => {
        const arr = rincianBayarByPembayaran.get(rp.id_pembayaran) || []
        arr.push(rp)
        rincianBayarByPembayaran.set(rp.id_pembayaran, arr)
      })

      const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || 'http://namadomain'
      const taName = (tahunAjaranList.find(x => x.id === selectedTA)?.nama) || ''

      const rows = []
      let skippedNoSiswa = 0
      let skippedNoKelas = 0
      let skippedNoWhatsApp = 0
      
      for (const rec of rks) {
        const s = siswaMap.get(rec.id_siswa)
        const k = kelasMap.get(rec.id_kelas)
        if (!s) {
          skippedNoSiswa++
          continue
        }
        if (!k) {
          skippedNoKelas++
          continue
        }
        const nomor = s.nomor_whatsapp_wali || ''
        if (!nomor) {
          skippedNoWhatsApp++
          continue
        }

        // Sum tagihan
        const tgs = tagihanByRks.get(rec.id) || []
        const totalTagihan = tgs.reduce((acc, t) => {
          const rinci = rincianByTagihan.get(t.id) || []
          const sum = rinci.reduce((a, r) => a + Number(r.jumlah || 0), 0)
          return acc + sum
        }, 0)
        // Sum pembayaran
        const totalPembayaran = tgs.reduce((acc, t) => {
          const pays = pembayaranByTagihan.get(t.id) || []
          const sumPay = pays.reduce((a, p) => {
            const rinci = rincianBayarByPembayaran.get(p.id) || []
            const sum = rinci.reduce((x, y) => x + Number(y.jumlah_dibayar || 0), 0)
            return a + sum
          }, 0)
          return acc + sumPay
        }, 0)
        const tunggakan = Math.max(0, totalTagihan - totalPembayaran)

        const link = `${baseUrl}/nisn/${s.nisn}`
        const pesan = [
          `Yth. ${s.nama_wali_siswa || 'Wali Murid'},`,
          `Informasi Tagihan Siswa:`,
          `Nama: ${s.nama_lengkap}`,
          `NISN: ${s.nisn}`,
          `Tahun Ajaran: ${taName}`,
          `Kelas: ${k.tingkat} - ${k.nama_sub_kelas}`,
          `Total Tagihan: ${formatCurrencyIDR(totalTagihan)}`,
          `Total Pembayaran: ${formatCurrencyIDR(totalPembayaran)}`,
          `Total Tunggakan: ${formatCurrencyIDR(tunggakan)}`,
          `Rincian lengkap: ${link}`,
          '',
          'Terima kasih.'
        ].join('\n')

        rows.push({
          nomor_whatsapp: normalizePhone(nomor), // Normalize phone number to ensure consistency
          isi_pesan: pesan,
          status: 'pending',
          tahun_ajaran: taName,
          tingkat_kelas: String(k.tingkat),
          kelas_spesifik: `${k.tingkat} - ${k.nama_sub_kelas}`,
        })
      }
      
      console.log('Generate preview selesai:')
      console.log('- Total rows berhasil:', rows.length)
      console.log('- Skipped (siswa tidak ditemukan):', skippedNoSiswa)
      console.log('- Skipped (kelas tidak ditemukan):', skippedNoKelas)
      console.log('- Skipped (nomor WA kosong):', skippedNoWhatsApp)
      
      return rows
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleGenerate = async () => {
    const rows = await generatePreview()
    if (!rows || rows.length === 0) {
      showNotification('error', 'Tidak ada data pesan untuk digenerate. Periksa filter atau pastikan siswa memiliki nomor WhatsApp wali.')
      return
    }
    setLoading(true)
    try {
      // Use IndexedDB actions to insert messages (will sync to Supabase via outbox)
      await bulkInsertKirimPesan(rows)
      
      showNotification('success', `Berhasil generate ${rows.length} pesan ke database.`)
    } catch (e) {
      console.error(e)
      showNotification('error', 'Gagal generate data kirim pesan: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const appendLog = (line) => setLogLines(prev => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ${line}`])

  const handleCopyLog = async () => {
    try {
      const logText = logLines.join('\n')
      await navigator.clipboard.writeText(logText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy log:', err)
      alert('Gagal menyalin log')
    }
  }

  const handleDeleteRow = (index) => {
    setDeleteDialog({ open: true, index })
  }

  const confirmDelete = async () => {
    if (deleteDialog.index !== null) {
      const rowToDelete = kirimPesanData[deleteDialog.index]
      
      try {
        // Delete using IndexedDB action (will sync to Supabase via outbox)
        await deleteKirimPesanByContent(rowToDelete.nomor_whatsapp, rowToDelete.isi_pesan)
        
        setDeleteDialog({ open: false, index: null })
        showNotification('success', 'Data berhasil dihapus dari database.')
      } catch (e) {
        console.error('Error deleting from database:', e)
        showNotification('error', 'Gagal menghapus data dari database: ' + e.message)
        setDeleteDialog({ open: false, index: null })
      }
    }
  }

  const handleKirim = async () => {
    try {
      setSending(true)
      setLogLines([])
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('🚀 MEMULAI PROSES PENGIRIMAN PESAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('📡 Menggunakan: Supabase Edge Function (send-wa)')
      appendLog(`⏱️  Delay antar pesan: ${rateMs / 1000} detik`)
      appendLog('')

      // Validate environment
      appendLog('🔍 Memvalidasi konfigurasi...')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const functionsBase = supabaseUrl ? supabaseUrl.replace('.supabase.co', '.functions.supabase.co') : ''
      const functionUrl = functionsBase ? `${functionsBase}/send-wa` : 'N/A'
      appendLog(`    └─ Function URL: ${functionUrl}`)
      appendLog(`    └─ Supabase Project: ${supabaseUrl || 'N/A'}`)
      appendLog(`    └─ Network: ${navigator.onLine ? '✅ Online' : '❌ Offline'}`)
      appendLog('')

      // Get pending messages from IndexedDB
      const data = await getPendingKirimPesan()
      if (!data || data.length === 0) {
        appendLog('⚠️  Tidak ada pesan pending untuk dikirim.')
        appendLog('')
        setSending(false)
        return
      }
      appendLog(`📊 Total pesan pending: ${data.length} pesan`)
      appendLog('')

      // Transform data untuk API
      const messages = data.map(item => ({
        target: item.nomor_whatsapp,
        message: item.isi_pesan
      }))

      appendLog('🔄 Memulai pengiriman batch...')
      appendLog('')

      // Kirim menggunakan Supabase Edge Function
      const results = await sendWhatsAppBatch(messages, {
        delaySeconds: rateMs / 1000,
        typing: false,
        onProgress: ({ current, total, progress, message }) => {
          appendLog(`[${current}/${total}] 📤 ${message} (${progress}%)`)
        },
        onSent: async ({ nomor, isi_pesan, response, current, total }) => {
          // Parse response detail
          const detail = response?.detail || 'message sent'
          const requestId = response?.id ? `ID: ${response.id[0]}` : ''
          const processStatus = response?.process || 'pending'
          
          appendLog(`[${current}/${total}] ✅ BERHASIL ke ${nomor}`)
          if (requestId) {
            appendLog(`    └─ ${requestId}`)
          }
          appendLog(`    └─ Status: ${detail}`)
          appendLog(`    └─ Process: ${processStatus}`)
          appendLog('')
          
          // Mark as sent using IndexedDB action (will sync to Supabase via outbox)
          console.log('[KirimPesan] Calling updateKirimPesanStatusByContent with:', { nomor, pesan_length: isi_pesan.length })
          await updateKirimPesanStatusByContent(nomor, isi_pesan, 'sent')
          console.log('[KirimPesan] Update complete, forcing UI refresh...')
          
          // Force UI refresh to ensure table updates
          forceRefresh()
        },
        onError: async ({ target, error, errorType, httpStatus, current, total }) => {
          appendLog(`[${current}/${total}] ❌ GAGAL ke ${target}`)
          appendLog(`    └─ Error: ${error}`)
          if (errorType) {
            appendLog(`    └─ Type: ${errorType}`)
          }
          if (httpStatus) {
            appendLog(`    └─ HTTP Status: ${httpStatus}`)
          }
          
          // Specific error handling
          if (errorType === 'network') {
            appendLog(`    └─ 💡 Saran:`)
            appendLog(`       • Periksa koneksi internet`)
            appendLog(`       • Periksa CSP/allowlist untuk domain Supabase Functions`)
            appendLog(`       • Coba akses ${functionUrl} di browser (OPTIONS/POST)`)            
            appendLog(`       • Periksa Functions logs di Supabase Dashboard`)
            appendLog(`       • Periksa firewall/antivirus`)
          } else if (errorType === 'auth') {
            appendLog(`    └─ 💡 Saran: Periksa token Fonnte (disimpan sebagai secret FONNTE_TOKEN di Supabase)`) 
          }
          appendLog('')
          
          // Mark as failed using IndexedDB action
          const normalizedTarget = normalizePhone(target)
          // Find the message in data by target
          const failedMsg = data.find(m => normalizePhone(m.nomor_whatsapp) === normalizedTarget)
          if (failedMsg) {
            console.log('[KirimPesan] Marking message as failed:', { target: normalizedTarget })
            await updateKirimPesanStatusByContent(normalizedTarget, failedMsg.isi_pesan, 'failed')
            
            // Force UI refresh
            forceRefresh()
          }
        },
        onDelay: ({ current, total, delaySeconds, nextTarget }) => {
          appendLog(`[${current}/${total}] ⏳ Menunggu ${delaySeconds} detik...`)
          appendLog(`    └─ Pesan berikutnya: ${nextTarget}`)
          appendLog('')
        }
      })

      // Summary
      appendLog('')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('📈 RINGKASAN PENGIRIMAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog(`✅ Berhasil: ${results.success} pesan`)
      appendLog(`❌ Gagal: ${results.failed} pesan`)
      appendLog(`📊 Total: ${results.total} pesan`)
      appendLog(`⏱️  Durasi: ${results.duration} detik`)
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('')
      appendLog('✅ Proses pengiriman selesai!')
      
      showNotification('success', `Berhasil: ${results.success}, Gagal: ${results.failed} dari ${results.total} pesan`)
    } catch (e) {
      console.error('Full error:', e)
      const errorMsg = e?.message || String(e) || 'Unknown error'
      appendLog('')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('❌ TERJADI KESALAHAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog(`Error: ${errorMsg}`)
      appendLog('')
      showNotification('error', 'Gagal mengirim pesan: ' + errorMsg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div
            className={`
              flex items-start gap-3 px-3 py-2.5 shadow-lg border min-w-[320px] max-w-[400px]
              ${notification.type === 'success' ? 'bg-white border-green-500 border-l-4' : 'bg-white border-red-500 border-l-4'}
            `}
            style={{ borderRadius: 0 }}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ borderRadius: 0 }}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-white" />
              ) : (
                <AlertCircle className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-bold block mb-0.5 ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {notification.type === 'success' ? 'Berhasil' : 'Gagal'}
              </span>
              <p className={`text-xs leading-relaxed ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex h-5 w-5 items-center justify-center hover:bg-slate-100 shrink-0 transition-colors"
              style={{ borderRadius: 0 }}
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Kolom Kiri - Tabel (75%) */}
        <div className="col-span-9 flex flex-col overflow-hidden">
          <Card className="p-4 flex flex-col h-full overflow-hidden">
            {/* Filtering & Generate */}
            <div className="mb-4 pb-4 border-b flex-shrink-0">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <Text size="2" weight="medium" className="text-slate-700">Filter:</Text>
                </div>

                {/* Tahun Ajaran */}
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  <Select.Root value={selectedTA} onValueChange={setSelectedTA}>
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

                {/* Tingkat */}
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                    <Select.Trigger style={{ borderRadius: 0, width: '140px' }} placeholder="Tingkat" />
                    <Select.Content style={{ borderRadius: 0 }}>
                      <Select.Item value="_all">Semua Tingkat</Select.Item>
                      {tingkatList.map(t => (
                        <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                {/* Kelas */}
                <div className="flex items-center gap-2">
                  <School className="h-3.5 w-3.5 text-green-500" />
                  <Select.Root value={selectedKelas} onValueChange={setSelectedKelas}>
                    <Select.Trigger style={{ borderRadius: 0, width: '160px' }} placeholder="Kelas" />
                    <Select.Content style={{ borderRadius: 0 }}>
                      <Select.Item value="_all">Semua Kelas</Select.Item>
                      {filteredKelas.map(k => (
                        <Select.Item key={k.id} value={k.id}>{k.tingkat} - {k.nama_sub_kelas}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                {/* Rate Limit */}
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <input
                    type="number"
                    min={5}
                    max={60}
                    step={1}
                    className="border border-slate-300 px-2 py-1 w-20 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ borderRadius: 0, height: '28px' }}
                    value={rateMs / 1000}
                    onChange={e => setRateMs(Number(e.target.value || 10) * 1000)}
                    placeholder="detik"
                  />
                  <Text size="1" className="text-slate-600">detik/pesan</Text>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    disabled={loading}
                    onClick={handleGenerate}
                    className="cursor-pointer"
                    style={{ borderRadius: 0 }}
                    size="2"
                  >
                    {loading ? 'Memproses...' : 'Generate'}
                  </Button>
                  <Button
                    disabled={sending || kirimPesanData.length === 0}
                    onClick={handleKirim}
                    color="green"
                    className="cursor-pointer"
                    style={{ borderRadius: 0 }}
                    size="2"
                  >
                    {sending ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabel Preview */}
            <Text weight="bold" className="mb-2 block flex-shrink-0">Preview ({kirimPesanData.length})</Text>
            <div className="overflow-auto flex-1 border">
              <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold border-b" style={{ width: '9%' }}>Nomor</th>
                    <th className="px-2 py-2 text-left font-semibold border-b" style={{ width: '11%' }}>Tahun Ajaran</th>
                    <th className="px-2 py-2 text-left font-semibold border-b" style={{ width: '5%' }}>Tingkat</th>
                    <th className="px-2 py-2 text-left font-semibold border-b" style={{ width: '8%' }}>Kelas</th>
                    <th className="px-2 py-2 text-left font-semibold border-b" style={{ width: '50%' }}>Isi Pesan</th>
                    <th className="px-2 py-2 text-center font-semibold border-b" style={{ width: '8%' }}>Status</th>
                    <th className="px-2 py-2 text-center font-semibold border-b" style={{ width: '9%' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kirimPesanData.map((r, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50">
                      <td className="px-2 py-2 break-words">{r.nomor_whatsapp}</td>
                      <td className="px-2 py-2 break-words">{r.tahun_ajaran}</td>
                      <td className="px-2 py-2 break-words">{r.tingkat_kelas}</td>
                      <td className="px-2 py-2 break-words">{r.kelas_spesifik}</td>
                      <td className="px-2 py-2 text-xs break-words">
                        {r.isi_pesan.split('\n').map((line, lineIdx) => {
                          // Highlight "Nama: ..." dengan warna merah bold
                          if (line.startsWith('Nama: ')) {
                            const nama = line.substring(6)
                            return (
                              <span key={lineIdx}>
                                Nama: <span className="text-red-600 font-bold">{nama}</span>
                                {lineIdx < r.isi_pesan.split('\n').length - 1 && ' '}
                              </span>
                            )
                          }
                          // Highlight "Kelas: ..." dengan warna merah bold
                          if (line.startsWith('Kelas: ')) {
                            const kelas = line.substring(7)
                            return (
                              <span key={lineIdx}>
                                Kelas: <span className="text-red-600 font-bold">{kelas}</span>
                                {lineIdx < r.isi_pesan.split('\n').length - 1 && ' '}
                              </span>
                            )
                          }
                          return <span key={lineIdx}>{line}{lineIdx < r.isi_pesan.split('\n').length - 1 && ' '}</span>
                        })}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {r.status === 'sent' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                            <CheckCircle2 className="w-3 h-3" />
                            Terkirim
                          </span>
                        ) : r.status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                            <XCircle className="w-3 h-3" />
                            Gagal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(idx)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {kirimPesanData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-2 py-8 text-center text-slate-600">
                        {kirimPesanLoading ? 'Memuat data...' : 'Belum ada data. Pilih filter lalu klik Generate.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Kolom Kanan - Log (25%) */}
        <div className="col-span-3 flex flex-col overflow-hidden">
          <Card className="p-4 flex flex-col h-full overflow-hidden">
            <Flex justify="between" align="center" className="mb-2 flex-shrink-0">
              <Text weight="bold">Log</Text>
              <Button
                size="1"
                variant="soft"
                disabled={logLines.length === 0}
                onClick={handleCopyLog}
                className="cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </Flex>
            <div ref={logRef} className="border p-2 overflow-auto bg-black text-green-300 text-xs font-mono flex-1">
              {logLines.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <Text size="1" className="text-slate-600 mt-2 block flex-shrink-0">Pengiriman menggunakan Fonnte API. Pastikan device WhatsApp terhubung di dashboard Fonnte.</Text>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, index: null })}>
        <Dialog.Content
          style={{
            maxWidth: '500px',
            width: '95vw',
            padding: 0,
            borderRadius: 0,
            overflow: 'hidden'
          }}
          className="border-2 border-slate-300 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-red-50 to-red-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center border border-red-700 bg-red-600 shadow-sm">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Hapus Data
                </Text>
                <Text size="1" className="text-slate-500 block mt-0.5">
                  Konfirmasi penghapusan data
                </Text>
              </div>
            </div>
            <button
              onClick={() => setDeleteDialog({ open: false, index: null })}
              className="flex h-8 w-8 items-center justify-center hover:bg-red-100 hover:border-red-400 transition-all border border-slate-300 group"
              aria-label="Close"
              type="button"
            >
              <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white p-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <Text size="2" weight="medium" className="text-red-900 mb-1 block">
                  Peringatan
                </Text>
                <Text size="2" className="text-red-700">
                  Data yang dihapus dari preview akan hilang dan tidak akan dikirim.
                </Text>
              </div>
            </div>

            <Text size="2" className="text-slate-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus baris ini dari preview?
            </Text>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
            <Button
              type="button"
              variant="soft"
              color="gray"
              onClick={() => setDeleteDialog({ open: false, index: null })}
              style={{ borderRadius: 0 }}
              className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
            >
              Batal
            </Button>
            <Button
              onClick={confirmDelete}
              style={{
                borderRadius: 0,
                backgroundColor: '#dc2626',
                border: '1px solid #b91c1c'
              }}
              className="cursor-pointer text-white shadow-sm hover:shadow"
            >
              Hapus
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
