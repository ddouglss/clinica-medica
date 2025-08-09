"use client"

import { patientsTable } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import PatientsTableActions from "./table-actions"


type Patient = typeof patientsTable.$inferSelect

export const patiensTableColumns: ColumnDef<Patient>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: ({ row }) => {
      const raw = row.original.phoneNumber as string | undefined
      if (!raw) return "-"
      const digits = raw.replace(/\D/g, "")
      if (digits.length !== 11) return raw
      const ddd = digits.slice(0, 2)
      const prefixo = digits.slice(2, 7)
      const sufixo = digits.slice(7)
      return `(${ddd}) ${prefixo}-${sufixo}`
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
  },
  {
    id: 'actions',
    cell: (params) => {
        const patient = params.row.original;
        
        return <PatientsTableActions patient={patient}/>
        
    }
  }
]