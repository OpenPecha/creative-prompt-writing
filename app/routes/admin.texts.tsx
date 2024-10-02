import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { db } from "~/services/db.server";
import UploadText from "./admin/component/UploadText";
import TextList from "./admin/component/TextList";
import { getGroupInfo, getGroupList } from "~/model/group.server";

const PER_PAGE = 10;
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams;
  const currentPage = Math.max(Number(query.get("page")) || 1, 1);
  const skip = (currentPage - 1) * PER_PAGE;

  const texts = await db.task.findMany({
    select: {
      version: true,
    },
    distinct: ["version"],
    take: PER_PAGE,
    skip,
  });
  const count = await db.task.groupBy({
    by: ["version"],
  });

  const groups = await getGroupList();

  return json({
    texts,
    count: count.length,
    groups,
  });
};
export const action: ActionFunction = async ({ request }) => {
  const formdata = await request.formData();
  const version = formdata.get("version") as string;
  const _action = formdata.get("_action") as string;

  if (_action === "get_info") {
    const text = getGroupInfo(version);
    return text;
  }
  return null;
};
function AdminText() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex w-full rounded-lg p-3 border-b justify-center border-b-slate-100 ">
        <UploadText />
      </div>
      <div className="m-3 rounded-md shadow-lg bg-dark_text-tertiary">
        <TextList />
      </div>
    </div>
  );
}

export default AdminText;
