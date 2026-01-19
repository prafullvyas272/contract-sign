"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
  name: z.string().optional(),
});

export function UserAuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof userAuthSchema>>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof userAuthSchema>) {
    if (mode === "signin") {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        console.log("result", result);

        if (result?.error) {
          toast({
            title: "Invalid credentials",
            description: result?.error,
            variant: "destructive",
          });
        } else {
        var i:any=  toast({
            title: "Signed in successfully",
            description: "You have been signed in successfully",
            variant: "default",
          });
        }
        setTimeout(() => {
          i.dismiss()
          router.push("/?new=True");
  
        }, 2000);
      } catch (error: any) {
        console.log("error", error);
      }
    } else {
      try {
        const data: any = await axiosInstance.post("/api/users/create", {
          email: values.email,
          name: values.name,
          password: values.password,
          role: "individual",
        });
        
        toast({
          title: data.message,
        });

        if(data.success){
          router.push(`/verify?email=${values.email}`);
        }
        // router.push("/signin");
        // router.push(`/verify?email=${values.email}`);
      } catch (error) {
        console.log("Signup Error:", error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === "signup" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <div className="mx-auto flex w-full flex-col justify-center space-y-6">
            <p className="text-center text-sm text-muted-foreground flex">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4 hover:text-primary"
              >
               Forgot Password ?
              </Link>
            </p>
          </div>
        <Button
          type="submit"
          className="w-full bg-[#303596] hover:bg-[#303596]/90"
        >
          {mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
