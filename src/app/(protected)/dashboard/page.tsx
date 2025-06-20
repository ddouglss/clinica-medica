import {eq} from "drizzle-orm";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import SignOutButton from "@/app/(protected)/dashboard/_components/sign-out-button";
import {db} from "@/db";
import {usersToClinicsTable} from "@/db/schema";
import {auth} from "@/lib/auth";

const DashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    // Preciso pegar as clínicas dos usuários logados
    const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, session?.user?.id),
    })
    if(clinics.length === 0){
        redirect("/clinic-form");
    }

    return (
        <div>
            Dashboard
            <h1>{session?.user?.name}</h1>
            <h1>{session?.user?.email}</h1>
            <SignOutButton/>
        </div>
    )

}
export default DashboardPage;