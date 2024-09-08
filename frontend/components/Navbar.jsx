/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <nav className="bg-base-100 sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-14 items-center">
                    <Link href="/" className="flex items-center">
                        <FontAwesomeIcon icon={faTasks} className="size-6" />
                        <span className="sr-only">My TODO App</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                            Sign in
                        </Button>
                        <Button size="sm">Sign up</Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
