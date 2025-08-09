import { z } from "zod";

export const upsertAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  // opcionalmente permitir preço (não salvo por enquanto; usado apenas na UI)
  appointmentPriceInCents: z.number().int().positive().optional(),
  date: z.date(),
  time: z.string().optional(), // HH:mm
});

export type UpsertAppointmentSchema = z.infer<typeof upsertAppointmentSchema>;


