'use client'

import { z } from "zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAuthContext } from "@/contexts/auth-context"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(6, "Пароль минимум 6 символов"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const { signIn, loading } = useAuthContext()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values)
      toast.success("Добро пожаловать!")
      router.push("/")
    }
    catch (err: unknown) {
      toast.error("Ошибка авторизации")
      if (err instanceof Error) {
        console.error(err.message)
      }
    }
  }

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Вход</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логин</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
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
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={loading || form.formState.isSubmitting} 
            className="w-full"
          >
            {loading ? "Загрузка..." : "Войти"}
          </Button>
        </form>
      </Form>
    </main>
  )
}
