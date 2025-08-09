"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const deleteAppointment = actionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const clinicId = session?.user?.clinic?.id;
    if (!clinicId) throw new Error("Clinic not found");

    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, parsedInput.id),
    });
    if (!appointment || appointment.clinicId !== clinicId) {
      throw new Error("Agendamento não encontrado");
    }

    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, parsedInput.id));
    revalidatePath("/appointments");
  });


