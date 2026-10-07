import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus } from "lucide-react";
import AdminNav from "../../components/layout/AdminNav";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Alert from "../../components/ui/Alert";
import Spinner, { PageSpinner } from "../../components/ui/Spinner";
import {
  useGetFiltersQuery,
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../store/productsApi";
import { errMsg } from "../../lib/format";

const CONDITIONS = ["New", "Like New", "Good", "Fair", "As Is"];

function ProductForm({ product }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    image: product.image,
    brand: product.brand,
    category: product.category,
    countInStock: product.countInStock,
    condition: product.condition,
    description: product.description,
  });
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [upload, { isLoading: uploading }] = useUploadProductImageMutation();
  const { data: filters } = useGetFiltersQuery();
  const isDemo = useSelector((s) => s.auth.userInfo?.isDemo);
  const navigate = useNavigate();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    try {
      const res = await upload(body).unwrap();
      setForm((f) => ({ ...f, image: res.image }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await updateProduct({
        productId: product._id,
        ...form,
        price: Math.round(Number(form.price) * 100) / 100,
        countInStock: Number(form.countInStock),
      }).unwrap();
      toast.success("Product saved");
      navigate("/admin/products");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[20rem_1fr]">
      <div className="card flex flex-col gap-3 p-4 lg:sticky lg:top-24">
        <div className="aspect-[4/5] overflow-hidden rounded-xl border border-border bg-surface-2">
          {form.image && <img src={form.image} alt="" className="size-full object-cover" />}
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong px-3 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent has-disabled:cursor-not-allowed has-disabled:opacity-50">
          {uploading ? <Spinner className="size-4" /> : <ImagePlus className="size-4" />}
          Upload photo
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} disabled={uploading || isDemo} />
        </label>
        <Field label="…or image URL">
          <input className="field" value={form.image} onChange={update("image")} required />
        </Field>
      </div>

      <div className="card flex flex-col gap-4 p-5 sm:p-6">
        {isDemo && <Alert tone="info">You're signed in as the read-only demo admin, so saving is disabled.</Alert>}
        <Field label="Name">
          <input className="field" value={form.name} onChange={update("name")} required />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Brand">
            <input className="field" value={form.brand} onChange={update("brand")} required />
          </Field>
          <Field label="Category">
            <input className="field" list="categories" value={form.category} onChange={update("category")} required />
          </Field>
          <datalist id="categories">
            {filters?.categories.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
          <Field label="Price (USD)">
            <input type="number" min="0" step="0.01" className="field" value={form.price} onChange={update("price")} required />
          </Field>
          <Field label="In stock">
            <input type="number" min="0" step="1" className="field" value={form.countInStock} onChange={update("countInStock")} required />
          </Field>
          <Field label="Condition">
            <select className="field" value={form.condition} onChange={update("condition")} required>
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea rows={7} className="field" value={form.description} onChange={update("description")} required />
        </Field>
        <div className="flex justify-end gap-3">
          <Button as={Link} to="/admin/products" variant="secondary">
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} disabled={isDemo}>
            Save product
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function ProductEdit() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(id);

  return (
    <>
      <title>Edit product — Admin — Tune Shed Music</title>
      <AdminNav />
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> All products
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">Edit product</h1>
      {isLoading ? <PageSpinner /> : error ? <Alert tone="error">{errMsg(error)}</Alert> : <ProductForm key={product._id} product={product} />}
    </>
  );
}
