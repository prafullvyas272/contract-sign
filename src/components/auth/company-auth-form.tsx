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
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

const companyAuthSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export function CompanyAuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof companyAuthSchema>>({
    resolver: zodResolver(companyAuthSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof companyAuthSchema>) {
    if (mode === "signin") {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          toast({
            title: "Invalid credentials",
            description: result?.error,
            variant: "destructive",
          });
        } else {
         var i= toast({
            title: "Signed in successfully",
            description: "You have been Signed in successfully",
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
      const data: any = await axiosInstance.post("/api/users/create", {
        email: values.email,
        name: values.companyName,
        password: values.password,
        role: "company",
      });

      toast({
        title: data.message,
      });
      // router.push("/signin");
      if(data.success){
        router.push(`/verify?email=${values.email}`);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
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
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input placeholder="name@company.com" type="email" {...field} />
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
        <Button
          type="submit"
          className="w-full bg-[#303596] hover:bg-[#303596]/90"
        >
          Create Business Account
        </Button>
      </form>
    </Form>
  );
}
