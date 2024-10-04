import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { ChevronsDown, ChevronsUpDown } from "lucide-react";
import React, { useEffect } from "react";
import {
  Button,
  CollapsibleContent,
  CollapsibleTrigger,
  ScrollArea,
  Collapsible,
} from "~/components/ui";
import { timeAgo, truncateString } from "~/lib/utility";

function History({ close }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [param, setParams] = useSearchParams();
  const { session, user } = useLoaderData();
  const fetcher = useFetcher();
  useEffect(() => {
    if (isOpen) {
      const url = "/api/history?session=" + session + "&" + "userId=" + user.id;
      fetcher.load(url);
    }
  }, [isOpen]);
  const sample = fetcher.data;
  if (sample?.length === 0) return null;
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">History</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <ScrollArea>
          <div className="flex flex-col gap-2 max-h-[60vh]">
            {sample?.map((item) => {
              function handleHistory() {
                setParams((p) => {
                  p.set("history", item.id);
                  return p;
                });
                close();
              }
              return (
                <Button
                  key={item.id}
                  variant={"ghost"}
                  onClick={handleHistory}
                  className="flex justify-between"
                >
                  <h5>{truncateString(item.write_up, 20)}</h5>
                  <span>{timeAgo(item.updatedAt)}</span>{" "}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default History;
