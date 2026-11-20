import { useNavigate, useLocation } from "react-router-dom";
import AuthButtons from "./AuthButtons";

const links = [
  { to: "/resume", label: "Resume" },
  { to: "/cover", label: "Cover letter" },
  { to: "/documents", label: "Documents" },
  { to: "/about", label: "About" },
];

function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#f3f0ea] text-[#1b1916]">
      <header className="border-b border-[#ddd6cb]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="display text-[1.35rem] leading-none"
          >
            <span className="text-[#3b76f6]">Cover</span>
            <span className="text-[#eab308]">Sume</span>
          </button>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <nav className="flex items-center gap-5 text-sm">
              {links.map((link) => {
                const active = pathname === link.to;
                return (
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => navigate(link.to)}
                    className={
                      active
                        ? "text-[#1b1916] underline decoration-[#1b1916] underline-offset-4"
                        : "text-[#5e574f] hover:text-[#1b1916]"
                    }
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
            <AuthButtons />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="py-4 text-center text-xs text-slate-500">
        © 2026 <span className="text-[#3b76f6]">Cover</span>
        <span className="text-[#eab308]">Sume</span>
      </footer>
    </div>
  );
}

export default Layout;
