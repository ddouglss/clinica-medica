
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit2Icon, MoreHorizontalIcon, PaperclipIcon, Trash2Icon } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import UpsertPatientForm from "./upsert-patient-form"
import { patientsTable } from "@/db/schema"
import { useState } from "react"
import PatientReportDialog from "./patient-report-dialog"
import { useAction } from "next-safe-action/hooks"
import { deletePatient } from "@/actions/delete-patient"
import { toast } from "sonner"
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


interface PatientsTableActionsProps {
  patient: typeof patientsTable.$inferSelect;
}

const PatientsTableActions = ({ patient }: PatientsTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false)
  const [reportDialogIsOpen, setReportDialogIsOpen] = useState(false)

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => toast.success("Paciente deletado com sucesso."),
    onError: () => toast.error("Erro ao deletar paciente."),
  })

  const handleDelete = () => {
    deletePatientAction.execute({ id: patient.id })
  }

  return (
    <>
      <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setReportDialogIsOpen(true)}>
              <PaperclipIcon />
              Relatório
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <Edit2Icon />
              Editar
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2Icon />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja deletar esse paciente?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar o paciente e todos os dados relacionados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpsertPatientForm
          isOpen={upsertDialogIsOpen}
          patient={patient}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>

      <Dialog open={reportDialogIsOpen} onOpenChange={setReportDialogIsOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger, open via state */}
          <button className="hidden" />
        </DialogTrigger>
        <PatientReportDialog
          patientId={patient.id}
          patientName={patient.name}
          report={undefined}
        />
      </Dialog>
    </>
  )
}


export default PatientsTableActions;