import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { db } from "~/services/db.server";
import WorkStation from "./reviewer/component/WorkStation";
import { useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { Button } from "~/components/ui";
import History_admin from "./reviewer/component/History_admin";
export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const session = url.searchParams.get("session") as string;
  const history = url.searchParams.get("history") as string;

  const userId = params.userId;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      activate: true,
    },
  });
  let text;
  if (history) {
    text = await db.task.findFirst({
      where: {
        id: history,
      },
    });
  } else {
    text = await db.task.findFirst({
      where: {
        annotated_by_id: userId,
        annotated_prompt: { not: null },
        reviewed_prompt: null,
        status: "ANNOTATED",
      },
    });
  }

  const submitted_count = await db.task.count({
    where: {
      annotated_by_id: user?.id,
      annotated_prompt: { not: null },
      status: {
        in: ["ANNOTATED", "REVIEWED"],
      },
    },
  });

  const reviewed_count = await db.task.count({
    where: {
      annotated_by_id: user?.id,
      reviewed_prompt: { not: null },
      status: "REVIEWED",
    },
  });

  return {
    session,
    user,
    text,
    submitted_count,
    reviewed_count,
  };
};

function ReviewerUser() {
  let { text } = useLoaderData();
  const location = useLocation();
  const showHistroy = location.pathname.endsWith("/reviewer/");
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);

  if (!text) return <div className="text-white">work complete</div>;
  return (
    <>
      <History_admin
        sidebarOpen={historySidebarOpen}
        setSidebarOpen={setHistorySidebarOpen}
      />
      {!showHistroy && (
        <Button
          onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
          className="absolute top-4 right-24"
          title="history"
        >
          <CiBookmark />
          History
        </Button>
      )}
      <WorkStation text={text} key={text?.write_up} />
    </>
  );
}

export default ReviewerUser;
