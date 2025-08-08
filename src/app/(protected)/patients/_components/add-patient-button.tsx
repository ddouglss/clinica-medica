'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import UpsertPatientForm from '@/app/(protected)/patients/_components/upsert-patient-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar paciente
        </Button>
      </DialogTrigger>
      <UpsertPatientForm onSuccess={() => setIsOpen(false)}isOpen={isOpen}
        />
    </Dialog>
  )
}

export default AddPatientButton


