import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { SideModal } from "@/components/common/side-modal";
import {
  CREATE_CLIENT_KEY,
  GET_CLIENT_KEYS,
  REVOKE_CLIENT_KEY,
} from "@/api/clients/api";
import { getSuccessMessage, getErrorMessage } from "@/utils/api-message";

type ClientKeysModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: TClient | null;
};

export default function ClientKeysModal({
  isOpen,
  onClose,
  client,
}: ClientKeysModalProps) {
  const queryClient = useQueryClient();
  const uid = client?.uid ?? "";

  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState("live");
  const [nameError, setNameError] = useState("");
  const [revokeId, setRevokeId] = useState<number | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["client-keys", uid],
    queryFn: () => GET_CLIENT_KEYS({ uid }),
    enabled: isOpen && !!uid,
  });

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEnvironment("live");
      setNameError("");
      setRevokeId(null);
    }
  }, [isOpen]);

  const createMutation = useMutation({
    mutationFn: () =>
      CREATE_CLIENT_KEY({ uid, name: name.trim(), environment }),

    onSuccess: (response) => {
      toast.add({
        title: "Key created!",
        description: getSuccessMessage(
          response,
          "The API key has been created successfully.",
        ),
        type: "success",
      });

      setName("");
      queryClient.invalidateQueries({ queryKey: ["client-keys", uid] });
    },

    onError: (error) => {
      toast.add({
        title: "Create failed!",
        description: getErrorMessage(
          error,
          "Unable to create key. Please try again.",
        ),
        type: "error",
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (kid: number) => REVOKE_CLIENT_KEY({ uid, kid: String(kid) }),

    onSuccess: (response) => {
      toast.add({
        title: "Key revoked!",
        description: getSuccessMessage(
          response,
          "The API key has been revoked successfully.",
        ),
        type: "success",
      });

      setRevokeId(null);
      queryClient.invalidateQueries({ queryKey: ["client-keys", uid] });
    },

    onError: (error) => {
      toast.add({
        title: "Revoke failed!",
        description: getErrorMessage(
          error,
          "Unable to revoke key. Please try again.",
        ),
        type: "error",
      });

      setRevokeId(null);
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      setNameError("Key name is required");
      return;
    }

    setNameError("");
    createMutation.mutate();
  };

  const keys = data?.data ?? [];

  return (
    <SideModal isOpen={isOpen} onClose={onClose} side="right" width={500}>
      <div className="h-full flex flex-col">
        <div className="border-b px-4 lg:px-6 py-4 lg:py-5">
          <p className="text-lg lg:text-xl font-semibold">API Keys</p>

          <p className="text-xs lg:text-sm">
            {client
              ? `Manage verify keys for ${client.user.firstname} ${client.user.lastname}.`
              : ""}
          </p>
        </div>

        <div className="p-4 lg:p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
          <div className="relative">
            <label className="input-label" htmlFor="key-name">
              New key name
            </label>

            <div className="flex gap-3">
              <Input
                id="key-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                className="h-9 lg:h-12"
                aria-invalid={!!nameError}
              />

              {/* TODO: environment options other than live are assumed */}
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="rounded-md border border-input bg-transparent px-2 lg:px-3 text-xs lg:text-sm outline-none focus:ring-2 focus:ring-ring h-9 lg:h-12"
              >
                <option value="live">Live</option>
                <option value="test">Test</option>
              </select>

              <Button
                className="h-9 lg:h-12 rounded-[10px] bg-primary-dark px-4 text-xs lg:text-sm"
                disabled={createMutation.isPending}
                onClick={handleCreate}
              >
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>

            {nameError && (
              <span className="text-error text-[10px] lg:text-xs">
                {nameError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {isPending ? (
              <p className="text-sm">Loading keys...</p>
            ) : isError ? (
              <p className="text-sm">Failed to load keys.</p>
            ) : keys.length === 0 ? (
              <p className="text-sm text-faded">No keys yet.</p>
            ) : (
              keys.map((key) => (
                <div
                  key={key.id}
                  className="rounded-lg border p-4 flex flex-col gap-2 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{key.name}</span>

                    <span className="text-xs text-faded">
                      {key.is_active ? "Active" : "Revoked"}
                    </span>
                  </div>

                  <span className="text-xs">
                    {key.key_prefix}••••{key.key_hint} · {key.environment}
                  </span>

                  <span className="text-xs text-faded">
                    Last used:{" "}
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleString()
                      : "Never"}
                  </span>

                  {key.is_active &&
                    (revokeId === key.id ? (
                      <div className="flex gap-3 pt-1">
                        <Button
                          variant="destructive"
                          className="flex-1 rounded-[10px]"
                          disabled={revokeMutation.isPending}
                          onClick={() => revokeMutation.mutate(key.id)}
                        >
                          {revokeMutation.isPending
                            ? "Revoking..."
                            : "Confirm Revoke"}
                        </Button>

                        <Button
                          variant="default"
                          className="flex-1 rounded-[10px]"
                          disabled={revokeMutation.isPending}
                          onClick={() => setRevokeId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="destructive"
                        className="rounded-[10px] mt-1"
                        onClick={() => setRevokeId(key.id)}
                      >
                        Revoke
                      </Button>
                    ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </SideModal>
  );
}
