'use client'
import { useAuth } from '@/hooks/AuthContext';

import { buttonVariants } from "@/components/ui/button"

import { Button } from '@/components/ui/button';
import Link from "next/link"


import { useRouter } from 'next/navigation'

export default function NavbarButtonGroup() {
    const { userData } = useAuth();
    const router = useRouter();

    const { logout } = useAuth();

    const handleLogout = async () => {
        logout();
        router.push('/');
    }

    return (
        <div className="flex items-center gap-4">
            {userData ? (
                <> <span className="text-sm">Hello, {userData.full_name}</span>
                    <Button
                        onClick={handleLogout}
                        variant="outline" size="sm">Sign out</Button>
                </>
            ) : (
                <>
                    <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>Sign in</Link>
                    <Link href="/register" className={buttonVariants({ size: "sm" })}>Sign up</Link>
                </>

            )}

        </div>
    )
}