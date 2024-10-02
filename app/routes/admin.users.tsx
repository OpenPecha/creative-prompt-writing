import { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "~/components/ui";
import { db } from "~/services/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  let users = await db.user.findMany({
    orderBy: { id: "asc" },
  });
  let url = new URL(request.url);
  let query = url.searchParams;
  let session = query.get("session") as string;
  return { users, session };
};

function User() {
  const { users, session } = useLoaderData();
  const [userList, setUserList] = useState(users);
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    if (inputSearch === "") {
      setUserList(users);
    } else {
      setUserList((p) => {
        return p.filter((user) => user.username?.includes(inputSearch));
      });
    }
  }, [inputSearch]);
  return (
    <div className="flex gap-3 m-2">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <Input
          type="email"
          placeholder="Email"
          className="mb-3"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <CardContent className="grid gap-4 m-0 overflow-scroll">
          {userList.map((user) => (
            <Link
              to={"/admin/users/" + user.id + "?session=" + session}
              key={user.id}
              className="flex items-center gap-4"
            >
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={user.picture} alt="Avatar" />
                <AvatarFallback>{user.nickname}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {user.nickname}
                </p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
              <div className="ml-auto text-xs">{user.role}</div>
            </Link>
          ))}
        </CardContent>
      </Card>
      <Outlet />
    </div>
  );
}

export default User;
