#!/bin/bash

# Script untuk menambahkan onPointerDownOutside dan onInteractOutside ke semua Dialog.Content
# yang belum memiliki properti tersebut

FILES=(
  "src/pages/Siswa/components/form/index.jsx"
  "src/pages/JenisPembayaran/components/form/JenisPembayaranFormDialog.jsx"
  "src/pages/WaliKelas/components/form/WaliKelasFormDialog.jsx"
  "src/pages/Kelas/components/form/KelasFormDialog.jsx"
  "src/pages/TahunAjaran/components/form/TahunAjaranFormDialog.jsx"
  "src/pages/Peminatan/components/PeminatanFormDialog.jsx"
  "src/pages/RiwayatWaliKelas/components/form/RiwayatWaliKelasFormDialog.jsx"
  "src/pages/RiwayatKelasSiswa/components/form/RiwayatKelasSiswaFormDialog.jsx"
  "src/pages/RincianTagihan/components/RincianTagihanFormDialog.jsx"
  "src/pages/PeminatanSiswa/components/PeminatanSiswaFormDialog/index.jsx"
  "src/pages/Tagihan/components/TagihanDetailModal.jsx"
  "src/pages/Kelas/components/detail/KelasDetailModal.jsx"
  "src/pages/TahunAjaran/components/detail/TahunAjaranDetailModal.jsx"
  "src/pages/JenisPembayaran/components/detail/JenisPembayaranDetailModal.jsx"
  "src/pages/Peminatan/components/PeminatanDetailModal.jsx"
  "src/pages/RiwayatWaliKelas/components/detail/RiwayatWaliKelasDetailModal.jsx"
  "src/pages/RiwayatKelasSiswa/components/detail/components/RiwayatDetailModal.jsx"
  "src/pages/WaliKelas/components/detail/components/WaliKelasDetailModal.jsx"
  "src/pages/PeminatanSiswa/components/PeminatanSiswaDetailModal.jsx"
  "src/pages/Tagihan/components/AddRincianModal.jsx"
  "src/pages/Siswa/components/SendMessageModal.jsx"
  "src/pages/Pembayaran/components/modals/PaymentInputModal.jsx"
  "src/pages/Pembayaran/components/modals/PaymentConfirmationModal.jsx"
  "src/pages/Pembayaran/components/modals/PaymentInvoiceModal.jsx"
  "src/pages/Pembayaran/components/modals/RincianTransaksiModal.jsx"
  "src/pages/Pembayaran/components/modals/BuktiPembayaranModal.jsx"
  "src/pages/Pembayaran/components/modals/RingkasanModal.jsx"
  "src/pages/KirimPesan/components/DeleteDialog.jsx"
  "src/pages/KirimPesan/components/SettingsModal.jsx"
  "src/pages/SyncStatus/components/PayloadDetailDialog.jsx"
  "src/components/modals/AboutModal.jsx"
  "src/components/modals/ConfirmExitDialog.jsx"
)

echo "Total files to process: ${#FILES[@]}"
