'use client'

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

import { useAuth } from "@/hooks/AuthContext"

import TodoList from "@/components/TodoList"
export default function Home() {

  const { userData } = useAuth()

  return (
    <div>
      {userData ? <TodoList /> : <UnloggedHome />}
    </div>
  )
}


function UnloggedHome() {
  return (
    <div className="flex flex-col items-center justify-start h-[calc(100vh-3.5rem)] pt-16">
      <h1 className="text-2xl font-bold mb-4">Welcome to My To-Do App</h1>
      <p className="mb-4">Please log in to manage your tasks.</p>
      <div className="flex space-x-4">
        <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Sign in
        </Link>
        <Link href="/register" className={buttonVariants({ size: "lg" })}>
          Sign up
        </Link>
      </div>
    </div>
  )
}
