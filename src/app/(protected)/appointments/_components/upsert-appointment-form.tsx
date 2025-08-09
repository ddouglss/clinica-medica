'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectLabel,  SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { appointmentsTable, doctorsTable, patientsTable } from '@/db/schema'
import { upsertAppointment } from '@/actions/upsert-appointment'
import { CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale/pt-BR'

const formSchema = z.object({
  patientId: z.string().min(1,{ message: 'Paciente é obrigatório.' }),
  doctorId: z.string().min(1,{ message: 'Médico é obrigatório.' }),
  appointmentPrice: z.number().min(0.01, { message: 'Valor da consulta é obrigatória.'}),
  date: z.date({ message: 'Data é obrigatória.' }),
  time: z.string().min(1,{
    message: 'Horário é obrigatório'
  }),
})

interface UpsertAppointmentFormProps {
  isOpen: boolean
  doctors: Array<typeof doctorsTable.$inferSelect>
  patients: Array<typeof patientsTable.$inferSelect>
  appointment?:typeof appointmentsTable.$inferSelect;
  onSuccess?: () => void
}

const UpsertAppointmentForm = ({ isOpen, doctors, patients, onSuccess }: UpsertAppointmentFormProps) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined)
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: undefined,
      doctorId: undefined,
      appointmentPrice: undefined,
      date: undefined as unknown as Date,
      time: undefined,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({ patientId: undefined, doctorId: undefined, appointmentPrice: undefined, date: undefined as unknown as Date, time: undefined })
      setSelectedDoctorId(undefined)
      setSelectedPatientId(undefined)
    }
  }, [isOpen, form])

  const selectedDoctor = useMemo(() => doctors.find((d) => d.id === selectedDoctorId), [doctors, selectedDoctorId])
  const isPriceEnabled = Boolean(selectedDoctor)
  const isDateEnabled = Boolean(selectedDoctorId && selectedPatientId)
  const isTimeEnabled = Boolean(selectedDoctorId && selectedPatientId)

  useEffect(() => {
    if (selectedDoctor) {
      form.setValue(
        'appointmentPrice',
        selectedDoctor ? selectedDoctor.appointmentPriceInCents / 100 : 0
      )
    }
  }, [selectedDoctor, form])

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso.')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erro ao criar agendamento. Tente novamente.')
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertAppointmentAction.execute({
      patientId: values.patientId,
      doctorId: values.doctorId,
      appointmentPriceInCents: values.appointmentPrice ? Math.round(values.appointmentPrice * 100) : undefined,
      date: values.date,
      time: values.time,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>Preencha os dados para criar um novo agendamento</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedPatientId(value)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedDoctorId(value)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => field.onChange(value.floatValue)}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$"
                  disabled={!isPriceEnabled}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => {
              const dataSelecionada = field.value
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        data-empty={!dataSelecionada}
                        disabled={!isDateEnabled}
                        className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                      >
                        <CalendarIcon />
                        {dataSelecionada ? dataSelecionada.toLocaleDateString("pt-BR") : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataSelecionada}
                        onSelect={(d) => field.onChange(d)}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!isTimeEnabled}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Sem opções por enquanto */}
                    <SelectGroup  >
                                        <SelectLabel>Manhã</SelectLabel>
                                        <SelectItem value="05:00:00">05:00</SelectItem>
                                        <SelectItem value="05:30:00">05:30</SelectItem>
                                        <SelectItem value="06:00:00">06:00</SelectItem>
                                        <SelectItem value="06:30:00">06:30</SelectItem>
                                        <SelectItem value="07:00:00">07:00</SelectItem>
                                        <SelectItem value="07:30:00">07:30</SelectItem>
                                        <SelectItem value="08:00:00">08:00</SelectItem>
                                        <SelectItem value="08:30:00">08:30</SelectItem>
                                        <SelectItem value="09:00:00">09:00</SelectItem>
                                        <SelectItem value="09:30:00">09:30</SelectItem>
                                        <SelectItem value="10:00:00">10:00</SelectItem>
                                        <SelectItem value="10:30:00">10:30</SelectItem>
                                        <SelectItem value="11:00:00">11:00</SelectItem>
                                        <SelectItem value="11:30:00">11:30</SelectItem>
                                        <SelectItem value="12:00:00">12:00</SelectItem>
                                        <SelectItem value="12:30:00">12:30</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Tarde</SelectLabel>
                                        <SelectItem value="13:00:00">13:00</SelectItem>
                                        <SelectItem value="13:30:00">13:30</SelectItem>
                                        <SelectItem value="14:00:00">14:00</SelectItem>
                                        <SelectItem value="14:30:00">14:30</SelectItem>
                                        <SelectItem value="15:00:00">15:00</SelectItem>
                                        <SelectItem value="15:30:00">15:30</SelectItem>
                                        <SelectItem value="16:00:00">16:00</SelectItem>
                                        <SelectItem value="16:30:00">16:30</SelectItem>
                                        <SelectItem value="17:00:00">17:00</SelectItem>
                                        <SelectItem value="17:30:00">17:30</SelectItem>
                                        <SelectItem value="18:00:00">18:00</SelectItem>
                                        <SelectItem value="18:30:00">18:30</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Noite</SelectLabel>
                                        <SelectItem value="19:00:00">19:00</SelectItem>
                                        <SelectItem value="19:30:00">19:30</SelectItem>
                                        <SelectItem value="20:00:00">20:00</SelectItem>
                                        <SelectItem value="20:30:00">20:30</SelectItem>
                                        <SelectItem value="21:00:00">21:00</SelectItem>
                                        <SelectItem value="21:30:00">21:30</SelectItem>
                                        <SelectItem value="22:00:00">22:00</SelectItem>
                                        <SelectItem value="22:30:00">22:30</SelectItem>
                                        <SelectItem value="23:00:00">23:00</SelectItem>
                                        <SelectItem value="23:30:00">23:30</SelectItem>
                                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={upsertAppointmentAction.isExecuting}>
              {upsertAppointmentAction.isExecuting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}

export default UpsertAppointmentForm


