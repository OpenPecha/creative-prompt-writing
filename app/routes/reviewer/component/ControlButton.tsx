import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import {
  Button,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";

function ControlButton({ reviewedPrompt, text }) {
  const submit_fetcher = useFetcher();
  const { user, session } = useLoaderData();

  function submit() {
    submit_fetcher.submit(
      {
        id: text.id,
        reviewedPrompt: reviewedPrompt,
        userId: user.id,
        session,
      },
      { action: "/api/text", method: "POST" }
    );
  }

  function reject() {
    submit_fetcher.submit(
      {
        id: text.id,
        reviewedPrompt: reviewedPrompt,
        userId: user.id,
        session,
      },
      { action: "/api/text", method: "PATCH" }
    );
  }

  useEffect(() => {
    // Add event listener for keyboard shortcuts
    window.addEventListener("keydown", handleKeyPress);
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handleKeyPress(e) {
    console.log(e);
    if (e.altKey && e.keyCode === 88) {
      const rejectButton = document.getElementById("reject");
      if (rejectButton) {
        rejectButton.click();
      }
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="reject"
                variant="destructive"
                className="text-white text-xl p-6"
                onClick={reject}
              >
                Reject
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-400 text-base" align="center">
              Press Alt + x to reject.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          className="bg-green-700 hover:bg-green-600 text-xl p-6 "
          onClick={submit}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}

export default ControlButton;
