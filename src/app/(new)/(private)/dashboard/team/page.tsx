"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmationModal from "@/components/ui/confirmationModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import axios from "axios";
import { Loader, MoreVertical, Trash2, Upload } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  created_by: number;
  admin_id: number;
  user_id: number;
  createdBy: string;
  adminName: string;
  adminId: number;
  userName: string;
  userEmail: string;
}

interface DeleteModel {
  isOpen: boolean;
  id: number | string;
}

export default function TeamsPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const [deleteModel, setDeleteModel] = useState<DeleteModel>({
    isOpen: false,
    id: "",
  });

  async function fetchTeamMembers() {
    try {
      if (!session?.data?.user?.id) return;
      const isMember = session?.data?.user?.isTeamMember;
      setLoading(true);
      let id = session?.data?.user?.id;
      if (isMember) {
        const adminData = await axios.get(
          "/api/team/get-admin?id=" + session?.data?.user?.id,
        );
        id = adminData.data?.admin_id;
      }
      const result = await axios.get("/api/team?id=" + id);
      setTeamMembers(result.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function deleteTeamMember(id: number | string) {
    setDeleteModel({ isOpen: false, id: "" });

    try {
      setLoading(true);
      const result = await axios.delete(`/api/team?id=${id}`);
      if (result.data) {
        setTeamMembers(teamMembers.filter((member) => member.id !== id));
        toast({
          title: "Team member deleted successfully",
          description: "The team member has been removed.",
          variant: "default",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    fetchTeamMembers();
  }, [session?.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-gray-500">Manage and track your team members</p>
        </div>
        {session?.data?.user?.role == "company" && (
          <Button onClick={() => router.push(ROUTES.newTeamMember)}>
            <Upload className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {loading && <Loader className="animate-spin" />}
        {!teamMembers?.length ? (
          <div className="flex justify-center space-y-6">
            <p className="text-gray-500">
              {loading ? "loading..." : "No team members found."}
            </p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{member.userName}</h3>
                  <div className="flex flex-row">
                    <p className="text-sm text-gray-500">{member.userEmail}</p>
                    <p className="pl-2 text-sm text-gray-500">
                      <span className="text-gray-600">Created by: </span>
                      {member.createdBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {moment(member.created_at).format("DD MMM YYYY")}
                  </span>

                  {session?.data?.user?.role == "company" &&
                    !session?.data?.user?.isTeamMember && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteModel({ isOpen: true, id: member.id })
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              </div>
            </Card>
          ))
        )}

        <ConfirmationModal
          confirmationBtn="Delete"
          open={deleteModel.isOpen}
          onCancel={() => setDeleteModel({ isOpen: false, id: "" })}
          onConfirm={() => {
            deleteTeamMember(deleteModel.id);
          }}
          message="Are you sure you want to delete this team member?"
        />
      </div>
    </div>
  );
}
