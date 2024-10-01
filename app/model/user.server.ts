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
