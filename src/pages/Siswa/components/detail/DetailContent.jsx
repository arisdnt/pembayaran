import { InfoSiswaSection } from './InfoSiswaSection'
import { RiwayatKelasSection } from './RiwayatKelasSection'
import { PeminatanSection } from './PeminatanSection'
import { TagihanPembayaranSection } from './TagihanPembayaranSection'

export function DetailContent({ siswa, riwayatKelas, peminatan, tagihanData }) {
  return (
    <div className="flex-1 overflow-auto excel-scrollbar bg-white">
      <div className="p-2 space-y-4">
        <InfoSiswaSection siswa={siswa} />
        <RiwayatKelasSection riwayatKelas={riwayatKelas} />
        {peminatan.length > 0 && (
          <PeminatanSection peminatan={peminatan} />
        )}
        <TagihanPembayaranSection tagihanData={tagihanData} />
      </div>

      <style>{`
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
