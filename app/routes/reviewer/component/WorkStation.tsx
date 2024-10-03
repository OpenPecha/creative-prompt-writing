import React, { useEffect, useRef } from "react";
import { Textarea } from "~/components/ui";
import ControlButton from "./ControlButton";
import { useFetcher, useLoaderData } from "@remix-run/react";

function WorkStation({ text }) {
  const writeUp = text?.write_up;
  const [reviewedPrompt, setReviewedPrompt] = React.useState(
    text?.reviewed_prompt ? text?.reviewed_prompt : text?.annotated_prompt
  );

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
    if (e.altKey && e.keyCode === 65) {
      const submitButton = document.getElementById("submit");
      if (submitButton) {
        submitButton.click();
      }
    }
  }

  return (
    <div className="max-w-8xl mx-auto bg-gray-50 md:p-4 rounded-md shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creative Write up Section */}
        <div className="space-y-2 md:h-[80vh]">
          <h2 className="text-lg font-semibold text-white bg-black rounded py-2 px-4 inline-block">
            Creative Write up
          </h2>
          <div className="border border-gray-600 rounded p-4 overflow-y-auto h-96 md:h-3/4">
            <p className="text-gray-700">
              {/* Placeholder text */}
              {writeUp}
            </p>
          </div>
        </div>

        {/* Prompt Section */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white bg-black rounded py-2 px-4 inline-block">
            Prompt
          </h2>
          <Textarea
            className="w-full border border-gray-600 rounded-md p-4"
            value={reviewedPrompt}
            rows={15}
            onChange={(e) => setReviewedPrompt(e.target.value)}
          />

          {/* Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <ControlButton reviewedPrompt={reviewedPrompt} text={text} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkStation;
