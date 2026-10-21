import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle } from "lucide-react";
import { GET_CLIENTS } from "@/api/clients/api";
import SimpleTable from "@/components/common/table";
import { Input } from "@/components/ui/input";
import { PER_PAGE } from "@/constants";
import ClientKeysModal from "./components/client-keys-modal";

const tableHeaders = [
  { key: "id", label: "ID" },
  { key: "owner", label: "OWNER" },
  { key: "businessType", label: "BUSINESS TYPE" },
  { key: "phone", label: "PHONE" },
  { key: "extension", label: "EXTENSION" },
  { key: "status", label: "STATUS" },
  { key: "action", label: "ACTION" },
] as const;

export default function APIManagementPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<TClient | null>(null);

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
    queryKey: ["clients", debouncedSearch, currentPage],
    queryFn: () =>
      GET_CLIENTS({
        search: debouncedSearch,
        page: currentPage,
        per_page: PER_PAGE,
      }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load clients.</div>;
  }

  const rowList = (data?.data ?? []).map((client) => ({
    id: client.id,
    owner: `${client.user.firstname} ${client.user.lastname}`,
    businessType: client.business_type,
    phone: client.phone_number,
    extension: client.extension?.extension ?? "-",
    status: client.status,
    action: (
      <div
        onClick={() => {
          setSelectedClient(client);
          setIsOpen(true);
        }}
        className="cursor-pointer font-medium hover:underline transition-all duration-300 flex items-center gap-2"
      >
        Manage Keys <ArrowRightCircle size={16} />
      </div>
    ),
  }));

  return (
    <>
      <div className="flex items-center mb-4">
        <Input
          className="h-12 max-w-[420px] placeholder:text-faded"
          type="search"
          placeholder="Search clients"
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

      <ClientKeysModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        client={selectedClient}
      />
    </>
  );
}
