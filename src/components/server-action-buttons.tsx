"use client";

import { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { ElementRef, useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { serverAction } from "@/server/proxmox/server-action";
import { ServerData, ServerType } from "@/types/types";

interface ServerActionButtonsProps {
  label: string;
  action: string;
  icon: LucideIcon;
  color: string;
  fill?: boolean;
  server: ServerData;
  type: ServerType;
  trigger: "button" | "dropdown";
}

interface IconProps {
  icon: LucideIcon;
  color: string;
  fill?: boolean;
  label: string;
}

const Icon = ({ icon: Icon, color, fill }: IconProps) => {
  return (
    <Icon
      className={`mr-2 h-4 w-4 text-${color} fill-${fill ? color : ""} transition-all group-hover:fill-${fill ? "text" : ""} group-hover:text-text`}
    />
  );
};

export const ServerActionButtons = ({
  label,
  action,
  icon,
  color,
  fill,
  server,
  type,
  trigger,
}: ServerActionButtonsProps) => {
  const { data: session } = useSession();
  const role = session?.user.role;

  const { toast } = useToast();
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending] = useTransition();

  let isDisabled = false;
  if (
    (action === "start" && server.status === "running") ||
    (["shutdown", "stop", "reboot"].includes(action) &&
      server.status === "stopped") ||
    role !== "admin" ||
    isPending
  ) {
    isDisabled = true;
  }

  const onClick = () => {
    serverAction({ type: type, action: action, vmid: server.vmid });
    toast({
      title: `${label}ing server: ${server.name}`,
    });
    // TODO: Fix for dialog closing when dropdown item is clicked
    closeRef?.current?.click?.();
  };

  return action !== "start" ? (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {trigger === "button" ? (
            <Button
              disabled={isDisabled}
              variant="outline"
              className={`text-${color} group`}
            >
              <Icon icon={icon} color={color} fill={fill} label={label} />
              {label}
            </Button>
          ) : trigger === "dropdown" ? (
            <DropdownMenuItem
              disabled={isDisabled}
              className={`group flex items-center text-${color}`}
            >
              <Icon icon={icon} color={color} fill={fill} label={label} />
              {label}
            </DropdownMenuItem>
          ) : null}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              You are about to {action} {server.name}
            </DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button
              disabled={isDisabled}
              variant="outline"
              onClick={onClick}
              className={`text-${color} group`}
            >
              <Icon icon={icon} color={color} fill={fill} label={label} />
              {label}
            </Button>
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant="ghost" autoFocus>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <>
      {trigger === "button" ? (
        <Button
          disabled={isDisabled}
          onClick={onClick}
          variant="outline"
          className={`text-${color} group`}
        >
          <Icon icon={icon} color={color} fill={fill} label={label} />
          {label}
        </Button>
      ) : trigger === "dropdown" ? (
        <DropdownMenuItem
          disabled={isDisabled}
          onClick={onClick}
          className={`group flex items-center text-${color}`}
        >
          <Icon icon={icon} color={color} fill={fill} label={label} />
          {label}
        </DropdownMenuItem>
      ) : null}
    </>
  );
};
