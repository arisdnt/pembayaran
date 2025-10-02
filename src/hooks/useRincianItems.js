import { supabase } from '../lib/supabaseClient'

export function useRincianItems(rincianItems, setRincianItems, jenisPembayaranList) {
  const handleAddRincian = () => {
    setRincianItems([...rincianItems, {
      id_jenis_pembayaran: '',
      deskripsi: '',
      jumlah: '',
      urutan: rincianItems.length + 1,
    }])
  }

  const handleRemoveRincian = async (index) => {
    const item = rincianItems[index]
    
    if (item.id) {
      await supabase
        .from('rincian_tagihan')
        .delete()
        .eq('id', item.id)
    }
    
    setRincianItems(rincianItems.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    const updated = [...rincianItems]
    updated[index][field] = value
    
    if (field === 'id_jenis_pembayaran') {
      const jenis = jenisPembayaranList.find(j => j.id === value)
      if (jenis) {
        updated[index].deskripsi = jenis.nama
        updated[index].jumlah = jenis.jumlah_default || ''
      }
    }
    
    setRincianItems(updated)
  }

  const totalTagihan = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah || 0), 0)

  return {
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    totalTagihan,
  }
}
