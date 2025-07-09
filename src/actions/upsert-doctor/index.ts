"use server";

import { eq } from "drizzle-orm"; // importante para o `where`
import { headers } from "next/headers";

import { upsertDoctorSchema } from "@/actions/upsert-doctor/schema";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const upsertDoctor = actionClient
    .schema(upsertDoctorSchema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        if (!session.user.clinic?.id) {
            throw new Error("Clinic not found");
        }

        // 🔐 Adiciona o clinicId ao dado a ser inserido
        const doctorData = {
            ...parsedInput,
            clinicId: session.user.clinic.id,
        };

        if (parsedInput.id) {
            // Atualização
            await db
                .update(doctorsTable)
                .set(doctorData)
                .where(eq(doctorsTable.id, parsedInput.id));
        } else {
            // Inserção
            await db.insert(doctorsTable).values(doctorData);
        }
    });
