import { Status } from "@prisma/client";
import { db } from "~/services/db.server";

export async function getText(id: string) {
  return await db.task.findFirst({
    where: { id },
  });
}

export const getUserText = async (userId: string) => {
  let text = await db.task.findFirst({
    where: {
      annotated_by_id: userId,
      status: "PENDING",
    },
  });
  if (!text) {
    //asign data
    const unassigned = await db.task.findFirst({
      where: {
        annotated_by_id: null,
        status: "PENDING",
      },
    });
    if (!unassigned) {
      return null;
    }
    text = await db.task.update({
      where: {
        id: unassigned?.id,
      },
      data: {
        annotated_by_id: userId,
      },
    });
  }
  return text;
};
export async function trashText(id: string, userId: string) {
  const text = await db.task.update({
    where: {
      id,
    },
    data: {
      status: "PENDING",
      annotated_by: { connect: { id: userId } },
      annotated_prompt: null,
    },
  });
  return text;
}

export async function rejectText(id: string, userId: string) {
  const text = await db.task.update({
    where: {
      id,
    },
    data: {
      status: "PENDING",
      annotated_by: { disconnect: { id: userId } },
      reviewed_by: { disconnect: { id: userId } },
      annotated_prompt: null,
      reviewed_prompt: null,
      rejected_by: { connect: { id: userId } },
    },
  });
  return text;
}
export async function removeRejectText(
  id: string,
  userId: string,
  status: Status
) {
  const text = db.task.update({
    where: {
      id,
    },
    data: {
      status,
      rejected_by: { disconnect: { id: userId } },
    },
  });

  return text;
}

export async function saveText({
  id,
  annotatedPrompt,
  reviewed_text,
  userId,
}: any) {
  const isReviewer = reviewed_text ? true : false;
  if (!isReviewer) {
    return await db.task.update({
      where: {
        id,
      },
      data: {
        annotated_prompt: annotatedPrompt,
        annotated_by_id: userId,
        status: "ANNOTATED",
        annotatedAt: new Date(),
      },
    });
  } else {
    return await db.task.update({
      where: {
        id,
      },
      data: {
        reviewed_prompt: reviewed_text,
        status: "REVIEWED",
        reviewed_by_id: userId,
      },
    });
  }
}

// export async function changeCategory(version: string, category: string) {
//   try {
//     let text = await db.task.updateMany({
//       where: { version },
//       data: {
//         category:,
//       },
//     });
//     return text.count;
//   } catch (e) {
//     throw new Error(e);
//   }
// }

export async function deleteTextByVersion(version: string) {
  try {
    const deleted = await db.task.deleteMany({
      where: { version },
    });
    return deleted.count;
  } catch (e) {
    throw new Error(e + "cannot delete");
  }
}

export async function delete_modified({ id }: { id: string }) {
  return await db.task.update({
    where: { id },
    data: {
      annotated_prompt: null,
    },
  });
}
