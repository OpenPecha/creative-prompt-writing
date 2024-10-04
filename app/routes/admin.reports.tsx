import WorkGraph from "./admin/component/Chart";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserChart from "./admin/component/UserChart";
import { db } from "~/services/db.server";
import { DatePickerWithRange } from "./admin/component/DateRangePicker";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { calculatePay } from "~/lib/utility";
import { getUsersWorkReport } from "~/model/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  // get the from and to date from the query params
  const url = new URL(request.url);
  const query = url.searchParams;
  const from = query.get("from");
  const to = query.get("to");

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0); // Set to start of the day
  }

  if (toDate) {
    toDate.setHours(23, 59, 59, 999); // Set to end of the day
  }
  const date = { from: fromDate, to: toDate };

  const counts = await db.task.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
    where: {
      status: {
        in: ["REVIEWED", "ANNOTATED", "PENDING"],
      },
    },
  });

  // query for groupwise count of reviewed, moderated and pending tasks
  const groupData = await db.task.groupBy({
    by: ["groupId", "status"],
    _count: {
      status: true,
    },
    where: {
      status: {
        in: ["REVIEWED", "ANNOTATED", "PENDING"],
      },
    },
  });

  // Fetch all group ids
  const groupIds = new Set(groupData.map((item) => item.groupId));

  const groups = await db.group.findMany({
    where: {
      id: {
        in: Array.from(groupIds),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const groupMap = new Map(groups.map((group) => [group.id, group.name]));

  const groupCounts = new Map();

  // Populate the groupCounts map with data from the grouped result
  groupData.forEach(({ groupId, status, _count }) => {
    if (!groupCounts.has(groupId)) {
      groupCounts.set(groupId, {
        groupId,
        pending: 0,
        modified: 0,
        reviewed: 0,
      });
    }

    if (status === "PENDING") {
      groupCounts.get(groupId).pending = _count.status;
    } else if (status === "ANNOTATED") {
      groupCounts.get(groupId).modified = _count.status;
    } else if (status === "REVIEWED") {
      groupCounts.get(groupId).reviewed = _count.status;
    }
  });

  // Convert the map to an array of objects
  const groupsStats = Array.from(groupCounts.values()).map((group) => ({
    name: groupMap.get(group.groupId),
    ...group,
  }));

  const totalreviewedCount =
    counts.find((c) => c.status === "REVIEWED")?._count.status || 0;
  const totalmodifiedCount =
    counts.find((c) => c.status === "ANNOTATED")?._count.status || 0;
  const totalpendingCount =
    counts.find((c) => c.status === "PENDING")?._count.status || 0;

  const reviewedCount = await db.task.groupBy({
    by: ["annotated_by_id"],
    _count: {
      reviewed_prompt: true,
    },
    where: {
      annotated_by_id: {
        not: null,
      },
      reviewed_prompt: {
        not: null,
      },
      ...(fromDate &&
        toDate && {
          annotatedAt: {
            gte: new Date(fromDate),
            lte: new Date(toDate),
          },
        }),
    },
  });

  // Count of modified texts where reviewed_text is null
  const modifiedCount = await db.task.groupBy({
    by: ["annotated_by_id"],
    _count: {
      annotated_prompt: true,
    },
    where: {
      annotated_by_id: {
        not: null,
      },
      reviewed_prompt: null,
      status: "ANNOTATED",
      ...(fromDate &&
        toDate && {
          annotatedAt: {
            gte: new Date(fromDate),
            lte: new Date(toDate),
          },
        }),
    },
  });

  // Fetch user details
  const userIds = new Set([
    ...reviewedCount.map((item) => item.annotated_by_id),
    ...modifiedCount.map((item) => item.annotated_by_id),
  ]);

  const users = await db.user.findMany({
    where: {
      id: { in: Array.from(userIds) },
    },
    select: {
      id: true,
      username: true,
    },
  });

  const userMap = new Map(users.map((user) => [user.id, user.username]));

  const userCounts = new Map();

  reviewedCount.forEach(({ annotated_by_id, _count }) => {
    if (!userCounts.has(annotated_by_id)) {
      userCounts.set(annotated_by_id, { reviewed_count: 0, modified_count: 0 });
    }
    userCounts.get(annotated_by_id).reviewed_count = _count.reviewed_prompt;
  });

  modifiedCount.forEach(({ annotated_by_id, _count }) => {
    if (!userCounts.has(annotated_by_id)) {
      userCounts.set(annotated_by_id, { reviewed_count: 0, modified_count: 0 });
    }
    userCounts.get(annotated_by_id).modified_count = _count.annotated_prompt;
  });

  const usersWithCounts = Array.from(userCounts.entries()).map(
    ([id, counts]) => ({
      username: userMap.get(id),
      ...counts,
    })
  );

  // report for reviewers
  const reviewedCountForReviewers = await db.task.groupBy({
    by: ["reviewed_by_id"],
    _count: {
      reviewed_prompt: true,
    },
    where: {
      reviewed_by_id: {
        not: null,
      },
      reviewed_prompt: {
        not: null,
      },
      ...(fromDate &&
        toDate && {
          updatedAt: {
            gte: new Date(fromDate),
            lte: new Date(toDate),
          },
        }),
    },
  });

  const reviewedByUserIds = new Set(
    reviewedCountForReviewers.map((item) => item.reviewed_by_id)
  );
  const reviewers = await db.user.findMany({
    where: {
      id: { in: Array.from(reviewedByUserIds) },
    },
    select: {
      id: true,
      username: true,
    },
  });

  const reviewerMap = new Map(
    reviewers.map((user) => [user.id, user.username])
  );

  const reviewerCounts = new Map();

  reviewedCountForReviewers.forEach(({ reviewed_by_id, _count }) => {
    if (!reviewerCounts.has(reviewed_by_id)) {
      reviewerCounts.set(reviewed_by_id, { reviewed_count: 0 });
    }
    reviewerCounts.get(reviewed_by_id).reviewed_count = _count.reviewed_prompt;
  });

  const reviewersWithCounts = Array.from(reviewerCounts.entries()).map(
    ([id, counts]) => ({
      username: reviewerMap.get(id),
      ...counts,
    })
  );

  // get all annotators and reviewers
  const appUsers = await db.user.findMany({
    where: {
      role: {
        in: ["ANNOTATOR", "REVIEWER"],
      },
    },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });

  const workReport = await Promise.all(
    appUsers.map(async (user) => getUsersWorkReport(user, fromDate, toDate))
  );

  // Convert the map to an array
  return {
    totalpendingCount,
    totalmodifiedCount,
    totalreviewedCount,
    usersWithCounts,
    reviewersWithCounts,
    groupsStats,
    date,
    workReport,
  };
};

function Report() {
  const {
    totalpendingCount,
    totalmodifiedCount,
    totalreviewedCount,
    usersWithCounts,
    reviewersWithCounts,
    groupsStats,
    date,
    workReport,
  } = useLoaderData();

  return (
    <div className="max-w-fit mx-auto">
      <DatePickerWithRange className="flex justify-center" dateRange={date} />
      <div className="flex flex-1 flex-col md:flex-row p-4 mt-4">
        <WorkGraph
          name="Total Work"
          pendingCount={totalpendingCount}
          reviewedCount={totalreviewedCount}
          modifiedCount={totalmodifiedCount}
        />
        {groupsStats.map((group) => (
          <WorkGraph
            key={group.name}
            name={group.name}
            pendingCount={group.pending}
            reviewedCount={group.reviewed}
            modifiedCount={group.modified}
          />
        ))}
      </div>
      <h2 className="text-center border-b text-xl font-semibold tracking-tight transition-colors first:mt-0">
        TOTAL WORK FROM EACH ANNOTATOR
      </h2>
      <div className="flex flex-1 flex-col md:flex-row p-4">
        <div className="flex flex-wrap gap-2">
          {usersWithCounts.map((user) => (
            <UserChart
              key={user.id}
              username={user.username}
              modifiedCount={user.modified_count}
              reviewedCount={user.reviewed_count}
            />
          ))}
        </div>
      </div>
      <h2 className="text-center border-b text-xl font-semibold tracking-tight transition-colors first:mt-0">
        TOTAL WORK FROM EACH REVIEWER
      </h2>
      <div className="flex flex-1 flex-col md:flex-row p-4">
        <div className="flex flex-wrap gap-2">
          {reviewersWithCounts.map((user) => (
            <UserChart
              key={user.id}
              username={user.username}
              modifiedCount={0}
              reviewedCount={user.reviewed_count}
            />
          ))}
        </div>
      </div>
      <h2 className="text-center border-b text-xl font-semibold tracking-tight uppercase">
        Users Work Report
      </h2>
      <div className="max-w-4xl mx-auto rounded-lg border bg-slate-300 text-card-foreground shadow-md my-5">
        <Table className="w-full p-4">
          <TableCaption>List of user stats</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-auto">Username</TableHead>
              <TableHead className="w-auto">Role</TableHead>
              <TableHead className="w-auto">Syllabel Count</TableHead>
              <TableHead className="w-auto text-right">Amount (Rs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workReport.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.username}</TableCell>
                <TableCell>{report.role}</TableCell>
                <TableCell>{report.syllableCount}</TableCell>
                <TableCell className="text-right">
                  {calculatePay(report.syllableCount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {workReport.reduce(
                  (acc, report) => acc + calculatePay(report.syllableCount),
                  0
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export default Report;
