"use client";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { useUserToken } from "@/hooks/use-user-token";
import { CustomUser } from "@/types/types";

import { Banner, BannerSkeleton } from "./banner";
import { Bio, BioSkeleton } from "./bio";
import { Header, HeaderSkeleton } from "./header";

interface ProfileProps {
  user: CustomUser;
}

export const Profile = ({ user }: ProfileProps) => {
  const { identity } = useUserToken(user.id);

  if (!identity) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <Banner display_name={user.display_name} />

      <MaxWidthWrapper className="hidden-scrollbar col-span-1 space-y-4 pb-10 lg:col-span-2 lg:overflow-y-auto xl:col-span-2 2xl:col-span-5">
        <div className="flex items-center">
          <Header
            display_name={user.display_name}
            email={user.email}
            image={user.image}
            role={user.role}
          />
        </div>
        <Bio bio={user.bio} />
      </MaxWidthWrapper>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <>
      <BannerSkeleton />

      <MaxWidthWrapper>
        <HeaderSkeleton />
        <BioSkeleton />
      </MaxWidthWrapper>
    </>
  );
};
