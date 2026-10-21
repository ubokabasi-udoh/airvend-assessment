import { useMutation } from "@tanstack/react-query";
import { LOGIN } from "@/api/auth/api";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { loginSchema } from "@/validations/login";
import { toast } from "@/components/ui/toast";
import { useUserStore } from "@/store/user";
import { AirvendLogo } from "@/assets/logo";
import { getErrorMessage } from "@/utils/api-message";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function SignInPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const initialState: TLoginPayload = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<LoginErrors>({});

  const loginMutation = useMutation({
    mutationFn: LOGIN,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard");
    },
    onError(error) {
      toast.add({
        title: "Sign in failed!",
        description: getErrorMessage(error, "Invalid Credentials"),
        type: "error",
      });
    },
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const nextErrors: LoginErrors = {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      };

      setErrors(nextErrors);

      if (nextErrors.email) {
        emailRef.current?.focus();
      } else if (nextErrors.password) {
        passwordRef.current?.focus();
      }

      return;
    }

    setErrors({});
    loginMutation.mutate(result.data);
  };

  return (
    <div className="bg-primary-dark h-dvh flex flex-col items-center justify-center">
      <AirvendLogo className="mb-8 lg:mb-12" type="white" />

      <div className="bg-white w-[80%] sm:w-full max-w-[350px] sm:max-w-[450px] lg:max-w-[524px] p-6 lg:p-12 pb-6 lg:pb-8 rounded-2xl mx-[8%]">
        <div className="w-full text-center pb-4">
          <p className="text-lg lg:text-xl font-semibold">Master Dashboard</p>
          <p className="text-xs lg:text-sm">
            Internal access only. Sign in with your team account.
          </p>
        </div>

        <form
          className="pt-6 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
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
              value={formData.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            {errors.email && (
              <span className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs">
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
              type="password"
              id="password"
              name="password"
              value={formData.password}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />

            {errors.password && (
              <span className="absolute block -bottom-4.5 text-error text-[10px] lg:text-xs">
                {errors.password}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="my-4 lg:my-6"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-[10px] lg:text-xs text-center">
            Need access? Ask a team administrator for an invite link.
          </p>
        </form>
      </div>
    </div>
  );
}
