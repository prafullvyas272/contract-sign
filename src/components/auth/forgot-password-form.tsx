"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: {
        email: ""
      },
    });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      const data: any = await axiosInstance.post("/api/users/forgot-password", {
        email: values.email
      });
      toast({
        title: data.message,
      });
      if(data.success){
        router.push("/signin");
      }
      
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };

  const resendOtp = async () => {
    try {
      const data: any = await axiosInstance.post("/api/users/otp/resend", {
        email
      });
      toast({
        title: data.message,
      });
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <Card className="w-full max-w-[600px] p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot Password ?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email here
          </p>
        </div>

        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@company.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#303596] hover:bg-[#303596]/90"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
}
