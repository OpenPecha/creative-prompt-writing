import { useFetcher, useLoaderData } from "@remix-run/react";
import React, { useEffect } from "react";
import {
  Button,
  Label,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui";

type uploaddata = { version: string; write_up: string };

function UploadText() {
  const { groups } = useLoaderData();
  const [csvData, setCsvData] = React.useState<uploaddata[]>([]);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<string | undefined>(
    undefined
  );
  const dataUpload = useFetcher();

  useEffect(() => {
    if (dataUpload.data && dataUpload.data?.count > 0) {
      reset();
    }
  }, [dataUpload.data]);

  function reset() {
    setCsvData([]);
    setFileNames([]);
    setSelectedGroup(undefined);
  }
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = e.target.files[i];

      if (file) {
        let filename = file.name;
        if (filename.includes(".json")) {
          filename = filename.replace(".json", "");
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result);
            setFileNames((prev) => [...prev, filename]);
            const rows = jsonData.map((item) => {
              return {
                version: filename,
                write_up: item.write_up,
              };
            });
            setCsvData((prev) => [...prev, ...rows]);
          } catch (error) {
            console.error("Error parsing JSON: ", error);
          }
        };

        reader.readAsText(file);
      }
    }
  };
  const handleUpload = () => {
    if (csvData?.length < 1) return null;
    const value = JSON.stringify(csvData);
    const name = JSON.stringify(fileNames);
    const groupId = JSON.stringify(selectedGroup);
    try {
      dataUpload.submit(
        {
          name,
          data: value,
          groupId,
        },
        {
          method: "POST",
          action: "/api/upload",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
  };

  return (
    <div className="mb-2 mt-4 flex flex-col md:flex-row gap-4">
      {dataUpload.data?.error && (
        <div className="text-red-600">{dataUpload.data?.error}</div>
      )}
      <div className="flex gap-2 items-center">
        Group
        <Select onValueChange={handleGroupChange} value={selectedGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"select group"} />
          </SelectTrigger>
          <SelectContent>
            {groups?.map((group) => {
              return (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-center">
        <Label htmlFor="text_file">Text</Label>
        <Input
          id="text_file"
          type="file"
          accept=".json"
          onChange={handleFileInputChange}
          multiple
          className="file-input file-input-bordered w-full max-w-xs"
        />
      </div>
      <Button
        disabled={csvData.length < 1 || !selectedGroup}
        onClick={handleUpload}
        className="btn-sm rounded-md min-h-0"
      >
        {dataUpload.state !== "idle" ? <div>uploading</div> : <>upload</>}
      </Button>{" "}
      {dataUpload.state !== "idle" && <div>uploading...</div>}
    </div>
  );
}

export default UploadText;
