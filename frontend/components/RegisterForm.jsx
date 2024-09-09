'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import Link from 'next/link';

import { useState } from 'react';
import { AlertDestructive } from './AlertDestructive';

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(50, {
        message: "Username must be at most 50 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    full_name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }).max(100, {
        message: "Full name must be at most 100 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirm_password: z.string().min(6, {
        message: "Confirm password must be at least 6 characters.",
    }),
}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
});

export default function RegisterForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            full_name: "",
            password: "",
            confirm_password: "",
        },
    })

    const [errorMessage, setErrorMessage] = useState("");

    // Submit handler
    function onSubmit(values) {
        console.log(values)
        setErrorMessage("Error registering user.");
    }

    return (
        <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg">
            <CardHeader>
                <CardTitle className="text-center">
                    <span className="text-3xl font-semibold">Register</span>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Full Name field */}
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password field */}
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">Register</Button>
                    </form>
                </Form>
            </CardContent>

            <CardFooter className="flex flex-col justify-between">
                <p className="text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </p>
                {errorMessage && <AlertDestructive className="mt-4" description={errorMessage} />}
            </CardFooter>
        </Card>
    );
}
