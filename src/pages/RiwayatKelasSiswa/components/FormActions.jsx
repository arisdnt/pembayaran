import { Flex, Button } from '@radix-ui/themes'

export function FormActions({ submitting, isEdit, onCancel }) {
  return (
    <Flex gap="3" mt="6" justify="end" className="border-t border-slate-200 pt-4">
      <Button 
        type="button"
        variant="soft" 
        color="gray" 
        disabled={submitting}
        onClick={onCancel}
        style={{ borderRadius: 0 }}
      >
        Batal
      </Button>
      <Button type="submit" disabled={submitting} style={{ borderRadius: 0 }}>
        {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
      </Button>
    </Flex>
  )
}
