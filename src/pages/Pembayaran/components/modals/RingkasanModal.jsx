import { useState } from 'react'
import { Dialog, Button, Text, Select, Badge } from '@radix-ui/themes'
import { TrendingUp, X, Calendar, Banknote } from 'lucide-react'
import { useRingkasan } from '../../hooks/useRingkasan'

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function RingkasanModal({ open, onOpenChange }) {
  const [dateFilter, setDateFilter] = useState('today')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { data, loading } = useRingkasan(dateFilter, startDate, endDate)

  const filterOptions = [
    { value: 'today', label: 'Hari Ini' }, { value: '3days', label: '3 Hari Terakhir' },
    { value: '7days', label: '7 Hari Terakhir' }, { value: '14days', label: '14 Hari Terakhir' },
    { value: '30days', label: '1 Bulan Terakhir' }, { value: 'custom', label: 'Rentang Waktu' },
  ]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '650px', width: '95vw', padding: 0, borderRadius: 0, overflow: 'hidden' }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        <div className="flex items-center border-b-2 border-slate-300 bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center border border-blue-700 bg-blue-600 shadow-sm">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
              Ringkasan Pembayaran
            </Text>
          </div>
        </div>

        <div className="bg-white p-4 space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Text size="1" weight="medium" className="text-slate-700 mb-1 block">Filter Periode</Text>
              <Select.Root value={dateFilter} onValueChange={setDateFilter}>
                <Select.Trigger style={{ borderRadius: 0 }} className="w-full" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {filterOptions.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value}>{opt.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
            {dateFilter === 'custom' && (
              <>
                <div className="flex-1">
                  <Text size="1" weight="medium" className="text-slate-700 mb-1 block">Dari</Text>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Text size="1" weight="medium" className="text-slate-700 mb-1 block">Sampai</Text>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {loading ? <Text size="2" className="text-slate-500">Memuat data...</Text> : data ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border-2 border-green-200 p-3">
                  <Text size="1" className="text-green-700 uppercase tracking-wider mb-1 block">Tunai</Text>
                  <Text size="3" weight="bold" className="text-green-900">{formatCurrency(data.tunai)}</Text>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 p-3">
                  <Text size="1" className="text-blue-700 uppercase tracking-wider mb-1 block">Non Tunai</Text>
                  <Text size="3" weight="bold" className="text-blue-900">{formatCurrency(data.nonTunai)}</Text>
                </div>
                <div className="bg-slate-100 border-2 border-slate-300 p-3">
                  <Text size="1" className="text-slate-700 uppercase tracking-wider mb-1 block">Total</Text>
                  <Text size="3" weight="bold" className="text-slate-900">{formatCurrency(data.total)}</Text>
                </div>
              </div>

              <div className="bg-slate-50 border-2 border-slate-200 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <Text size="2" weight="bold" className="text-slate-800">Detail Metode Pembayaran</Text>
                </div>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {Object.entries(data.metodePembayaran).map(([method, stats]) => (
                    <div key={method} className="flex items-center justify-between bg-white border border-slate-200 p-2">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-slate-500" />
                        <Text size="2" weight="medium" className="text-slate-800">{method}</Text>
                        <Badge size="1" style={{ borderRadius: 0 }} variant="soft">{stats.count} transaksi</Badge>
                      </div>
                      <Text size="2" weight="bold" className="text-slate-900">{formatCurrency(stats.total)}</Text>
                    </div>
                  ))}
                  {Object.keys(data.metodePembayaran).length === 0 && <Text size="2" className="text-slate-500">Tidak ada transaksi pada periode ini</Text>}
                </div>
              </div>

              <div className="border-t pt-2">
                <Text size="1" className="text-slate-600">Total Transaksi: <strong>{data.jumlahTransaksi}</strong></Text>
              </div>
            </>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <Button
            size="2"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0, backgroundColor: '#2563eb', border: '1px solid #1e40af' }}
            className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Tutup
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
