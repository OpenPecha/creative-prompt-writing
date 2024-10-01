import { Link, useLoaderData } from "@remix-run/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Button,
} from "~/components/ui";
import History from "./History";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, text, annotatedCount } = useLoaderData();
  const isAdmin = user?.role === "ADMIN";
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Pecha Tools</SheetTitle>

          <SheetDescription>Prompt Editor</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 pt-4 pb-1">
          <div className="grid grid-cols-4 items-center gap-4">
            {/* {isAdmin && (
              <Link to={`/admin?session=${user?.username}`} className="mt-3">
                <Button>Admin</Button>
              </Link>
            )} */}
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-2 ">
          <div>
            <h3>User :</h3> {user?.username}
          </div>
          <div>
            <p>Submitted : {annotatedCount}</p>
          </div>
          <div>
            <h3>Text :</h3> {text?.id}
          </div>
        </div>
        <History />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
