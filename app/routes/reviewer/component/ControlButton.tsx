import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
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
        reviewedPrompt,
        type: "annotator",
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
        reviewedPrompt,
        type: "annotator",
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
    <div className="fixed bottom-5 w-full z-50">
      <div className="flex justify-center gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="reject"
                variant="destructive"
                className="text-white text-xl flex gap-4 p-4"
                onClick={reject}
              >
                <RxCross2 size={30} />
                Reject
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-400 text-base" align="center">
              Press Alt + x to reject.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          className="bg-green-700 hover:bg-green-600 h-[10vh] w-[10vh] text-xl flex flex-col"
          onClick={submit}
        >
          <FiArrowRight size={40} /> Submit
        </Button>
      </div>
    </div>
  );
}

export default ControlButton;
