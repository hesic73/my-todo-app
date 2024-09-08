'use client'
import { useAuth } from '@/hooks/AuthContext';

import { buttonVariants } from "@/components/ui/button"

import Link from "next/link"


export default function NavbarButtonGroup() {
    const { userData } = useAuth();

    return (
        <div className="flex items-center gap-4">
            {userData ? (
                <> <span className="text-sm">Hello, {userData.full_name}</span>
                    <Link href="#" className={buttonVariants({ variant: "outline", size: "sm" })}>Logout</Link>
                </>
            ) : (
                <>
                    <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>Sign in</Link>
                    <Link href="#" className={buttonVariants({ size: "sm" })}>Sign up</Link>
                </>

            )}

        </div>
    )
}