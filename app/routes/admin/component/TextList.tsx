import { useFetcher, useLoaderData } from "@remix-run/react";
import React, { useEffect } from "react";
import { BiSolidCloudDownload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { downloadJsonlFile } from "~/lib/downloadfile";
import Pagination from "~/local_component/Pagination";
import Progress from "~/local_component/Progress";
type Text_Props = {
  version: string;
  category: string;
  count: number;
  completed_count: number;
};

function TextList() {
  const { texts } = useLoaderData();
  return (
    <div className="">
      {texts.map((text: Text_Props) => {
        return <Text_Category text={text} key={text.version} />;
      })}
      <PaginationContainer />
    </div>
  );
}

function Text_Category({ text }: { text: Text_Props }) {
  const [open, setOpen] = React.useState<null | boolean>(false);
  const infoFetcher = useFetcher();

  function getInfo() {
    infoFetcher.submit(
      {
        _action: "get_info",
        version: text.version,
      },
      {
        method: "POST",
      }
    );
  }
  return (
    <form className=" flex w-full px-2 justify-between mt-2">
      <div className="flex items-center gap-2">
        <h4 className=" font-bold text-sm cursor-pointer" onClick={getInfo}>
          {text.version}{" "}
          {infoFetcher.state !== "idle" ? (
            <span className="animate-pulse">...</span>
          ) : null}
          {infoFetcher?.data && (
            <Progress
              current={infoFetcher?.data?.reviewed}
              max={infoFetcher?.data?.total}
              showHeader={false}
              accepted={infoFetcher?.data?.accepted_count}
            />
          )}
        </h4>
      </div>
      <input hidden name="_action" readOnly value="change_category"></input>

      <div className="relative dropdown dropdown-hover dropdown-left">
        <label className="m-1" onClick={() => setOpen(!open)}>
          <SlOptionsVertical />
        </label>
        {open && <TextSettings text={text} />}
      </div>
    </form>
  );
}

function TextSettings({ text }: { text: Text_Props }) {
  const download_fetcher = useFetcher();

  const fetcher = useFetcher();

  function handleDownload() {
    download_fetcher.load(`/api/text/${text.version}`);
  }
  function handleDelete() {
    fetcher.submit(
      {
        version: text.version,
      },
      {
        method: "DELETE",
        action: "/api/text",
      }
    );
  }
  useEffect(() => {
    if (download_fetcher.data) {
      downloadJsonlFile(fetcher.data, text.version);
    }
  }, [download_fetcher.data]);
  return (
    <ul className="dropdown-content z-[1] bg-white rounded-md menu p-2 absolute right-0 shadow bg-base-100 rounded-box w-52">
      <li>
        <button
          onClick={handleDownload}
          className="flex gap-2 items-center cursor-pointer hover:bg-green-300 px-2 rounded"
          type="button"
        >
          <BiSolidCloudDownload />
          Download
        </button>
      </li>
      <li>
        <button
          onClick={handleDelete}
          type="button"
          className="flex gap-2 items-center cursor-pointer hover:bg-red-300 px-2 rounded"
        >
          <MdDelete />
          Delete
        </button>
      </li>
    </ul>
  );
}

function PaginationContainer() {
  let { count, texts } = useLoaderData();
  const PER_PAGE = 10;
  const finalPage = Math.ceil(count / PER_PAGE);

  return (
    <div className="flex flex-col items-center ">
      <Pagination
        totalPages={finalPage}
        pageParam="page"
        className="w-full mt-3"
      />
      <span>
        displaying {texts.length} item(s) of {count}
      </span>
    </div>
  );
}

export default TextList;
