import { GET_USERS } from "@/api/users/api";
import SimpleTable from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CreateUserModal from "./components/create-user-modal";
import { ArrowRightCircle } from "lucide-react";
import ViewUserModal from "./components/view-user-modal";

const tableHeaders = [
  { key: "id", label: "ID" },
  { key: "fullName", label: "FULL NAME" },
  { key: "email", label: "EMAIL" },
  { key: "dateAdded", label: "DATE ADDED" },
  { key: "action", label: "ACTION" },
] as const;

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState<'create'|'view'|null>(null);

  const [selectedUID, setSelectedUID] = useState<string>("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => GET_USERS({ search: debouncedSearch }),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load users.</div>;
  }

  const users = data?.data ?? [];

  const rowList = users.map((user) => ({
    id: user.id,
    fullName: `${user.firstname} ${user.lastname}`,
    email: user.email,
    dateAdded: new Date(user.created_at).toLocaleDateString(),
    action: (
      <div
        onClick={() => {
          setSelectedUID(user.uid);
          setIsOpen("view");
        }}
        className="cursor-pointer font-medium hover:underline transition-all duration-300 flex items-center gap-2"
      >
        View Details <ArrowRightCircle size={16} />
      </div>
    ),
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          className="h-12 max-w-[420px] placeholder:text-faded"
          type="search"
          placeholder="Search name, email"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />

        <Button
          variant="outline"
          className="!h-12 text-base rounded-lg font-normal px-7"
          onClick={() => setIsOpen('create')}
        >
          Add User
        </Button>
      </div>

      <SimpleTable headers={tableHeaders} rowList={rowList} pageSize={10} />

      <CreateUserModal isOpen={isOpen=='create'} onClose={() => setIsOpen(null)} />
        <ViewUserModal isOpen={isOpen=='view'} onClose={()=>setIsOpen(null)} uid={selectedUID} />
    </>
  );
}
