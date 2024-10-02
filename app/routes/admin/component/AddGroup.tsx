import { useFetcher } from "@remix-run/react";
import React from "react";
import { Input, Button, Label } from "~/components/ui";

function AddGroup() {
  const fetcher = useFetcher();
  const [groupName, setGroupName] = React.useState("");

  const handleSubmit = async () => {
    fetcher.submit(
      {
        name: groupName,
      },
      {
        method: "POST",
      }
    );
    if (fetcher?.data.success) {
      setGroupName("");
    }
  };

  return (
    <div className="flex w-full justify-center items-end p-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="groupInput">Add Group</Label>
        <Input
          id="groupInput"
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="ml-4"
        disabled={!groupName.trim()}
        onClick={handleSubmit}
      >
        Add
      </Button>
    </div>
  );
}

export default AddGroup;
