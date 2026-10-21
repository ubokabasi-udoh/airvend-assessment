import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { SideModal } from "@/components/common/side-modal";
import { GET_FUNDING_HISTORY_BY_ID } from "@/api/funding/api";

type ViewFundingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

export default function ViewFundingModal({
  isOpen,
  onClose,
  id,
}: ViewFundingModalProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["funding-history", id],
    queryFn: () => GET_FUNDING_HISTORY_BY_ID({ id }),
    enabled: isOpen && !!id,
  });

  const funding = data?.data;

  const fields = funding
    ? [
        { label: "Funding ID", value: funding.id },
        { label: "Funding type", value: funding.funding_type },
        { label: "Amount", value: funding.amount },
        { label: "Session value", value: funding.session_value },
        { label: "Balance before", value: funding.balance_before },
        { label: "Balance after", value: funding.balance_after },
        {
          label: "Date",
          value: new Date(funding.created_at).toLocaleString(),
        },
        {
          label: "Client",
          value: `${funding.client.user.firstname} ${funding.client.user.lastname}`,
        },
        { label: "Client email", value: funding.client.user.email },
        { label: "Client phone", value: funding.client.phone_number },
        { label: "Business type", value: funding.client.business_type },
        { label: "Client status", value: funding.client.status },
        {
          label: "Client session balance",
          value: funding.client.session_balance.toLocaleString(),
        },
        { label: "Callback URL", value: funding.client.callback_url },
      ]
    : [];

  return (
    <SideModal isOpen={isOpen} onClose={onClose} side="right" width={500}>
      <div className="h-full flex flex-col">
        <div className="border-b px-6 py-5">
          <p className="text-lg lg:text-xl font-semibold">Funding Details</p>

          <p className="text-xs lg:text-sm">
            View this funding transaction and its client.
          </p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto text-sm">
          {isPending ? (
            "Loading..."
          ) : isError || !funding ? (
            "Failed to load funding details."
          ) : (
            fields.map((field) => (
              <div key={field.label} className="relative">
                <label className="input-label">{field.label}</label>

                <Input value={field.value} readOnly className="h-12" />
              </div>
            ))
          )}
        </div>
      </div>
    </SideModal>
  );
}
