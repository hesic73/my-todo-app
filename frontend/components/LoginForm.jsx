'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import Link from 'next/link';

import { useState } from 'react';
import { AlertDestructive } from './AlertDestructive';

import { apiFetch } from '@/lib/utils';

import { useAuth } from '@/hooks/AuthContext';

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(50, {
        message: "Username must be at most 50 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export default function LoginForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const [errorMessage, setErrorMessage] = useState("");

    const { login } = useAuth();

    // Submit handler
    const onSubmit = async (values) => {
        console.log(values); // Logs form values (username and password)

        try {
            const response = await apiFetch(
                '/auth/login/access-token', // Your API endpoint
                null, // No bearer token needed for login
                {
                    username: values.username,
                    password: values.password,
                },
                'POST'
            );

            console.log('Login successful, token:', response.access_token);
            login(response.access_token);
            // Store the token, navigate, or perform another action on successful login
        } catch (error) {
            setErrorMessage('Invalid username or password.');
            console.error('Login failed:', error);
        }
    };

    return (
        <Card className="max-w-md mx-auto mt-10 p-6 shadow-lg">
            <CardHeader>
                <CardTitle className="text-center">
                    <span className="text-3xl font-semibold">Login</span>
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

                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </CardContent>

            <CardFooter className="flex flex-col justify-between">
                <p className="text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </p>
                {errorMessage && <AlertDestructive className="mt-4" description={errorMessage} />}
            </CardFooter>
        </Card>
    );
}
