import { LoaderFunction } from "@remix-run/node";
import { db } from "~/services/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const session = url.searchParams.get("session") as string;
  const user = await db.user.findFirst({
    where: { username: session },
    select: {
      role: true,
      annotated: {
        where: {
          status: "ANNOTATED",
        },
        select: {
          id: true,
          write_up: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 20,
      },
      reviewed: {
        where: { status: "REVIEWED" },
        select: {
          id: true,
          write_up: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 20,
      },
    },
  });
  console.log("user history", user);
  if (user.role === "ANNOTATOR") {
    return user?.annotated;
  }
  if (user.role === "REVIEWER") {
    return user?.reviewed;
  }

  return [];
};
