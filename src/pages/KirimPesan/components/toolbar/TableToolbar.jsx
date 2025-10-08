import { Button } from '@radix-ui/themes'
import { Settings } from 'lucide-react'
import { FilterControls } from './FilterControls'

export function TableToolbar({
  tahunAjaranList,
  tingkatList,
  filteredKelas,
  selectedTA,
  selectedTingkat,
  selectedKelas,
  loading,
  sending,
  messageCount,
  onTAChange,
  onTingkatChange,
  onKelasChange,
  onGenerate,
  onKirim,
  onCancel,
  onSettings,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Grid 10 kolom: masing-masing 10% dan single-row, tidak wrap */}
      <div 
        className="grid items-center gap-2 px-4 py-2.5"
        style={{ 
          gridTemplateColumns: 'repeat(10, calc((100% - (9 * 0.5rem)) / 10))',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {/* Kolom 1 (10%): Filter Tahun Ajaran */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterControls
            tahunAjaranList={tahunAjaranList}
            tingkatList={tingkatList}
            filteredKelas={filteredKelas}
            selectedTA={selectedTA}
            selectedTingkat={selectedTingkat}
            selectedKelas={selectedKelas}
            onTAChange={onTAChange}
            onTingkatChange={onTingkatChange}
            onKelasChange={onKelasChange}
            columnIndex={0}
          />
        </div>
        
        {/* Kolom 2 (10%): Filter Tingkat */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterControls
            tahunAjaranList={tahunAjaranList}
            tingkatList={tingkatList}
            filteredKelas={filteredKelas}
            selectedTA={selectedTA}
            selectedTingkat={selectedTingkat}
            selectedKelas={selectedKelas}
            onTAChange={onTAChange}
            onTingkatChange={onTingkatChange}
            onKelasChange={onKelasChange}
            columnIndex={1}
          />
        </div>

        {/* Kolom 3 (10%): Filter Kelas */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterControls
            tahunAjaranList={tahunAjaranList}
            tingkatList={tingkatList}
            filteredKelas={filteredKelas}
            selectedTA={selectedTA}
            selectedTingkat={selectedTingkat}
            selectedKelas={selectedKelas}
            onTAChange={onTAChange}
            onTingkatChange={onTingkatChange}
            onKelasChange={onKelasChange}
            columnIndex={2}
          />
        </div>

        {/* Kolom 4-7 (40%): Reserved */}
        <div style={{ gridColumn: 'span 4' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

        {/* Kolom 8 (10%): Settings Button */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onSettings}
            size="2"
            style={{ 
              borderRadius: 0, 
              height: '36px', 
              backgroundColor: '#64748b',
              border: '1px solid #475569'
            }}
            className="cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate"
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="truncate">Setting</span>
          </Button>
        </div>

        {/* Kolom 9 (10%): Generate Button */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onGenerate}
            disabled={loading}
            size="2"
            style={{ 
              borderRadius: 0, 
              height: '36px', 
              backgroundColor: '#0066cc',
              border: '1px solid #0052a3'
            }}
            className={`cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate ${loading ? 'opacity-50' : ''}`}
          >
            <span className="truncate">{loading ? 'Proses...' : 'Generate'}</span>
          </Button>
        </div>

        {/* Kolom 10 (10%): Kirim/Hentikan Button */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={sending ? onCancel : onKirim}
            disabled={!sending && messageCount === 0}
            size="2"
            style={{ 
              borderRadius: 0, 
              height: '36px', 
              backgroundColor: sending ? '#dc2626' : '#16a34a',
              border: sending ? '1px solid #b91c1c' : '1px solid #15803d'
            }}
            className={`cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate ${!sending && messageCount === 0 ? 'opacity-50' : ''}`}
          >
            <span className="truncate">{sending ? 'Hentikan' : 'Kirim'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
