import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
      profile: "h-32 w-32",
      profileLg: "h-52 w-52",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  username: string;
  image: string;
}

export const UserAvatar = ({ username, image, size }: UserAvatarProps) => {
  return (
    <div className="relative">
      <Avatar className={cn(avatarSizes({ size }))}>
        <AvatarImage src={image} className="object-cover" />
        <AvatarFallback
          className={cn(
            avatarSizes({ size }) === "h-52 w-52" ? "text-8xl" : "text-5xl",
          )}
        >
          {username[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
};
