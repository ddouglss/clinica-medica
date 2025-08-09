"use client"

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"

import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema"
import AppointmentsTableActions from "./table-actions"
import { formatCurrencyInCents } from "@/helpers/currency"

type Appointment = typeof appointmentsTable.$inferSelect & {
  doctor?: typeof doctorsTable.$inferSelect | null
  patient?: typeof patientsTable.$inferSelect | null
}

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    id: "patient",
    header: "Paciente",
    cell: ({ row }) => row.original.patient?.name ?? "-",
  },
  {
    id: "doctor",
    header: "Médico",
    cell: ({ row }) => {
      const d = row.original.doctor
      return d ? `${d.name}` : "-"
    },
  },
  {
    id: "date",
    header: "Data e Hora",
    cell: ({ row }) => dayjs(row.original.date).format("DD/MM/YYYY [às] HH:mm"),
  },
  {
    id: "specialty",
    header: "Especialidade",
    cell: ({ row }) => row.original.doctor?.specialty ?? "-",
  },
  {
    id: "value",
    header: "Valor",
    cell: ({ row }) => {
      const priceInCents = row.original.doctor?.appointmentPriceInCents
      return typeof priceInCents === "number" ? formatCurrencyInCents(priceInCents) : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AppointmentsTableActions appointment={row.original} />,
  },
]


