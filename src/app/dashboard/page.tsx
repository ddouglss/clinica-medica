import {headers} from "next/headers";
import {redirect} from "next/navigation";

import SignOutButton from "@/app/dashboard/components/sign-out-button";
import {auth} from "@/lib/auth";

const DashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        redirect("/authentication");
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