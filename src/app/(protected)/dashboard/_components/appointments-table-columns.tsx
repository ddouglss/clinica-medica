"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { formatCurrencyInCents } from "@/helpers/currency";

interface TodayAppointment {
  id: string;
  date: Date;
  appointmentPriceInCents: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialty: string;
}

export const appointmentsTableColumns: ColumnDef<TodayAppointment>[] = [
  {
    id: "patient",
    header: "Paciente",
    cell: ({ row }) => row.original.patientName,
  },
  {
    id: "doctor",
    header: "Médico",
    cell: ({ row }) => row.original.doctorName,
  },
  {
    id: "specialty",
    header: "Especialidade",
    cell: ({ row }) => row.original.doctorSpecialty,
  },
  {
    id: "date",
    header: "Horário",
    cell: ({ row }) => dayjs(row.original.date).format("HH:mm"),
  },
  {
    id: "value",
    header: "Valor",
    cell: ({ row }) => formatCurrencyInCents(row.original.appointmentPriceInCents),
  },
];
