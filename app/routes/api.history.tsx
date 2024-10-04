import { LoaderFunction } from "@remix-run/node";
import { db } from "~/services/db.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const session = url.searchParams.get("session") as string;
  const userId = url.searchParams.get("userId") as string;
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
        where: {
          status: "REVIEWED",
          ...(userId && { annotated_by_id: userId }),
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
    },
  });
  if (user.role === "ANNOTATOR") {
    return user?.annotated;
  }
  if (user.role === "REVIEWER") {
    return user?.reviewed;
  }

  return [];
};
