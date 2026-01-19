"use client";

import React, { useEffect, useMemo } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Input } from "../Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/types/dashboard";
import { toast } from "@/hooks/use-toast";

export interface ContractUser {
  id: string;
  name: string;
  email: string;
}

interface SelectUserModelProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (user: string) => void;
  user: ContractUser[];
  fields: Field[];
  type: "signature" | "name" | "initials" | "date";
}

const SelectUserModel: React.FC<SelectUserModelProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  type,
  fields,
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [value, setValue] = React.useState<string>("");

  const dropdownUsers = useMemo(() => {
    return user;
    return user.filter((user) => {
      return (
        user?.name &&
        fields.find((field) => field.user === user.id && field.type == type) ==
          undefined
      );
    });
  }, [user, fields, type]);
  useEffect(() => {
    if (open) {
      console.log(user, "user");
      if (user.length == 0 || (user[0]?.name == "" && user[0].email == "")) {
        toast({
          title: "error",
          description: "No user available",
          variant: "destructive",
        });
        onClose();
      }
      // else if (
      //   user.filter((user) => {
      //     return (
      //       user?.name &&
      //       fields.find(
      //         (field) => field.user === user.id && field.type == type,
      //       ) == undefined
      //     );
      //   }).length == 0
      // ) {
      //   toast({
      //     title: "error",
      //     description: "All users have been added",
      //     variant: "destructive",
      //   });
      //   onClose();
      // }
    }
  }, [user, fields, type, open]);
  console.log(dropdownUsers, "drop");

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-50" />
        <AlertDialog.Content className="fixed inset-0 z-20 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <AlertDialog.Title className="text-center text-lg font-semibold">
              Select User
            </AlertDialog.Title>
            <div className="mt-4">
              <Select onValueChange={(e) => setValue(e)} value={value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownUsers?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
            <div className="mt-6 flex justify-evenly space-x-2">
              <AlertDialog.Cancel asChild>
                <button
                  onClick={onClose}
                  className="rounded-md bg-gray-200 px-4 py-2"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={() => {
                    if (!value) {
                      setError("Please select a user");
                      return;
                    }
                    let current = value;
                    setValue("");
                    onConfirm(current);
                  }}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default SelectUserModel;
