"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema= z.object({
  name:z.string().min(2,{message:"Name must be at least 2 characters"}),
  email:z.string().email({message:"Invalid email address"}),
  role:z.string(),
  


})
export default function ProfilePage() {
  const session= useSession();
  const [loading,setLoading]=useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      email:"",
      role:"",
    }
  })

  useEffect(()=>{
    if(session?.data){
      getProfile()
      
    }
  },[session?.data]);

  async function getProfile(){
    setLoading(true);
  try {
    const result:any = await axiosInstance.get(
      "/api/profile?id=" + session?.data?.user?.id,
    );
    
    form.setValue("name", result?.name || "");
      form.setValue("email", result?.email || "");
      form.setValue("role", result?.role || "");
      setLoading(false);
  } catch (error) {
    console.log(error);
  }
    setLoading(false);
  }

  async function handleUpdates(formData:z.infer<typeof formSchema>){
try{
setLoading(true);
const result= await axiosInstance.put("/api/profile",{id:session?.data?.user?.id,name:formData.name});
toast({
  title:"Profile updated",
  description:"Profile updated successfully.",
  variant:"default"
});
getProfile();

}catch(error){
  console.log(error)
  toast({
    title: "Error",
    description: "An error occurred while updating profile",
    variant: "destructive",
  });
  setLoading(false);
}

  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-500">Manage your account preferences</p>
        </div>

        <Button onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      {loading && <Loader className="animate-spin" />}

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          {/* <TabsTrigger value="company">Company Details</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger> */}
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdates)}>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                placeholder="Enter a name"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                disabled
                                placeholder="Enter a email"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                </div> */}
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* Additional tab contents will be implemented similarly */}
      </Tabs>
    </div>
  );
}
