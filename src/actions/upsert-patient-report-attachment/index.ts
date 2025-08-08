"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientReportAttachmentsTable, patientReportsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertPatientReportAttachmentSchema } from "./schema";

export const upsertPatientReportAttachment = actionClient
  .schema(upsertPatientReportAttachmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");

    await db
      .insert(patientReportAttachmentsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
      })
      .onConflictDoUpdate({
        target: [patientReportAttachmentsTable.id],
        set: {
          kind: parsedInput.kind,
          name: parsedInput.name,
          url: parsedInput.url,
        },
      });

    // Revalidate patient page
    const report = await db.query.patientReportsTable.findFirst({
      where: (fields, operators) => operators.eq(fields.id, parsedInput.reportId),
    });
    if (report) {
      revalidatePath(`/patients/${report.patientId}`);
    }
  });


