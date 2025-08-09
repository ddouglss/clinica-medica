"use client"

import { patientsTable } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DeleteIcon, Edit2Icon, MoreHorizontalIcon, PaperclipIcon, Trash2Icon } from "lucide-react"

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
        return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <PaperclipIcon/>
                    Relatório
                    </DropdownMenuItem>
                <DropdownMenuItem>
                    <Edit2Icon/>
                    Editar
                    </DropdownMenuItem>
                <DropdownMenuItem>
                    <Trash2Icon/>
                    Excluir
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        )
    }
  }
]