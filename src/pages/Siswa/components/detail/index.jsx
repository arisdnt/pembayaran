import { PageLayout } from '../../../../layout/PageLayout'
import { DetailHeader } from './DetailHeader'
import { DetailContent } from './DetailContent'

export function DetailSiswaLayout({ siswa, riwayatKelas, peminatan, tagihanData, onBack, onSendMessage }) {
  const hasWhatsApp = Boolean(siswa?.nomor_whatsapp_wali)

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        <DetailHeader 
          statusAktif={siswa.status_aktif} 
          onBack={onBack}
          onSendMessage={onSendMessage}
          hasWhatsApp={hasWhatsApp}
        />
        <DetailContent
          siswa={siswa}
          riwayatKelas={riwayatKelas}
          peminatan={peminatan}
          tagihanData={tagihanData}
        />
      </div>
    </PageLayout>
  )
}

export { DetailLoadingState } from './DetailLoadingState'
export { DetailErrorState } from './DetailErrorState'
export { DetailNotFoundState } from './DetailNotFoundState'
