import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { SideModal } from "@/components/common/side-modal";
import { GET_USER, UPDATE_USER, DELETE_USER } from "@/api/users/api";

type ViewUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  onSuccess?: () => void;
};

type UserErrors = {
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: string;
};

export default function ViewUserModal({
  isOpen,
  onClose,
  uid,
  onSuccess,
}: ViewUserModalProps) {
  const queryClient = useQueryClient();

  const { data: user, isPending: isLoadingUser } = useQuery({
    queryKey: ["user", uid],
    queryFn: () => GET_USER({ uid }),
    enabled: isOpen && !!uid,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<UserErrors>({});
  const [formData, setFormData] = useState<TEditUserPayload>({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    uid,
  });

  const getInitialFormData = (user: TUserDetails): TEditUserPayload => ({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.roles?.[0] ?? "",
    uid: user.uid || "",
  });

  useEffect(() => {
    if (user?.data) {
      setFormData(getInitialFormData(user.data));
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setConfirmDelete(false);
      setErrors({});
    }
  }, [isOpen]);

  const updateMutation = useMutation({
    mutationFn: (payload: TEditUserPayload) => UPDATE_USER(payload),

    onSuccess: () => {
      toast.add({
        title: "User updated!",
        description: "User details have been updated successfully.",
        type: "success",
      });

      setIsEditing(false);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ["user", uid] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },

    onError: () => {
      toast.add({
        title: "Update failed!",
        description: "Unable to update user. Please try again.",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => DELETE_USER({ uid }),

    onSuccess: () => {
      toast.add({
        title: "User deleted!",
        description: "The user has been deleted successfully.",
        type: "success",
      });

      setConfirmDelete(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["user", uid] });
      onClose();
      onSuccess?.();
    },

    onError: () => {
      toast.add({
        title: "Delete failed!",
        description: "Unable to delete user. Please try again.",
        type: "error",
      });

      setConfirmDelete(false);
    },
  });

  if (!isOpen) return null;

  const userData = user?.data;
  const isPending = updateMutation.isPending || deleteMutation.isPending;

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  };

  const handleEdit = () => {
    if (isEditing) {
      const nextErrors: UserErrors = {};

      if (!formData.firstname.trim()) {
        nextErrors.firstname = "First name is required";
      }

      if (!formData.lastname.trim()) {
        nextErrors.lastname = "Last name is required";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Enter a valid email address";
      }

      if (!formData.role) {
        nextErrors.role = "Please select a role";
      }

      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) return;

      updateMutation.mutate(formData);
      return;
    }

    if (userData) setFormData(getInitialFormData(userData));
    setErrors({});
    setIsEditing(true);
    setConfirmDelete(false);
  };

  const handleCancelEdit = () => {
    if (userData) setFormData(getInitialFormData(userData));
    setErrors({});
    setIsEditing(false);
  };

  const handleClose = () => {
    if (isPending) return;

    setIsEditing(false);
    setConfirmDelete(false);
    setErrors({});
    onClose();
  };

  const inputClassName = "h-12";

  return (
    <SideModal isOpen={isOpen} onClose={handleClose} side="right" width={500}>
      {isLoadingUser || !userData ? (
        <div className="p-6 text-sm">Loading user...</div>
      ) : (
      <div className="h-full flex flex-col">
        <div className="border-b px-6 py-5">
          <p className="text-lg lg:text-xl font-semibold">User Details</p>

          <p className="text-xs lg:text-sm">
            View and manage this team member's account.
          </p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto">
          <div className="relative">
            <label className="input-label" htmlFor="firstname">
              First name
            </label>

            <Input
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              readOnly={!isEditing}
              className={inputClassName}
              aria-invalid={!!errors.firstname}
            />

            {errors.firstname && (
              <span className="text-error text-[10px] lg:text-xs">
                {errors.firstname}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="lastname">
              Last name
            </label>

            <Input
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              readOnly={!isEditing}
              className={inputClassName}
              aria-invalid={!!errors.lastname}
            />

            {errors.lastname && (
              <span className="text-error text-[10px] lg:text-xs">
                {errors.lastname}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="email">
              Email
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={inputClassName}
              aria-invalid={!!errors.email}
            />

            {errors.email && (
              <span className="text-error text-[10px] lg:text-xs">
                {errors.email}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring h-12 disabled:opacity-70"
              aria-invalid={!!errors.role}
            >
              <option value="" disabled>
                Select a role
              </option>

              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            {errors.role && (
              <span className="text-error text-[10px] lg:text-xs">
                {errors.role}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="uid">
              User ID
            </label>

            <Input
              id="uid"
              value={userData?.uid}
              readOnly
              className={inputClassName}
            />
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="created_at">
              Date created
            </label>

            <Input
              id="created_at"
              value={new Date(userData?.created_at ?? "").toLocaleString()}
              readOnly
              className={inputClassName}
            />
          </div>

          <div className="mt-auto pt-6">
            {confirmDelete ? (
              <div className="flex flex-col gap-3">
                <Button
                  variant="destructive"
                  className="w-full rounded-[10px]"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate()}
                >
                  {deleteMutation.isPending
                    ? "Deleting user..."
                    : "Click again to Confirm Delete"}
                </Button>

                <Button
                  variant="default"
                  className="w-full rounded-[10px]"
                  disabled={isPending}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant="default"
                  className="flex-1 rounded-[10px]"
                  disabled={isPending}
                  onClick={handleEdit}
                >
                  {updateMutation.isPending
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Edit"}
                </Button>

                {isEditing ? (
                  <Button
                    variant="destructive"
                    className="flex-1 rounded-[10px]"
                    disabled={isPending}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="flex-1 rounded-[10px]"
                    disabled={isPending}
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </SideModal>
  );
}
