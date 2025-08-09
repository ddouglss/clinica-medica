import { z } from "zod";

export const addAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  // opcional na UI, não persistido por enquanto
  appointmentPriceInCents: z.number().int().positive().optional(),
  date: z.date(),
  time: z.string().optional(), // HH:mm
});

export type addAppointmentSchema = z.infer<typeof addAppointmentSchema>;


