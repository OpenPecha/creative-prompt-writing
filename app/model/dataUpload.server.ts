// import { db } from "~/services/db.server";

// export async function uploadData({
//   name,
//   data,
//   groupId,
// }: {
//   name: string[];
//   data: any;
//   groupId: string;
// }) {
//   try {
//     const existingRecord = await db.task.findFirst({
//       where: {
//         version: { in: name },
//       },
//     });
//     if (!!existingRecord) {
//       return { error: "Record already exists" };
//     }

//     const UploadData = data?.map((item) => {
//       return {
//         version: item.version,
//         original_text: item.original_text,
//         audioURL: item.audioURL,
//         groupId: groupId,
//       };
//     });
//     const uploaded = await db.task.createMany({
//       data: UploadData,
//     });
//     return uploaded;
//   } catch (e) {
//     throw new Error("upload failed" + e);
//   }
// }
