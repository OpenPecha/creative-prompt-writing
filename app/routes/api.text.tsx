import { ActionFunction, redirect } from "@remix-run/node";
import { deleteTextByVersion, rejectText, saveText } from "~/model/text.server";
import { db } from "~/services/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const session = formData.get("session") as string;
  if (request.method === "POST") {
    const id = formData.get("id") as string;
    const annotatedPrompt = formData.get("promptText") as string;
    const reviewedPrompt = formData.get("reviewedPrompt") as string;
    const userId = formData.get("userId") as string;
    // const prompt_text = formData.get("prompt_text") as string;
    if (reviewedPrompt) {
      const reviewer = await db.user.findFirst({
        where: { username: session },
      });
      let text = await saveText({
        id,
        reviewedPrompt,
        userId: reviewer?.id,
      });
      return redirect(`/reviewer/users/${userId}?session=${session}`);
    } else {
      const user = await db.user.findUnique({ where: { id: userId } });
      let text = await saveText({
        id,
        annotatedPrompt,
        userId,
        // prompt_text,
      });
      return redirect(`/?session=${user?.username}`);
    }
  }
  if (request.method === "PATCH") {
    const userId = formData.get("userId") as string;
    const id = formData.get("id") as string;
    let text = await rejectText(id, userId);
    return redirect(`/reviewer/users/${userId}?session=${session}`);
  }

  if (request.method === "DELETE") {
    const version = formData.get("version") as string;
    let deletedText = await deleteTextByVersion(version);
    return deletedText;
  }

  return null;
};
