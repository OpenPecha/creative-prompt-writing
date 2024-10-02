import { LoaderFunction } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import Menu from "./component/Menu";
import { db } from "~/services/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams;
  const session = query.get("session") as string;

  if (!session) return redirect("/error");

  const user = await db.user.findUnique({
    where: { username: session },
    select: {
      id: true,
      role: true,
      username: true,
    },
  });
  if (!user || user?.role !== "ADMIN") {
    return redirect("/");
  }
  return { user };
};

function Route() {
  let { user } = useLoaderData();
  return (
    <div className="bg-gray-200 h-screen pt-3 overflow-scroll">
      <div className="flex justify-center m-3">
        <Menu user={user} />
      </div>
      <hr />
      <Outlet />
    </div>
  );
}

export default Route;
