import { z } from "zod";

export const upsertPatientReportSchema = z.object({
  id: z.string().uuid().optional(),
  patientId: z.string().uuid(),
  title: z.string().trim().min(1, { message: "Título é obrigatório." }),
  details: z.string().trim().optional(),
});

export type UpsertPatientReportSchema = z.infer<typeof upsertPatientReportSchema>;


