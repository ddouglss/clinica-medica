'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'


import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { doctorsTable, patientsTable } from '@/db/schema'
import AppAppointmentForm from './add-appointment-form'

interface AddAppointmentButtonProps {
  doctors: Array<typeof doctorsTable.$inferSelect>
  patients: Array<typeof patientsTable.$inferSelect>
}

const AddAppointmentButton = ({ doctors, patients }: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <AppAppointmentForm
        isOpen={isOpen}
        doctors={doctors}
        patients={patients}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  )
}

export default AddAppointmentButton


