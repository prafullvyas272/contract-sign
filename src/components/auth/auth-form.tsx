"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons/icons";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { CompanyAuthForm } from "@/components/auth/company-auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "next-auth/react";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const signers = searchParams.get("signers");
  const type = searchParams.get("type");
  const defaultTab = type === "company" ? "company" : "individual";

  console.log("type", type);
  return (
    <Card className="w-full max-w-[600px] p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Enter your credentials to sign in to your account"
              : "Choose your account type to get started"}
          </p>
        </div>

        <div className="grid gap-6">
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => {
              void signIn("google", {
                redirectTo: `/dashboard/contracts/new${signers ? `?signers=${signers}` : ""}`,
              });
            }}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {mode === "signup" ? (
            <Tabs defaultValue="individual">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="individual">Individual</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
              </TabsList>
              <TabsContent value="individual">
                <UserAuthForm mode={mode} />
              </TabsContent>
              <TabsContent value="company">
                <CompanyAuthForm mode={mode} />
              </TabsContent>
            </Tabs>
          ) : (
            <UserAuthForm mode={mode} />
          )}
        </div>
      </div>
    </Card>
  );
}
