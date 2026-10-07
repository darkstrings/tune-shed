import { useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import AdminNav from "../../components/layout/AdminNav";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Alert from "../../components/ui/Alert";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { PageSpinner } from "../../components/ui/Spinner";
import { useDeleteUserMutation, useGetUsersQuery } from "../../store/usersApi";
import { errMsg, shortDate } from "../../lib/format";

export default function Users() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [toDelete, setToDelete] = useState(null);
  const me = useSelector((s) => s.auth.userInfo);

  async function remove() {
    try {
      await deleteUser(toDelete._id).unwrap();
      toast.success(`${toDelete.name} removed`);
      setToDelete(null);
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <>
      <title>Users — Admin — Tune Shed Music</title>
      <AdminNav />
      <PageHeader eyebrow="Admin" title="Users" description={`${users.length} accounts`} />
      {isLoading ? (
        <PageSpinner />
      ) : error ? (
        <Alert tone="error">{errMsg(error)}</Alert>
      ) : (
        <ul className="card divide-y divide-border">
          {users.map((u) => (
            <li key={u._id} className="flex items-center gap-4 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent">
                {u.name[0]?.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {u.name}
                  {u.isAdmin && <Badge tone="accent">Admin</Badge>}
                  {u.isDemo && <Badge>Demo</Badge>}
                  {u._id === me._id && <span className="text-xs text-muted">(you)</span>}
                </p>
                <a href={`mailto:${u.email}`} className="block truncate text-sm text-muted hover:text-fg">
                  {u.email}
                </a>
              </div>
              <p className="hidden text-xs text-muted sm:block">Joined {shortDate(u.createdAt)}</p>
              <div className="flex gap-1">
                <Button as={Link} to={`/admin/user/${u._id}/edit`} variant="ghost" size="icon" aria-label={`Edit ${u.name}`}>
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setToDelete(u)}
                  disabled={u.isAdmin || me.isDemo}
                  aria-label={`Delete ${u.name}`}
                  title={u.isAdmin ? "Admins can't be deleted" : undefined}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        message="Their account is removed permanently. Their past orders stay in the system."
        loading={deleting}
        onConfirm={remove}
      />
    </>
  );
}
