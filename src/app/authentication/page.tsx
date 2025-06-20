import {headers} from "next/headers";
import {redirect} from "next/navigation";

import LoginForm from "@/app/authentication/_components/login-form";
import SignUpForm from "@/app/authentication/_components/sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import {auth} from "@/lib/auth";


const AuthenticationPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session?.user) {
        redirect("/dashboard",);
    }
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm/>
                </TabsContent>
                <TabsContent value="register">
                    <SignUpForm/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AuthenticationPage;