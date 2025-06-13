"use client"

import SignUpForm from "@/app/authentication/components/sign-up-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import LoginForm from "@/app/authentication/components/login-form";


const AuthenticationPage = () => {



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