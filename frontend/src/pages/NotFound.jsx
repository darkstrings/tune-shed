import { Link } from "react-router";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <p className="font-display text-8xl font-bold text-accent">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">That one's out of tune</h1>
        <p className="mt-2 text-muted">We couldn't find the page you were looking for.</p>
        <Button as={Link} to="/" className="mt-6">
          Back to the shop
        </Button>
      </div>
    </div>
  );
}
