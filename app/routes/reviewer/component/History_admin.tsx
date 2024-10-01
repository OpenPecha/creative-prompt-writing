import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui";
import History from "./History";
import { useLoaderData } from "@remix-run/react";

function History_admin({ sidebarOpen, setSidebarOpen }) {
  let { reviewed_count, submitted_count, text, user } = useLoaderData();
  function close() {
    setSidebarOpen(false);
  }
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Pecha Tools</SheetTitle>
          <SheetDescription>Prompt Editor</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 pb-2 ">
          <small className="text-sm font-medium leading-none">{text?.id}</small>
          <div className="flex gap-2 items-center">
            <div className="text-lg font-semibold">User:</div>
            <small className="text-sm font-medium leading-none">
              {user.username}
            </small>
          </div>

          <div className="flex gap-2 items-center">
            <div className="text-lg font-semibold">Submitted :</div>
            <small className="text-sm font-medium leading-none">
              {submitted_count}
            </small>
          </div>

          <div className="flex gap-2 items-center">
            <div className="text-lg font-semibold">Reviewed :</div>
            <small className="text-sm font-medium leading-none">
              {reviewed_count}
            </small>
          </div>
        </div>
        <History close={close} />
      </SheetContent>
    </Sheet>
  );
}

export default History_admin;
