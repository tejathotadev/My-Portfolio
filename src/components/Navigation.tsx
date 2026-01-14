import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  User,
  FolderOpen,
  Mail,
  Code,
  ShieldCheck,
  LogOut,
} from "lucide-react";

/* 🔐 Admin secret */
const ADMIN_SECRET = "teja-admin-2026";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminInput, setAdminInput] = useState("");

  /* --------- Sync admin state --------- */
  useEffect(() => {
    const syncAdmin = () => {
      setIsAdmin(sessionStorage.getItem("portfolio-admin") === "true");
    };

    syncAdmin();
    window.addEventListener("admin-change", syncAdmin);
    window.addEventListener("storage", syncAdmin);

    return () => {
      window.removeEventListener("admin-change", syncAdmin);
      window.removeEventListener("storage", syncAdmin);
    };
  }, []);

  /* --------- Scroll effect --------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home", icon: <Home className="w-4 h-4" /> },
    { name: "About", href: "#about", icon: <User className="w-4 h-4" /> },
    { name: "Projects", href: "#projects", icon: <FolderOpen className="w-4 h-4" /> },
    { name: "Skills", href: "#skills", icon: <Code className="w-4 h-4" /> },
    { name: "Contact", href: "#contact", icon: <Mail className="w-4 h-4" /> },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href === "#home" ? "#root" : href);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("portfolio-admin");
    window.dispatchEvent(new Event("admin-change"));
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrolled
            ? "glass-card backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => scrollToSection("#home")}
              className="text-xl font-bold gradient-text cursor-pointer"
            >
              Teja Thota
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-primary rounded-lg hover:bg-white/5"
                >
                  {item.name}
                </button>
              ))}

              {/* ADMIN BUTTON */}
              {!isAdmin ? (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="ml-3 flex items-center gap-1 px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="ml-3 flex items-center gap-1 px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ADMIN LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Admin Login</h3>

            <input
              type="password"
              className="w-full mb-4 p-2 rounded border bg-background text-foreground"
              placeholder="Enter admin secret"
              value={adminInput}
              onChange={e => setAdminInput(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminInput("");
                }}
                className="flex-1 border rounded py-2"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (adminInput === ADMIN_SECRET) {
                    sessionStorage.setItem("portfolio-admin", "true");
                    window.dispatchEvent(new Event("admin-change"));
                    setShowAdminLogin(false);
                    setAdminInput("");
                  } else {
                    alert("Invalid admin secret ❌");
                  }
                }}
                className="flex-1 bg-primary text-white rounded py-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
