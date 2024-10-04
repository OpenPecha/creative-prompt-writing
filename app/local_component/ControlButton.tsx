import { useFetcher, useLoaderData } from "@remix-run/react";
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
      },
      { action: "/api/text", method: "POST" }
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6">
        <Button
          variant="default"
          className="text-white text-xl p-6"
          onClick={reset}
          disabled={!active}
        >
          Reset
        </Button>
        <Button
          className="bg-green-700 hover:bg-green-600 text-xl p-6"
          onClick={submit}
          disabled={!active}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ControlButton;
