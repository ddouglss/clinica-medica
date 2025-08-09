'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { upsertPatientReport } from '@/actions/upsert-patient-report'
import { deletePatientReport } from '@/actions/delete-patient-report'
import { upsertPatientReportAttachment } from '@/actions/upsert-patient-report-attachment'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { DetalhesField } from '@/app/(protected)/patients/_constants/index'


const reportSchema = z.object({
  title: z.string().trim().min(1, { message: 'Título é obrigatório.' }),
  details: z.string().trim().optional(),
})

const attachmentSchema = z.object({
  kind: z.enum(['attachment', 'prescription']),
  name: z.string().trim().min(1, { message: 'Nome é obrigatório.' }),
  url: z.string().url({ message: 'URL inválida.' }).optional().or(z.literal('')).optional(),
})

interface PatientReportDialogProps {
  patientId: string
  patientName: string
  report?: { id: string; title: string; details?: string | null }
}

const PatientReportDialog = ({ patientId, patientName, report }: PatientReportDialogProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingAttachment, setIsSavingAttachment] = useState(false)

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: report?.title ?? '', details: report?.details ?? '' },
  })

  const attachmentForm = useForm<z.infer<typeof attachmentSchema>>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: { kind: 'attachment', name: '', url: '' },
  })

  const upsertReportAction = useAction(upsertPatientReport, {
    onSuccess: () => toast.success('Relatório salvo.'),
    onError: () => toast.error('Erro ao salvar relatório.'),
  })

  const deleteReportAction = useAction(deletePatientReport, {
    onSuccess: () => toast.success('Relatório deletado.'),
    onError: () => toast.error('Erro ao deletar relatório.'),
  })

  const upsertAttachmentAction = useAction(upsertPatientReportAttachment, {
    onSuccess: () => toast.success('Anexo salvo.'),
    onError: () => toast.error('Erro ao salvar anexo.'),
  })

  const onSubmitReport = async (values: z.infer<typeof reportSchema>) => {
    setIsSaving(true)
    await upsertReportAction.execute({ id: report?.id, patientId, title: values.title, details: values.details })
    setIsSaving(false)
  }

  const onSubmitAttachment = async (values: z.infer<typeof attachmentSchema>) => {
    if (!report?.id) return
    setIsSavingAttachment(true)
    await upsertAttachmentAction.execute({ reportId: report.id, ...values })
    setIsSavingAttachment(false)
  }

  const onDelete = async () => {
    if (!report?.id) return
    await deleteReportAction.execute({ id: report.id, patientId })
  }

  const handleExportPdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const yStart = 20
    doc.setFontSize(16)
    doc.text('Relatório do paciente', 14, yStart)
    doc.setFontSize(12)
    const lines = [
      `Paciente: ${patientName}`,
      `Título: ${form.getValues('title')}`,
      `Detalhes: ${form.getValues('details') || '-'}`,
    ]
    let y = yStart + 10
    lines.forEach((line) => {
      doc.text(line, 14, y)
      y += 8
    })
    doc.save(`relatorio-${patientName}.pdf`)
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Relatório do paciente</DialogTitle>
        <DialogDescription>
          Cabeçalho: {patientName}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>Detalhes do relatório</CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitReport)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DetalhesField form={form} />
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar relatório'}
                  </Button>
                  {report?.id && (
                    <Button type="button" variant="outline" onClick={onDelete}>
                      Deletar
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              Gerenciar anexos/prescrições
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Anexos e prescrições</DialogTitle>
            </DialogHeader>
            <Form {...attachmentForm}>
              <form
                onSubmit={attachmentForm.handleSubmit(onSubmitAttachment)}
                className="grid grid-cols-3 gap-4"
              >
                <FormField
                  control={attachmentForm.control}
                  name="kind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="attachment">Anexo</SelectItem>
                          <SelectItem value="prescription">Prescrição</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={attachmentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={attachmentForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-3">
                  <Button type="submit" disabled={isSavingAttachment}>
                    {isSavingAttachment ? 'Salvando...' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleExportPdf}>
            Exportar PDF
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}

export default PatientReportDialog


