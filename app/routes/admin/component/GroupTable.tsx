import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "~/components/ui";

function GroupTable({ groups }) {
  const sumUser = groups.reduce((acc, group) => acc + group.userCount, 0);
  const sumText = groups.reduce((acc, group) => acc + group.taskCount, 0);

  return (
    <Table>
      <TableCaption>List of all the groups.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Total User</TableHead>
          <TableHead>Total Text</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow key={group.id}>
            <TableCell className="fontmedium">{group.name}</TableCell>
            <TableCell>{group.userCount}</TableCell>
            <TableCell>{group.taskCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{sumUser}</TableCell>
          <TableCell>{sumText}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default GroupTable;
