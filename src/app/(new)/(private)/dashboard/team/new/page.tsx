"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { ROUTES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoaderPinwheel } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { FormLabel } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["individual", "company"], { message: "Invalid role" }),
});

export default function AddTeam() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "individual",
    },
  });
  const session = useSession();
  async function saveTeamMember(data: z.infer<typeof FormSchema>) {
    let admin_id = session.data?.user?.id;
    if (session.data?.user?.isTeamMember) {
      const adminData = await axios.get(
        "/api/team/get-admin?id=" + session.data?.user?.id,
      );
      admin_id = adminData.data?.admin_id;
    }
    const created_by = session?.data?.user?.id;
    if (!admin_id || !created_by) {
      console.log("Admin id or created by is missing");
      toast({
        title: "Error",
        description: "An error occurred while adding the team member",
        variant: "destructive",
      });
      return;
    }
    // return session;
    try {
      console.log(data);
      setLoading(true);
      const result: any = await axiosInstance.post("/api/team", {
        ...data,
        admin_id,
        created_by,
      });
      console.log(result.data);
      setTimeout(() => {
        router.push(ROUTES.team);
      }, 1000);
      toast({
        title: "Team member added successfully",
        description: "The team member has been added successfully",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while adding the team member",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Add Team member
          </h1>
          <p className="text-gray-600">
            Add a new team member to your team. They will be able to access the
            dashboard and perform actions on behalf of the team.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(saveTeamMember)}
          className="mx-auto w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name of the team member.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter an email" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the email of the team member.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">User</SelectItem>
                      <SelectItem value="company">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="h-full w-full py-4"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <LoaderPinwheel className="animate-spin" />
            ) : (
              "Add Team Memeber"
            )}
          </Button>
        </form>
      </Form>
    </Suspense>
  );
}
