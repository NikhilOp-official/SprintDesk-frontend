import { Formik } from "formik";
import * as Yup from "yup";
import { Layers3 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation } from "@/store/api/auth/mutation";
import type { LoginRequest } from "@/store/api/types";
import { useAppDispatch } from "@/store";
import { loginUser } from "@/store/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginRequest) => {
    try {
      const response = await login({
        email: values?.email,
        password: values?.password,
      }).unwrap();

      dispatch(loginUser(response));
      toast.success("Login successful!");
      navigate("/");
      // console.log("Login successful:", response);
    } catch (error) {
      console.error("Error in Login", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Layers3 className="size-6" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome to SprintDesk
            </CardTitle>
            <CardDescription>
              Sign in to manage your projects and issues.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Formik<LoginRequest>
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.password && errors.password)}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            )}
          </Formik>

          <p className="mt-6 text-center text-xs text-slate-500">
            SprintDesk · Project management made simple
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
