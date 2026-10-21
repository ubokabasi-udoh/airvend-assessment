import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle } from "lucide-react";
import { GET_EXTENSIONS } from "@/api/extensions/api";
import SimpleTable from "@/components/common/table";
import { Input } from "@/components/ui/input";
import { PER_PAGE } from "@/constants";
import ViewExtensionModal from "./components/view-extension-modal";

const tableHeaders = [
  { key: "id", label: "ID" },
  { key: "extension", label: "EXTENSION" },
  { key: "type", label: "TYPE" },
  { key: "status", label: "STATUS" },
  { key: "client", label: "ASSIGNED TO" },
  { key: "date", label: "DATE ADDED" },
  { key: "action", label: "ACTION" },
] as const;

export default function USSDExtensionPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUid, setSelectedUid] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["extensions", debouncedSearch, currentPage],
    queryFn: () =>
      GET_EXTENSIONS({
        search: debouncedSearch,
        page: currentPage,
        per_page: PER_PAGE,
      }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load extensions.</div>;
  }

  const rowList = (data?.data ?? []).map((item) => ({
    id: item.id,
    extension: item.extension,
    type: item.extension_type,
    status: item.status,
    client: item.client
      ? `${item.client.user.firstname} ${item.client.user.lastname}`
      : "Unassigned",
    date: new Date(item.created_at).toLocaleDateString(),
    action: (
      <div
        onClick={() => {
          setSelectedUid(item.uid);
          setIsOpen(true);
        }}
        className="cursor-pointer font-medium hover:underline transition-all duration-300 flex items-center gap-2"
      >
        View Details <ArrowRightCircle size={16} />
      </div>
    ),
  }));

  return (
    <>
      <div className="flex items-center mb-4">
        <Input
          className="h-12 max-w-[420px] placeholder:text-faded"
          type="search"
          placeholder="Search extensions"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>

      <SimpleTable
        headers={tableHeaders}
        rowList={rowList}
        pageSize={PER_PAGE}
        total={data?.meta?.total}
        currentPage={currentPage}
        onClick={setCurrentPage}
      />

      <ViewExtensionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        uuid={selectedUid}
      />
    </>
  );
}
