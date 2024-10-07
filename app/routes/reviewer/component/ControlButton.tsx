import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui";

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

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6">
        <Button
          id="reject"
          variant="destructive"
          className="text-white text-xl p-6"
          onClick={reject}
        >
          Reject
        </Button>
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
