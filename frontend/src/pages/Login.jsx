import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ShieldCheck, ShoppingBag } from "lucide-react";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import AuthCard from "../components/shop/AuthCard";
import { useLoginMutation } from "../store/usersApi";
import { setCredentials } from "../store/authSlice";
import { useRedirectParam } from "../hooks/useRedirectParam";
import { errMsg } from "../lib/format";

const DEMO_PASSWORD = "tuneshed-demo";
const DEMOS = [
  { email: "demo@tuneshed.com", label: "Demo shopper", icon: ShoppingBag, hint: "Browse, check out, see orders" },
  { email: "demo-admin@tuneshed.com", label: "Demo admin", icon: ShieldCheck, hint: "Tour the admin area (read-only)" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.userInfo);
  const redirect = useRedirectParam();
  const [login, { isLoading, originalArgs }] = useLoginMutation();

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  async function signIn(credentials) {
    try {
      const res = await login(credentials).unwrap();
      dispatch(setCredentials(res));
      toast.success(`Welcome back, ${res.name.split(" ")[0]}!`);
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <>
      <title>Sign in — Tune Shed Music</title>
      <AuthCard
        title="Sign in"
        subtitle="Good to see you again."
        footer={
          <>
            New to Tune Shed?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-accent hover:underline">
              Create an account
            </Link>
          </>
        }>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn({ email, password });
          }}
          className="flex flex-col gap-4">
          <Field label="Email">
            <input type="email" className="field" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <input
              type="password"
              className="field"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" size="lg" className="rounded-full" loading={isLoading && originalArgs?.email === email}>
            Sign in
          </Button>
        </form>

        <div className="mt-8">
          <p className="flex items-center gap-3 text-xs font-semibold tracking-wider text-subtle uppercase">
            <span className="h-px flex-1 bg-border" /> Or take a demo for a spin <span className="h-px flex-1 bg-border" />
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEMOS.map(({ email: demoEmail, label, icon: Icon, hint }) => (
              <button
                key={demoEmail}
                type="button"
                disabled={isLoading}
                onClick={() => signIn({ email: demoEmail, password: DEMO_PASSWORD })}
                className="flex items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-accent hover:bg-accent-soft disabled:opacity-60">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-muted">{hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </AuthCard>
    </>
  );
}
