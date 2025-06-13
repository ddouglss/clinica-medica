"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import {Loader2} from "lucide-react";


const loginSchema = z.object({
    email: z.string().trim().min(1, { message: "E-mail é obrigatório" }).email({ message: "E-mail inválido" }),
    password: z.string().trim().min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
})



const LoginForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        await authClient.signIn.email({
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    router.push("/dashboard");
                },
                onError: ()  => {
                    toast.error("E-mail ou Senha inválidos.");
                },
                onLoading: () => {
                    toast.loading("Carregando...");
                },
                onIdle: () => {
                    toast.success("Login efetuado com sucesso.");
                },
            }
        )
    }

    return (
        <Card >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' >

                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                                Faça login para continuar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

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

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className='w-full cursor-pointer' disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </CardFooter> </form>
            </Form>
        </Card>
    )

}

export default LoginForm;