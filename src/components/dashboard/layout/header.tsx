"use client";

import { Bell, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export function Header() {
  const router = useRouter();

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center gap-4">
          {/* <div className="relative w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search contracts..." className="pl-8" />
          </div> */}
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Button
              variant={"outline"}
              onClick={() => router.push(ROUTES.newContract)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Contract
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </div>
    </header>
  );
}
