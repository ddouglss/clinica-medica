'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { date, z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectLabel,  SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { appointmentsTable, doctorsTable, patientsTable } from '@/db/schema'
import { addAppointment } from '@/actions/add-appointment'
import { CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale/pt-BR'
import { useQuery } from '@tanstack/react-query'
import { getAvailableTimes as getAvailableTimesAction } from '@/actions/get-available-times'
import dayjs from 'dayjs'

const startOfToday = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})()

const formSchema = z.object({
  patientId: z.string().min(1,{ message: 'Paciente é obrigatório.' }),
  doctorId: z.string().min(1,{ message: 'Médico é obrigatório.' }),
  appointmentPrice: z.number().min(0.01, { message: 'Valor da consulta é obrigatória.'}),
  date: z.date({ message: 'Data é obrigatória.' }).refine((d) => {
    const picked = new Date(d)
    picked.setHours(0, 0, 0, 0)
    return picked.getTime() >= startOfToday.getTime()
  }, { message: 'Selecione uma data a partir de hoje.' }),
  time: z.string().min(1,{
    message: 'Horário é obrigatório'
  }),
});


interface AddAppointmentFormProps {
  isOpen: boolean
  doctors: Array<typeof doctorsTable.$inferSelect>
  patients: Array<typeof patientsTable.$inferSelect>
  appointment?:typeof appointmentsTable.$inferSelect;
  onSuccess?: () => void
}


const AddAppointmentForm = ({ isOpen, doctors, patients, onSuccess }: AddAppointmentFormProps) => {
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

  const selectedDate = form.watch("date")

  type AvailableTime = { value: string; available: boolean; label: string }

  const { data: availableTimes } = useQuery<{ data?: AvailableTime[] }>({
    queryKey: ["available-times", selectedDate, selectedDoctorId],
    queryFn: async (): Promise<{ data?: AvailableTime[] }> => {
      if (!selectedDate || !selectedDoctorId) return { data: [] }
      const res = await getAvailableTimesAction({
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        doctorId: selectedDoctorId,
      })
      return res as { data?: AvailableTime[] }
    },
    enabled: Boolean(selectedDate && selectedDoctorId),
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

  const createAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso.')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erro ao criar agendamento. Tente novamente.')
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAppointmentAction.execute({
      patientId: values.patientId,
      doctorId: values.doctorId,
      appointmentPriceInCents: Math.round((values.appointmentPrice || 0) * 100),
      date: values.date,
      time: values.time,
    })
  }

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );
    if (!selectedDoctor) return false;
    const dayOfWeek = date.getDay();
    return (
      dayOfWeek >= selectedDoctor?.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor?.availableToWeekDay
    );
  };

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
                        fromDate={startOfToday}
                        disabled={(date) =>
                          date < new Date() || !isDateAvailable(date)
                        }
                        initialFocus
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
                <Select onValueChange={field.onChange}
                 value={field.value} 
                 disabled={!isTimeEnabled || !selectedDate}>

                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  {availableTimes?.data?.map((time: AvailableTime) => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        disabled={!time.available}
                      >
                        {time.label} {!time.available && "(Indisponível)"}   
                        </SelectItem>
                    ))}         
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={createAppointmentAction.isExecuting}>
              {createAppointmentAction.isExecuting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}

export default AddAppointmentForm;