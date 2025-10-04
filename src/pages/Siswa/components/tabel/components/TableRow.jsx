import { useState } from 'react'
import { Badge, Switch, Text } from '@radix-ui/themes'
import { Clock, Copy, Check } from 'lucide-react'
import { formatDate, formatDateTime, formatCurrency } from '../../../helpers/formatters'
import { TableActions } from './TableActions'

export function TableRow({ 
  item, 
  index, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onViewDetail 
}) {
  const [copiedWA, setCopiedWA] = useState(false)

  const handleCopyWA = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.nomor_whatsapp_wali)
    setCopiedWA(true)
    setTimeout(() => setCopiedWA(false), 2000)
  }

  return (
    <tr
      onClick={() => onSelect(item)}
      className={`group cursor-pointer border-b border-slate-200 ${
        isSelected
          ? 'bg-blue-100 border-l-4 border-l-blue-600'
          : index % 2 === 0
            ? 'bg-white hover:bg-blue-50'
            : 'bg-slate-50 hover:bg-blue-50'
      }`}
    >
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex flex-col gap-0.5">
          <Text size="2" weight="medium" className="text-slate-900 font-sans">
            {item.nama_lengkap}
          </Text>
          <Text size="1" className="text-slate-500 leading-tight">
            {formatDate(item.tanggal_lahir)}
          </Text>
        </div>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700 font-mono font-medium">
          {item.nisn || '—'}
        </Text>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Text size="2" weight="bold" className="text-slate-900 font-mono leading-tight">
              {item.nomor_whatsapp_wali || '—'}
            </Text>
            {item.nomor_whatsapp_wali && (
              <button
                onClick={handleCopyWA}
                className="flex h-5 w-5 items-center justify-center hover:bg-red-50 transition-colors border border-slate-300 hover:border-red-400 group"
                title="Salin nomor WhatsApp"
              >
                {copiedWA ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-slate-600 group-hover:text-red-600 transition-colors" />
                )}
              </button>
            )}
          </div>
          {item.nama_wali_siswa && (
            <Text size="1" className="text-red-600 leading-tight">
              {item.nama_wali_siswa}
            </Text>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex flex-col gap-0.5">
          <Text size="2" className="text-slate-700 font-sans leading-tight">
            {item.kelas_terbaru 
              ? `${item.kelas_terbaru.tingkat} ${item.kelas_terbaru.nama_sub_kelas}` 
              : '—'}
          </Text>
          {item.peminatan_terbaru ? (
            <Text size="1" className="text-red-600 font-medium leading-tight">
              {item.peminatan_terbaru.nama}
            </Text>
          ) : (
            <Text size="1" className="text-red-600 font-medium leading-tight">
              ---
            </Text>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700 font-sans">
          {item.tahun_ajaran_terbaru?.nama || '—'}
        </Text>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className="text-slate-900 font-mono">
          {formatCurrency(item.total_tagihan || 0)}
        </Text>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className="text-green-700 font-mono">
          {formatCurrency(item.total_dibayar || 0)}
        </Text>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <Text 
          size="2" 
          weight="bold" 
          className={item.total_tunggakan > 0 ? "text-red-600 font-mono" : "text-green-600 font-mono"}
        >
          {formatCurrency(item.total_tunggakan || 0)}
        </Text>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex items-center gap-2.5">
          <Switch
            checked={item.status_aktif}
            onCheckedChange={() => onToggleStatus(item)}
            size="2"
            className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <Badge
            variant="solid"
            color={item.status_aktif ? 'green' : 'gray'}
            className="text-[0.7rem] font-semibold px-2"
            style={{ borderRadius: 0 }}
          >
            {item.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </td>
      
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-sans">
            {formatDateTime(item.diperbarui_pada || item.dibuat_pada)}
          </span>
        </div>
      </td>
      
      <td className="px-4 py-3 text-center">
        <TableActions
          item={item}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  )
}
