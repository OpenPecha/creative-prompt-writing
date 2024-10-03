import { splitIntoSyllables } from "~/lib/utility";
import { db } from "~/services/db.server";

export const createUserIfNotExists = async (username: string) => {
  let user;
  user = await db.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    user = await db.user.create({
      data: {
        username: username,
        nickname: username.split("@")[0],
      },
    });
  }
  if (!user?.picture) {
    //get user detail from api
    let api = "https://pecha.tools/api/user/?email=" + username;
    let response = await fetch(api);
    let data = await response.json();
    await db.user.update({
      where: { username },
      data: {
        picture: data?.picture,
      },
    });
  }
  return user;
};

export const getAnnotatedCount = async (userId: string) => {
  return await db.task.count({
    where: {
      annotated_by_id: userId,
      status: {
        in: ["ANNOTATED", "REVIEWED"],
      },
    },
  });
};

export const getUsersWorkReport = async (user, fromDate, toDate) => {
  const { id: userId, role, username } = user;
  // create a user work report object
  const userWorkReport = {
    id: userId,
    role,
    username: username,
    syllableCount: 0,
  };

  let annotatedWorks = [];
  let reviewedWorks = [];

  // fetch annotated and reviewed works for the user based on the role
  if (role === "ANNOTATOR") {
    annotatedWorks = await db.task.findMany({
      where: {
        annotated_by_id: userId,
        ...(fromDate &&
          toDate && {
            annotatedAt: {
              gte: new Date(fromDate),
              lte: new Date(toDate),
            },
          }),
      },
      select: {
        id: true,
        annotated_prompt: true,
      },
    });

    const updatedReport = annotatedWorks.reduce((acc, work) => {
      const syllables = splitIntoSyllables(work.annotated_prompt).length || 0;
      acc.syllableCount += syllables;
      return acc;
    }, userWorkReport);
    return updatedReport;
  } else {
    reviewedWorks = await db.task.findMany({
      where: {
        reviewed_by_id: userId,
        ...(fromDate &&
          toDate && {
            updatedAt: {
              gte: new Date(fromDate),
              lte: new Date(toDate),
            },
          }),
      },
      select: {
        id: true,
        reviewed_prompt: true,
      },
    });

    const updatedReport = reviewedWorks.reduce((acc, work) => {
      const syllables = splitIntoSyllables(work.reviewed_prompt).length || 0;
      acc.syllableCount += syllables;
      return acc;
    }, userWorkReport);
    return updatedReport;
  }
};
