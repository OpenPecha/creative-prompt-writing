import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui";
import UserList from "./UserList";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  function close() {
    setSidebarOpen(false);
  }
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Pecha Tools</SheetTitle>

          <SheetDescription>Prompt Editor</SheetDescription>
        </SheetHeader>
        <UserList close={close} />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
