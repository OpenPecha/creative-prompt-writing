import { useState } from "react";
import { Button, Textarea } from "~/components/ui";
import ControlButton from "./ControlButton";

export default function WorkStation({ text }) {
  const [promptText, setPromptText] = useState(
    text?.annotated_prompt ? text?.annotated_prompt : ""
  );
  const writeUp = text?.write_up;

  const reset = () => {
    setPromptText("");
  };

  const isActive = !promptText ? false : true;

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
            value={promptText}
            rows={15}
            onChange={(e) => setPromptText(e.target.value)}
          />

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <ControlButton
              promptText={promptText}
              active={isActive}
              reset={reset}
              text={text}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
