import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { SideModal } from "@/components/common/side-modal";
import { createUserSchema } from "@/validations/user";
import { CREATE_USER } from "@/api/users/api";
import { getSuccessMessage, getErrorMessage } from "@/utils/api-message";

type CreateUserErrors = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
};

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialState: TCreateUserPayload = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "admin",
};

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TCreateUserPayload>(initialState);

  const [errors, setErrors] = useState<CreateUserErrors>({});

  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (payload: TCreateUserPayload) => CREATE_USER(payload),

    onSuccess: (response) => {
      toast.add({
        title: "User created!",
        description: getSuccessMessage(
          response,
          "The user has been created successfully.",
        ),
        type: "success",
      });

      setFormData({ ...initialState });
      setErrors({});
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },

    onError: (error) => {
      toast.add({
        title: "User creation failed!",
        description: getErrorMessage(
          error,
          "Unable to create user. Please try again.",
        ),
        type: "error",
      });
    },
  });

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = () => {
    const result = createUserSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const nextErrors: CreateUserErrors = {
        firstname: fieldErrors.firstname?.[0],
        lastname: fieldErrors.lastname?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        password_confirmation: fieldErrors.password_confirmation?.[0],
        role: fieldErrors.role?.[0],
      };

      setErrors(nextErrors);

      if (nextErrors.firstname) {
        firstnameRef.current?.focus();
      } else if (nextErrors.lastname) {
        lastnameRef.current?.focus();
      } else if (nextErrors.email) {
        emailRef.current?.focus();
      } else if (nextErrors.password) {
        passwordRef.current?.focus();
      } else if (nextErrors.password_confirmation) {
        passwordConfirmationRef.current?.focus();
      }

      return;
    }

    setErrors({});
    createUserMutation.mutate(formData);
  };

  const handleClose = () => {
    if (createUserMutation.isPending) return;

    setFormData({ ...initialState });
    setErrors({});
    onClose();
  };

  return (
    <SideModal isOpen={isOpen} onClose={handleClose} side="right" width={500}>
      <div className="h-full flex flex-col">
        <div className="border-b px-4 lg:px-6 py-4 lg:py-5">
          <p className="text-lg lg:text-xl font-semibold">Create User</p>
          <p className="text-xs lg:text-sm">
            Add a new team member to the Master Dashboard.
          </p>
        </div>

        <form
          className="p-4 lg:p-6 h-full flex flex-col gap-4 lg:gap-5 overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
          <div className="relative">
            <label className="input-label" htmlFor="firstname">
              First name <span className="text-error">*</span>
            </label>

            <Input
              ref={firstnameRef}
              onChange={handleChange}
              id="firstname"
              name="firstname"
              type="text"
              autoComplete="given-name"
              value={formData.firstname}
              aria-invalid={!!errors.firstname}
              aria-describedby={
                errors.firstname ? "firstname-error" : undefined
              }
            />

            {errors.firstname && (
              <span
                id="firstname-error"
                className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs"
              >
                {errors.firstname}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="lastname">
              Last name <span className="text-error">*</span>
            </label>

            <Input
              ref={lastnameRef}
              onChange={handleChange}
              id="lastname"
              name="lastname"
              type="text"
              autoComplete="family-name"
              value={formData.lastname}
              aria-invalid={!!errors.lastname}
              aria-describedby={errors.lastname ? "lastname-error" : undefined}
            />

            {errors.lastname && (
              <span
                id="lastname-error"
                className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs"
              >
                {errors.lastname}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="email">
              Email <span className="text-error">*</span>
            </label>

            <Input
              ref={emailRef}
              onChange={handleChange}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <span
                id="email-error"
                className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs"
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="password">
              Password <span className="text-error">*</span>
            </label>

            <Input
              ref={passwordRef}
              onChange={handleChange}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />

            {errors.password && (
              <span
                id="password-error"
                className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs"
              >
                {errors.password}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="password_confirmation">
              Confirm password <span className="text-error">*</span>
            </label>

            <Input
              ref={passwordConfirmationRef}
              onChange={handleChange}
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={formData.password_confirmation}
              aria-invalid={!!errors.password_confirmation}
              aria-describedby={
                errors.password_confirmation
                  ? "password-confirmation-error"
                  : undefined
              }
            />

            {errors.password_confirmation && (
              <span
                id="password-confirmation-error"
                className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs"
              >
                {errors.password_confirmation}
              </span>
            )}
          </div>

          <div className="relative">
            <label className="input-label" htmlFor="role">
              Role <span className="text-error">*</span>
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? "role-error" : undefined}
              className="w-full rounded-md border border-input bg-transparent px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm outline-none focus:ring-2 focus:ring-ring h-9 lg:h-12"
            >
              <option value="" disabled>
                Select a role
              </option>

              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            {errors.role && (
              <span
                id="role-error"
                className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs"
              >
                {errors.role}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="mt-auto bg-primary-dark rounded-[10px]"
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending ? "Creating user..." : "Create User"}
          </Button>
        </form>
      </div>
    </SideModal>
  );
}
