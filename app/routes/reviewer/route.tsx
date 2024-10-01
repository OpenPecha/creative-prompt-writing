import React, { useState } from "react";
import Sidebar from "./component/Sidebar";
import AlertMessage from "~/local_component/AlertMessage";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { CiBurger } from "react-icons/ci";
import { LoaderFunction } from "@remix-run/node";
import { db } from "~/services/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const session = url.searchParams.get("session") as string;
  const user = await db.user.findFirst({
    where: { username: session },
    include: {
      reviewedUsers: {
        where: {
          role: "ANNOTATOR",
          reviewer_user: {
            username: session,
          },
        },
        include: {
          _count: {
            select: {
              annotated: {
                where: {
                  reviewed_prompt: null,
                  annotated_prompt: { not: null },
                  status: "ANNOTATED",
                },
              },
            },
          },
        },
      },
    },
  });
  if (user?.role !== "REVIEWER") {
    return redirect(`/`);
  }
  return { error: null, user, session };
};

function Reviewer() {
  const { error } = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="p-3">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex justify-between p-2">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-2"
          title="about"
        >
          <CiBurger />
        </Button>
      </div>
      <div className="mb-2">{error && <AlertMessage message={error} />}</div>
      <Outlet />
    </div>
  );
}

export default Reviewer;
