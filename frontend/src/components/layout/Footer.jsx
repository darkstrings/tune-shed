import { Link } from "react-router";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface/60">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            New, used and vintage guitars, hand-picked and set up by people who play them. Every instrument is
            inspected before it ships.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Shop</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <li><Link className="hover:text-fg" to="/?category=Electric%20Guitars#shop">Electric guitars</Link></li>
            <li><Link className="hover:text-fg" to="/?category=Acoustic%20Guitars#shop">Acoustic guitars</Link></li>
            <li><Link className="hover:text-fg" to="/?category=Bass%20Guitars#shop">Bass guitars</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Good to know</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <li>Free shipping over $100</li>
            <li>Secure checkout with PayPal</li>
            <li>
              <Link className="hover:text-fg" to="/profile">Track your orders</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-subtle">
        © {new Date().getFullYear()} Tune Shed Music · A portfolio project by{" "}
        <a href="https://github.com/darkstrings" target="_blank" rel="noopener" className="underline hover:text-fg">
          Lucien Gaydos
        </a>{" "}
        · Payments run in PayPal sandbox mode
      </div>
    </footer>
  );
}
