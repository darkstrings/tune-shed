import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminNav from "../../components/layout/AdminNav";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { ConditionBadge } from "../../components/ui/Badge";
import { PageSpinner } from "../../components/ui/Spinner";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from "../../store/productsApi";
import { errMsg, money } from "../../lib/format";

export default function Products() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber: page, pageSize: 20, sort: "newest" });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [toDelete, setToDelete] = useState(null);
  const isDemo = useSelector((s) => s.auth.userInfo?.isDemo);
  const navigate = useNavigate();

  async function create() {
    try {
      const p = await createProduct().unwrap();
      navigate(`/admin/product/${p._id}/edit`);
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  async function remove() {
    try {
      await deleteProduct(toDelete._id).unwrap();
      toast.success(`${toDelete.name} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <>
      <title>Products — Admin — Tune Shed Music</title>
      <AdminNav />
      <PageHeader
        eyebrow="Admin"
        title="Products"
        description={data ? `${data.count} instruments in the catalog` : undefined}
        actions={
          <Button onClick={create} loading={creating} disabled={isDemo} title={isDemo ? "Read-only demo" : undefined}>
            <Plus /> New product
          </Button>
        }
      />
      {isLoading ? (
        <PageSpinner />
      ) : error ? (
        <Alert tone="error">{errMsg(error)}</Alert>
      ) : (
        <>
          <ul className="card divide-y divide-border">
            {data.products.map((p) => (
              <li key={p._id} className="flex items-center gap-4 p-4">
                <img src={p.image} alt="" className="size-14 shrink-0 rounded-lg border border-border object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${p._id}`} className="line-clamp-1 font-medium hover:text-accent">
                    {p.name}
                  </Link>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                    <span>{p.brand}</span>·<span>{p.category}</span>
                    <ConditionBadge condition={p.condition} />
                  </p>
                </div>
                <div className="hidden w-24 text-right sm:block">
                  <p className="font-semibold tabular-nums">{money(p.price)}</p>
                  <p className={p.countInStock === 0 ? "text-xs text-danger" : "text-xs text-muted"}>
                    {p.countInStock === 0 ? "Sold out" : `${p.countInStock} in stock`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button as={Link} to={`/admin/product/${p._id}/edit`} variant="ghost" size="icon" aria-label={`Edit ${p.name}`}>
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setToDelete(p)} disabled={isDemo} aria-label={`Delete ${p.name}`}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {data.pages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
                Previous
              </Button>
              <span className="self-center text-sm text-muted">
                Page {page} of {data.pages}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= data.pages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        message="This removes it from the shop permanently. Past orders keep their copy of the item."
        loading={deleting}
        onConfirm={remove}
      />
    </>
  );
}
