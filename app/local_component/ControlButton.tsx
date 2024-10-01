import { useFetcher, useLoaderData } from "@remix-run/react";
import { FiArrowRight } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Button } from "~/components/ui";

function ControlButton({ promptText, text, reset, active }: any) {
  const submit_fetcher = useFetcher();
  const { user } = useLoaderData();
  function submit() {
    submit_fetcher.submit(
      {
        promptText,
        id: text.id,
        userId: user.id,
        // prompt_text: prompt,
      },
      { action: "/api/text", method: "POST" }
    );
  }

  return (
    <div className="fixed bottom-10 w-full">
      <div className="flex justify-center gap-6">
        <Button
          variant="ghost"
          className="h-[10vh] w-[10vh] text-white text-xl flex flex-col"
          onClick={reset}
          disabled={!active}
        >
          <RxCross2 size={40} />
          Reset
        </Button>
        <Button
          className="bg-green-700 hover:bg-green-600 h-[10vh] w-[10vh] text-xl flex flex-col"
          onClick={submit}
          disabled={!active}
        >
          <FiArrowRight size={40} /> Submit
        </Button>
      </div>
    </div>
  );
}

export default ControlButton;
