import { Link, useLocation } from "@remix-run/react";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui";
function Menu({ user }) {
  const border = "border-b-2 border-blue-500 rounded-md";
  const location = useLocation();
  const locationPath = location.pathname;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <Link
          to={"/admin/users?session=" + user.username}
          className={locationPath.includes("user") ? border : ""}
        >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Users
          </NavigationMenuLink>
        </Link>
        <Link
          to={"/admin/texts?session=" + user.username}
          className={locationPath.includes("texts") ? border : ""}
        >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Texts
          </NavigationMenuLink>
        </Link>
        <Link
          to={"/admin/groups?session=" + user.username}
          className={locationPath.includes("groups") ? border : ""}
        >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Groups
          </NavigationMenuLink>
        </Link>
        <Link
          to={"/admin/reports?session=" + user.username}
          className={locationPath.includes("reports") ? border : ""}
        >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Reports
          </NavigationMenuLink>
        </Link>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Menu;
