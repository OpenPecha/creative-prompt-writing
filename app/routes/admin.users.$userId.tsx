import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";
import { db } from "~/services/db.server";
import { Role } from "@prisma/client";
import { getGroupList } from "~/model/group.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = params.userId;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      activate: true,
      reviewer_user: true,
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const reviewerList = await db.user.findMany({
    where: {
      role: "REVIEWER",
    },
    select: {
      username: true,
      id: true,
    },
  });
  const groups = await getGroupList();
  return { user, reviewerList, groups };
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = params.userId;
  const formData = await request.formData();
  const checked = formData.get("checked") === "true" ? true : false;
  const role = formData.get("role") as Role;
  const reviewerId = formData.get("reviewerId") as Role;
  const groupId = formData.get("groupId") as string;

  if (reviewerId) {
    await db.user.update({
      where: { id: userId },
      data: {
        reviewerUserId: reviewerId,
      },
    });
  }

  if (formData.get("checked")) {
    await db.user.update({
      where: { id: userId },
      data: {
        activate: checked,
      },
    });
  }
  if (role) {
    await db.user.update({
      where: { id: userId },
      data: {
        role: role,
      },
    });
  }
  if (groupId) {
    await db.user.update({
      where: { id: userId },
      data: {
        groupId: groupId,
      },
    });
  }
  return json({ success: true });
};

function User() {
  const { user, reviewerList, groups } = useLoaderData();
  const fetcher = useFetcher();
  const checked = user.activate === true ? true : false;
  const handleCheckChange = (checked: boolean) => {
    fetcher.submit(
      {
        checked,
      },
      {
        method: "POST",
      }
    );
  };

  const handleRoleChange = (role: string) => {
    fetcher.submit(
      {
        role,
      },
      {
        method: "POST",
      }
    );
  };

  const handleReviewerChange = (reviewerId: string) => {
    fetcher.submit(
      {
        reviewerId,
      },
      {
        method: "POST",
      }
    );
  };

  const handleGroupChange = (groupId: string) => {
    fetcher.submit(
      {
        groupId,
      },
      {
        method: "POST",
      }
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{user.username}</CardTitle>
        <CardDescription>{user.role}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div>
          Activate:{" "}
          <Switch checked={checked} onCheckedChange={handleCheckChange} />
        </div>
        <div className="flex gap-2 items-center">
          Role:{" "}
          <Select onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={user.role} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="ANNOTATOR">ANNOTATOR</SelectItem>
              <SelectItem value="REVIEWER">REVIEWER</SelectItem>
              <SelectItem value="USER">USER</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(user?.role === "ANNOTATOR" || user?.role === "REVIEWER") && (
          <div className="flex gap-2 items-center">
            Group:
            <Select onValueChange={handleGroupChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={user.group?.name ?? "select group"} />
              </SelectTrigger>
              <SelectContent>
                {groups?.map((group) => {
                  return (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        {user?.role === "ANNOTATOR" && (
          <div className="flex gap-2 items-center">
            Reviewer :{" "}
            <Select onValueChange={handleReviewerChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    user.reviewer_user?.username ?? "select one reviewer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {reviewerList?.map((reviewer) => {
                  return (
                    <SelectItem key={reviewer.id} value={reviewer.id}>
                      {reviewer.username}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default User;
