"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { Trash2Icon, MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { appointmentsTable } from "@/db/schema"
import { deleteAppointment } from "@/actions/delete-appointment"

interface AppointmentsTableActionsProps {
  appointment: typeof appointmentsTable.$inferSelect & { patient?: { name: string } | null }
}

const AppointmentsTableActions = ({ appointment }: AppointmentsTableActionsProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const deleteAppointmentAction = useAction(deleteAppointment)

  const handleDelete = async () => {
    try {
      await deleteAppointmentAction.executeAsync({ id: appointment.id })
      toast.success("Agendamento deletado com sucesso.")
    } catch {
      toast.error("Erro ao deletar agendamento.")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
          <DropdownMenuContent>
          <DropdownMenuLabel>{appointment.patient?.name ?? "Paciente"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2Icon />
                Deletar
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso irá deletar o agendamento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default AppointmentsTableActions
