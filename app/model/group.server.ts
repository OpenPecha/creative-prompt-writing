import { db } from "~/services/db.server";

export const getGroupInfo = async (version: string) => {
  const textRecords = await db.task.findMany({
    where: {
      version: version,
    },
    select: {
      version: true,
      modified_text: true,
      reviewed_text: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const reviewed_count =
    textRecords.filter((item) => item.reviewed_text !== null).length ?? 0;

  const accepted_count =
    textRecords.filter((item) => item.modified_text !== null).length ?? 0;
  return {
    total: textRecords.length,
    reviewed: reviewed_count,
    accepted_count,
  };
};

// to add a new group
export const addGroup = async (name: string) => {
  return await db.group.create({
    data: {
      name,
    },
  });
};

export const getGroupList = async () => {
  return await db.group.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
