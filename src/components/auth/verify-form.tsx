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
import { useRouter } from "next/navigation";

const verifySchema = z.object({
  otp: z
    .string()
    .regex(/^[0-9]{6}$/, 'OTP must be exactly 6 digits and numeric')
    .min(6, "OTP is required")
});

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
        otp: ""
      },
    });

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    try {
      const data: any = await axiosInstance.post("/api/users/otp/verify", {
        email,
        otp: values.otp,
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
            Verify Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your otp here your recieved in your email
          </p>
        </div>

        <div className="grid gap-6">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter OTP</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#303596] hover:bg-[#303596]/90"
        >
          Verify OTP
        </Button>
      </form>
    </Form>
        <Button
          onClick={resendOtp}
          className="w-full bg-[#303596] hover:bg-[#303596]/90"
        >
          Resend OTP
        </Button>
        </div>
      </div>
    </Card>
  );
}
