import { Link, useLoaderData } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "~/components/ui";

function UserList({ close }) {
  const { user, session } = useLoaderData();
  return (
    <div className="flex flex-col gap-4 mt-9">
      {user.reviewedUsers?.map((user) => (
        <Link
          to={"/reviewer/users/" + user.id + "?session=" + session}
          key={user.id}
          className="flex items-center gap-4"
          onClick={close}
        >
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={user.picture} alt="Avatar" />
            <AvatarFallback>{user.nickname}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none flex gap-2 items-center">
              {user.nickname}
              <Badge variant="outline">{user._count.modified}</Badge>
            </p>
            <p className="text-sm text-muted-foreground">{user.username}</p>
          </div>
          <div className="ml-auto text-xs">{user.role}</div>
        </Link>
      ))}
    </div>
  );
}

export default UserList;
