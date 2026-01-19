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
import { useEffect } from "react";

const resetPasswordSchema = z.object({
  password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters"),
});

export function ResetPasswordForm({tokenProps}: any) {
  const router = useRouter();
  
  useEffect(() => {
    const tokenVerification = async() => {
      const verifyToken: any = await axiosInstance.post("/api/users/verify-token", {
        token: tokenProps.token
      });

      toast({
        title: verifyToken.message,
      });

      if(!verifyToken.success){
        router.push('/signin');
      }
    }
    tokenVerification();
  }, [tokenProps.token]);
  
  
  
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
        password: ""
      },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      const data: any = await axiosInstance.post("/api/users/reset-password", {
        password: values.password,
        token: tokenProps.token
      });
      toast({
        title: data.message,
      });
      if(data.success){
        router.push('/signin');
      }
      
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };

  return (
    <Card className="w-full max-w-[600px] p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password
          </p>
        </div>

        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                Reset Password
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
}
