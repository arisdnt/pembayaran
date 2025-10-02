import { useState } from 'react'
import { Dialog, Button, Flex } from '@radix-ui/themes'

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, itemName }) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: 450,
          borderRadius: 0
        }}
      >
        <Dialog.Title>Hapus Riwayat Kelas Siswa</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Apakah Anda yakin ingin menghapus riwayat ini? Tindakan ini tidak dapat dibatalkan.
        </Dialog.Description>

        <Flex gap="3" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={submitting} style={{ borderRadius: 0 }}>
              Batal
            </Button>
          </Dialog.Close>
          <Button color="red" onClick={handleDelete} disabled={submitting} style={{ borderRadius: 0 }}>
            {submitting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
