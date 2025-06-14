"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {clientsTable, usersToClincsTable} from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    const [clinic] = await db.insert(clientsTable).values({ name }).returning();
    await db.insert(usersToClincsTable).values({
        userId: session.user.id,
        clientId: clinic.id,
    });
    redirect("/dashboard");
};