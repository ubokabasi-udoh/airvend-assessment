import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { SideModal } from "@/components/common/side-modal";
import { GET_EXTENSION, UPDATE_EXTENSION } from "@/api/extensions/api";
import { getSuccessMessage, getErrorMessage } from "@/utils/api-message";

type ViewExtensionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  uuid: string;
};

export default function ViewExtensionModal({
  isOpen,
  onClose,
  uuid,
}: ViewExtensionModalProps) {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TEditExtensionPayload>({
    uuid,
    extension_type: "",
    status: "",
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["extension", uuid],
    queryFn: () => GET_EXTENSION({ uuid }),
    enabled: isOpen && !!uuid,
  });

  const extension = data?.data;

  useEffect(() => {
    if (extension) {
      setFormData({
        uuid,
        extension_type: extension.extension_type,
        status: extension.status,
      });
    }
  }, [extension, uuid]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const updateMutation = useMutation({
    mutationFn: (payload: TEditExtensionPayload) => UPDATE_EXTENSION(payload),

    onSuccess: (response) => {
      toast.add({
        title: "Extension updated!",
        description: getSuccessMessage(
          response,
          "Extension details have been updated successfully.",
        ),
        type: "success",
      });

      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["extension", uuid] });
      queryClient.invalidateQueries({ queryKey: ["extensions"] });
    },

    onError: (error) => {
      toast.add({
        title: "Update failed!",
        description: getErrorMessage(
          error,
          "Unable to update extension. Please try again.",
        ),
        type: "error",
      });
    },
  });

  const resetForm = () => {
    if (extension) {
      setFormData({
        uuid,
        extension_type: extension.extension_type,
        status: extension.status,
      });
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      updateMutation.mutate(formData);
      return;
    }

    resetForm();
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const readOnlyFields = extension
    ? [
        { label: "Extension", value: extension.extension },
        { label: "Extension ID", value: extension.uid },
        {
          label: "Assigned to",
          value: extension.client
            ? `${extension.client.user.firstname} ${extension.client.user.lastname}`
            : "Unassigned",
        },
        {
          label: "Date created",
          value: new Date(extension.created_at).toLocaleString(),
        },
      ]
    : [];

  return (
    <SideModal
      isOpen={isOpen}
      onClose={() => {
        if (!updateMutation.isPending) onClose();
      }}
      side="right"
      width={500}
    >
      <div className="h-full flex flex-col">
        <div className="border-b px-4 lg:px-6 py-4 lg:py-5">
          <p className="text-lg lg:text-xl font-semibold">Extension Details</p>

          <p className="text-xs lg:text-sm">
            View and manage this USSD extension.
          </p>
        </div>

        <div className="p-4 lg:p-6 flex-1 flex flex-col gap-4 lg:gap-5 overflow-y-auto text-sm">
          {isPending ? (
            "Loading..."
          ) : isError || !extension ? (
            "Failed to load extension."
          ) : (
            <>
              <div className="relative">
                <label className="input-label" htmlFor="extension_type">
                  Type
                </label>

                <select
                  id="extension_type"
                  value={formData.extension_type}
                  onChange={(e) =>
                    setFormData((previous) => ({
                      ...previous,
                      extension_type: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-md border border-input bg-transparent px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm outline-none focus:ring-2 focus:ring-ring h-9 lg:h-12 disabled:opacity-70"
                >
                  <option value="INTERNAL">Internal</option>
                  <option value="EXTERNAL">External</option>
                </select>
              </div>

              <div className="relative">
                <label className="input-label" htmlFor="status">
                  Status
                </label>

                {/* TODO: allowed status values are assumed */}
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((previous) => ({
                      ...previous,
                      status: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-md border border-input bg-transparent px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm outline-none focus:ring-2 focus:ring-ring h-9 lg:h-12 disabled:opacity-70"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {readOnlyFields.map((field) => (
                <div key={field.label} className="relative">
                  <label className="input-label">{field.label}</label>

                  <Input value={field.value} readOnly className="h-9 lg:h-12" />
                </div>
              ))}

              <div className="mt-auto pt-6 flex gap-4">
                <Button
                  variant="default"
                  className="flex-1 rounded-[10px]"
                  disabled={updateMutation.isPending}
                  onClick={handleEdit}
                >
                  {updateMutation.isPending
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Edit"}
                </Button>

                {isEditing && (
                  <Button
                    variant="destructive"
                    className="flex-1 rounded-[10px]"
                    disabled={updateMutation.isPending}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </SideModal>
  );
}
