"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";



const registerSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    email: z.string().trim().min(1, { message: "E-mail é obrigatório" }).email({ message: "E-mail inválido" }),
    password: z.string().trim().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().trim().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }).refine((data) => data === form.getValues("password"), { message: "As senhas não coincidem" }),
})


const AuthenticationPage = () => {
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof registerSchema>) {
        console.log(values);
    }


    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Faça login para continuar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">

                        </CardContent>
                        <CardFooter>
                            <Button>Entrar</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} >

                                <CardHeader>
                                    <CardTitle>Register</CardTitle>
                                    <CardDescription>
                                        Crie uma conta para continuar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="digite seu nome" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>E-mail</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="digite seu email" {...field}
                                                        type="email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="digite sua senha" {...field}
                                                        type="password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Senha</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="confirme sua senha" {...field}
                                                        type="password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </CardContent>
                                <CardFooter>
                                    <Button type="submit">Submit</Button>
                                </CardFooter> </form>
                        </Form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AuthenticationPage;