import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import AdminNav from "../../components/layout/AdminNav";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Alert from "../../components/ui/Alert";
import { PageSpinner } from "../../components/ui/Spinner";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../store/usersApi";
import { errMsg } from "../../lib/format";

function UserForm({ user }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, isAdmin: user.isAdmin });
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const isDemo = useSelector((s) => s.auth.userInfo?.isDemo);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await updateUser({ userId: user._id, ...form }).unwrap();
      toast.success("User saved");
      navigate("/admin/users");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <form onSubmit={submit} className="card flex max-w-xl flex-col gap-4 p-5 sm:p-6">
      {isDemo && <Alert tone="info">Read-only demo: saving is disabled.</Alert>}
      <Field label="Name">
        <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Email">
        <input type="email" className="field" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-[var(--accent)]"
          checked={form.isAdmin}
          onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
        />
        Administrator (can manage products, orders and users)
      </label>
      <div className="flex justify-end gap-3">
        <Button as={Link} to="/admin/users" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={isDemo}>
          Save user
        </Button>
      </div>
    </form>
  );
}

export default function UserEdit() {
  const { id } = useParams();
  const { data: user, isLoading, error } = useGetUserDetailsQuery(id);
  return (
    <>
      <title>Edit user — Admin — Tune Shed Music</title>
      <AdminNav />
      <Link to="/admin/users" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> All users
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">Edit user</h1>
      {isLoading ? <PageSpinner /> : error ? <Alert tone="error">{errMsg(error)}</Alert> : <UserForm key={user._id} user={user} />}
    </>
  );
}
