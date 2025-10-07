import { PrimaryInfoSection } from '../detail/components/PrimaryInfoSection'
import { FormError } from './FormError'

export function SingleSiswaEditForm({
  formData,
  setFormData,
  siswaList,
  kelasList,
  tahunAjaranList,
  error
}) {
  return (
    <div className="p-6 space-y-6 overflow-auto">
      <PrimaryInfoSection
        formData={formData}
        setFormData={setFormData}
        siswaList={siswaList}
        kelasList={kelasList}
        tahunAjaranList={tahunAjaranList}
      />
      <FormError error={error} />
    </div>
  )
}
