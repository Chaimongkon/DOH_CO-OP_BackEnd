"use client";

import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useSession } from "next-auth/react";

interface MenuItem {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: React.ElementType;
  href?: string;
  roles?: string[];
  children?: MenuItem[];
}

interface SidebarItemsProps {
  toggleMobileSidebar?: () => void;
}

const SidebarItems: React.FC<SidebarItemsProps> = ({ toggleMobileSidebar }) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const { data: session } = useSession();
  //guest
  const userRole = session?.user?.userrole || "SuperAdmin";

  const filterMenuByRole = (
    menuItems: MenuItem[],
    role: string
  ): MenuItem[] => {
    return menuItems
      .filter((item) => {
        if (item.roles && !item.roles.includes(role)) {
          return false;
        }
        return true;
      })
      .map((item) => {
        if (item.children) {
          const filteredChildren = filterMenuByRole(item.children, role);
          return { ...item, children: filteredChildren };
        }
        return item;
      })
      .filter((item) => {
        if (item.children && item.children.length === 0) {
          return false;
        }
        return true;
      });
  };

  const filteredMenuItems = filterMenuByRole(Menuitems, userRole);

  return (
    <Box sx={{ px: "20px" }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {filteredMenuItems.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={(event) => {
                  if (toggleMobileSidebar) {
                    toggleMobileSidebar();
                  }
                }}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
