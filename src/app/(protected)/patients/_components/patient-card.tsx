"use client";

import { TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deletePatient } from "@/actions/delete-patient";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { patientsTable } from "@/db/schema";

import UpsertPatientForm from "./upsert-patient-form";
import PatientReportDialog from "./patient-report-dialog";
import { Badge } from "@/components/ui/badge";

interface PatientCardProps {
  patient: typeof patientsTable.$inferSelect & { reports?: Array<{ id: string; title: string; details?: string | null }> };
}

const PatientCard = ({ patient }: PatientCardProps) => {
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success("Paciente deletado com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao deletar paciente.");
    },
  });

  const handleDelete = () => {
    if (!patient) return;
    deletePatientAction.execute({ id: patient.id });
  };

  const patientInitials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{patientInitials}</AvatarFallback>
          </Avatar>
            <h3 className="text-sm font-medium">{patient.name}</h3>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex flex-col gap-1">
          <div>
            <Badge variant="outline">
              <p className="text-muted-foreground text-sm">{patient.email}</p>
            </Badge>
          </div>
          <div>
            <Badge variant="outline">
              <p className="text-muted-foreground text-sm">{patient.phoneNumber}</p>
            </Badge>
          </div>

          <div>
            <Badge variant="outline">
              <p className="text-muted-foreground text-sm">{patient.sex}</p>
            </Badge>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Relatório</Button>
          </DialogTrigger>
          <PatientReportDialog
            patientId={patient.id}
            patientName={patient.name}
            report={patient.reports?.[0]}
          />
        </Dialog>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog open={isUpsertDialogOpen} onOpenChange={setIsUpsertDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertPatientForm
            patient={patient}
            onSuccess={() => setIsUpsertDialogOpen(false)}
            isOpen={isUpsertDialogOpen} />
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TrashIcon />
              Deletar paciente
            </Button>
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
              <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;


