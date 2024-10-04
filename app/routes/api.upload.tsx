import { ActionFunction } from "@remix-run/node";
import { uploadData } from "~/model/dataUpload.server";

export const action: ActionFunction = async ({ request }) => {
  const formdata = await request.formData();
  const data = formdata.get("data") as string;
  const name = formdata.get("name") as string;
  const groupId = formdata.get("groupId") as string;
  const parsed_Data = JSON.parse(data);
  const parsed_Name = JSON.parse(name);
  const parsed_GroupId = JSON.parse(groupId);

  if (request.method === "POST") {
    const status = await uploadData({
      name: parsed_Name,
      data: parsed_Data,
      groupId: parsed_GroupId,
    });
    return status;
  }
  return null;
};
