import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import AuthCard from "../components/shop/AuthCard";
import { useRegisterMutation } from "../store/usersApi";
import { setCredentials } from "../store/authSlice";
import { useRedirectParam } from "../hooks/useRedirectParam";
import { errMsg } from "../lib/format";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.userInfo);
  const redirect = useRedirectParam();
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");
    setError("");
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Account created. Welcome to Tune Shed!");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <>
      <title>Create account — Tune Shed Music</title>
      <AuthCard
        title="Create an account"
        subtitle="Check out faster and keep track of your orders."
        footer={
          <>
            Already have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </>
        }>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Name">
            <input className="field" autoComplete="name" required value={form.name} onChange={update("name")} />
          </Field>
          <Field label="Email">
            <input type="email" className="field" autoComplete="email" required value={form.email} onChange={update("email")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Password" hint="At least 8 characters">
              <input type="password" className="field" autoComplete="new-password" required value={form.password} onChange={update("password")} />
            </Field>
            <Field label="Confirm password">
              <input type="password" className="field" autoComplete="new-password" required value={form.confirm} onChange={update("confirm")} />
            </Field>
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="rounded-full" loading={isLoading}>
            Create account
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
