"use client";

import Link from "next/link";
import { UserCog, Users } from "lucide-react";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomUser } from "@/types/types";

import { NavItem, NavItemSkeleton } from "./nav-item";
import { MobileNav } from "./mobile-nav";

interface NavbarProps {
  user: CustomUser;
}

export const Navbar = ({ user }: NavbarProps) => {
  const routes = [
    {
      label: "Edit current user",
      icon: Users,
      href: `/u/${user.username}/profile`,
    },
  ];

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-12 w-full border-b border-accent bg-background/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-12 items-center justify-between">
          <Link href={`/admin`} className="z-40 flex items-center">
            <h2 className="flex items-center text-xl font-semibold text-muted-foreground hover:text-text">
              <UserCog className="mr-2 h-6 w-6" />
              Admin
            </h2>
          </Link>

          <MobileNav user={user!} />

          <ul className="hidden items-center space-x-4 font-semibold text-muted-foreground sm:flex">
            {routes.map((route) => (
              <NavItem
                key={route.href}
                label={route.label}
                icon={route.icon}
                href={route.href}
              />
            ))}
          </ul>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex justify-between">
        <Skeleton className="h-12" />
        <ul className="flex items-center">
          {[...Array(7)].map((_, i) => (
            <NavItemSkeleton key={i} />
          ))}
        </ul>
      </div>
    </MaxWidthWrapper>
  );
};