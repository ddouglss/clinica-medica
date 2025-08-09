"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { addAppointmentSchema } from "./schema";

dayjs.extend(utc);

export const addAppointment = actionClient
  .schema(addAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const clinicId = session?.user?.clinic?.id;
    if (!clinicId) throw new Error("Clinic not found");

    const jsDate = dayjs(parsedInput.date)
      .set("hour", parsedInput.time ? parseInt(parsedInput.time.split(":")[0]) : 0)
      .set("minute", parsedInput.time ? parseInt(parsedInput.time.split(":")[1]) : 0)
      .set("second", 0)
      .utc()
      .toDate();

    await db.insert(appointmentsTable).values({
      clinicId,
      patientId: parsedInput.patientId,
      doctorId: parsedInput.doctorId,
      date: jsDate,
    });

    revalidatePath("/appointments");
  });


