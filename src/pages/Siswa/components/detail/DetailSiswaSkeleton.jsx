import { Text } from '@radix-ui/themes'
import { User, History, BookOpen, Receipt } from 'lucide-react'

// Komponen skeleton shimmer effect
function SkeletonBox({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div className={`${width} ${height} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer ${className}`} />
  )
}

// Skeleton untuk InfoSiswaSection
function InfoSiswaSkeleton() {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Informasi Siswa
          </Text>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-x-8">
        {/* Kolom Kiri */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium w-40">Nama Lengkap</td>
              <td className="py-2"><SkeletonBox width="w-48" /></td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium">NISN</td>
              <td className="py-2"><SkeletonBox width="w-32" /></td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-600 font-medium">Jenis Kelamin</td>
              <td className="py-2"><SkeletonBox width="w-24" /></td>
            </tr>
          </tbody>
        </table>

        {/* Kolom Kanan */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium w-40">Tanggal Lahir</td>
              <td className="py-2"><SkeletonBox width="w-40" /></td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium">Alamat</td>
              <td className="py-2"><SkeletonBox width="w-56" /></td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-600 font-medium">No. WhatsApp Wali</td>
              <td className="py-2"><SkeletonBox width="w-36" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Skeleton untuk RiwayatKelasSection
function RiwayatKelasSkeleton() {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-purple-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Riwayat Kelas
          </Text>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-300">
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tahun Ajaran</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Kelas</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal Masuk</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal Keluar</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Catatan</th>
              <th className="px-4 py-2 text-center text-slate-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((index) => (
              <tr key={index} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-24" /></td>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-20" /></td>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-28" /></td>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-28" /></td>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-32" /></td>
                <td className="px-4 py-2 text-center"><SkeletonBox width="w-16" className="mx-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Skeleton untuk PeminatanSection
function PeminatanSkeleton() {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-green-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Peminatan
          </Text>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-300">
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tahun Ajaran</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Peminatan</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold">Tanggal Pilih</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((index) => (
              <tr key={index} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-24" /></td>
                <td className="px-4 py-2 border-r border-slate-200"><SkeletonBox width="w-32" /></td>
                <td className="px-4 py-2"><SkeletonBox width="w-28" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Skeleton untuk TagihanPembayaranSection
function TagihanPembayaranSkeleton() {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-amber-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Tagihan dan Pembayaran
          </Text>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-2 border-slate-300 bg-white shadow-sm">
              <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-1.5">
                <SkeletonBox width="w-24" height="h-3" />
              </div>
              <div className="px-3 py-2">
                <SkeletonBox width="w-20" height="h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse border-2 border-slate-300">
            <thead className="bg-slate-50">
              <tr className="border-b-2 border-slate-300">
                <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">No. Tagihan</th>
                <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Judul</th>
                <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Total Tagihan</th>
                <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Dibayar</th>
                <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Sisa</th>
                <th className="px-3 py-2 text-center text-slate-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((index) => (
                <tr key={index} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="px-3 py-2 border-r border-slate-200"><SkeletonBox width="w-24" /></td>
                  <td className="px-3 py-2 border-r border-slate-200"><SkeletonBox width="w-40" /></td>
                  <td className="px-3 py-2 border-r border-slate-200"><SkeletonBox width="w-24" /></td>
                  <td className="px-3 py-2 border-r border-slate-200"><SkeletonBox width="w-24" /></td>
                  <td className="px-3 py-2 border-r border-slate-200"><SkeletonBox width="w-24" /></td>
                  <td className="px-3 py-2 text-center"><SkeletonBox width="w-16" className="mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Main Skeleton Component
export function DetailSiswaSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="shrink-0 bg-white px-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <Text size="4" weight="bold" className="text-slate-900">
              Detail Siswa
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBox width="w-24" height="h-9" />
            <SkeletonBox width="w-28" height="h-9" />
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-auto excel-scrollbar bg-white">
        <div className="p-2 space-y-4">
          <InfoSiswaSkeleton />
          <RiwayatKelasSkeleton />
          <PeminatanSkeleton />
          <TagihanPembayaranSkeleton />
        </div>
      </div>

      {/* Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .excel-scrollbar::-webkit-scrollbar {
          width: 16px;
          height: 16px;
        }

        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }

        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }

        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
