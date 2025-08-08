import { z } from "zod";

export const upsertPatientReportAttachmentSchema = z.object({
  id: z.string().uuid().optional(),
  reportId: z.string().uuid(),
  kind: z.enum(["attachment", "prescription"]),
  name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
  url: z.string().url().optional().or(z.literal("")).optional(),
});

export type UpsertPatientReportAttachmentSchema = z.infer<
  typeof upsertPatientReportAttachmentSchema
>;


