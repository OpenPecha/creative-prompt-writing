import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { CiBurger } from "react-icons/ci";
import { Button } from "~/components/ui";
import AlertMessage from "~/local_component/AlertMessage";
import Sidebar from "~/local_component/Sidebar";
import WorkStation from "~/local_component/WorkStation";
import { getText, getUserText } from "~/model/text.server";
import { createUserIfNotExists, getAnnotatedCount } from "~/model/user.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Pecha Prompt Writing Tool" },
    {
      name: "Prompt Writing",
      content: "In house pecha tool prompt writing for creative writing",
    },
  ];
};
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const session = url.searchParams.get("session") as string;
  const history = url.searchParams.get("history") as string;
  if (!session)
    return {
      error: "no session found",
    };
  const user = await createUserIfNotExists(session);
  let text = null;
  let annotatedCount = 0;
  if (user?.role === "REVIEWER") {
    return redirect(`/reviewer?session=${user.username}`);
  }
  if (user?.role === "ADMIN") {
    return redirect(`/admin?session=${user.username}`);
  }
  if (history && user?.activate) {
    text = await getText(history);
  }
  if (!history && user.activate && user?.role === "ANNOTATOR") {
    text = await getUserText(user?.id);
  }
  if (user?.role === "ANNOTATOR" && user.activate) {
    annotatedCount = await getAnnotatedCount(user?.id);
  }
  if (!text) return { user, error: "No text found" };
  return { user, text, annotatedCount };
};

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { text, error } = useLoaderData();
  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {!error && (
        <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-2">
          <CiBurger />
        </Button>
      )}
      <div className="mb-2">{error && <AlertMessage message={error} />}</div>
      {text && <WorkStation text={text} key={text?.id} />}
    </div>
  );
}
