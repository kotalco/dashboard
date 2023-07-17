"use client";

import { Logo } from "@/components/logo";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  // icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavItem[];
    }
);

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex shrink-0">
      <div className="flex flex-col w-64 bg-white">
        <div className="flex flex-col pt-5 pb-4 overflow-y-auto grow">
          <div className="flex items-center px-4 shrink-0">
            <Logo />
          </div>
          {children}
        </div>
        {/* <WorkspacesList /> */}
        {/* <div>
          <Link
            href="/workspaces/create"
            className="block px-4 py-3 mx-2 my-3 text-center text-gray-800 bg-white border border-gray-300 rounded shadow hover:bg-gray-100"
          >
            Create New Workspace
          </Link>
        </div> */}
      </div>
    </div>
  );
};
