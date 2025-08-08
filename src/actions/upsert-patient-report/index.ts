"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientReportsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertPatientReportSchema } from "./schema";

export const upsertPatientReport = actionClient
  .schema(upsertPatientReportSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");
    const clinicId = session?.user?.clinic?.id;
    if (!clinicId) throw new Error("Clinic not found");

    const [result] = await db
      .insert(patientReportsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId,
      })
      .onConflictDoUpdate({
        target: [patientReportsTable.id],
        set: {
          title: parsedInput.title,
          details: parsedInput.details,
        },
      })
      .returning({ id: patientReportsTable.id });

    revalidatePath(`/patients`);
    return { id: result.id };
  });


