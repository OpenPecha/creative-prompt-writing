import { db } from "~/services/db.server";
import AddGroup from "./admin/component/AddGroup";
import { json, useLoaderData } from "@remix-run/react";
import GroupTable from "./admin/component/GroupTable";

export const loader = async () => {
  // get all groups with their id, name, no. of users, no. of tasks
  const groups = await db.group.findMany({
    select: {
      id: true,
      name: true,
      users: {
        select: {
          id: true,
        },
      },
      task: {
        select: {
          id: true,
        },
      },
    },
  });

  const groupData = groups.map((group) => {
    return {
      id: group.id,
      name: group.name,
      userCount: group?.users.length,
      taskCount: group?.task.length,
    };
  });

  return { groups: groupData };
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  if (name) {
    await db.group.create({
      data: {
        name,
      },
    });
  }

  return json({ success: true });
};

function Groups() {
  const { groups } = useLoaderData();
  return (
    <div className="max-w-4xl mx-auto">
      <AddGroup />
      <div className="m-3 rounded-md shadow-lg bg-dark_text-tertiary">
        <GroupTable groups={groups} />
      </div>
    </div>
  );
}

export default Groups;
