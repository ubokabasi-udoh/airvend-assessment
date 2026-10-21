import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircle } from "lucide-react";
import { GET_FUNDING_HISTORY } from "@/api/funding/api";
import SimpleTable from "@/components/common/table";
import { Input } from "@/components/ui/input";
import { PER_PAGE } from "@/constants";
import ViewFundingModal from "./components/view-funding-modal";

const tableHeaders = [
  { key: "id", label: "ID" },
  { key: "client", label: "CLIENT" },
  { key: "fundingType", label: "TYPE" },
  { key: "amount", label: "AMOUNT" },
  { key: "balanceBefore", label: "BALANCE BEFORE" },
  { key: "balanceAfter", label: "BALANCE AFTER" },
  { key: "date", label: "DATE" },
  { key: "action", label: "ACTION" },
] as const;

export default function FundingHistoryPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fundingType, setFundingType] = useState<"" | "manual" | "automatic">("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["funding-history", debouncedSearch, fundingType, currentPage],
    queryFn: () =>
      GET_FUNDING_HISTORY({
        search: debouncedSearch,
        page: currentPage,
        per_page: PER_PAGE,
        funding_type: fundingType || undefined,
      }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load funding history.</div>;
  }

  const items = Array.isArray(data?.data) ? data.data : [];

  const rowList = items.map((item) => ({
    id: item.id,
    client: `${item.client.user.firstname} ${item.client.user.lastname}`,
    fundingType: item.funding_type,
    amount: item.amount,
    balanceBefore: item.balance_before,
    balanceAfter: item.balance_after,
    date: new Date(item.created_at).toLocaleDateString(),
    action: (
      <div
        onClick={() => {
          setSelectedId(String(item.id));
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
      <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-4">
        <Input
          className="h-9 lg:h-12 max-w-[420px] placeholder:text-faded"
          type="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />

        <select
          className="ml-auto h-9 lg:h-12 rounded-md border border-input bg-transparent px-2 lg:px-3 text-xs lg:text-sm outline-none focus:ring-2 focus:ring-ring"
          value={fundingType}
          onChange={(e) => {
            setFundingType(e.target.value as "" | "manual" | "automatic");
            setCurrentPage(1);
          }}
        >
          <option value="">All funding types</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      <SimpleTable
        headers={tableHeaders}
        rowList={rowList}
        pageSize={PER_PAGE}
        total={data?.meta?.total}
        currentPage={currentPage}
        onClick={setCurrentPage}
      />

      <ViewFundingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id={selectedId}
      />
    </>
  );
}
