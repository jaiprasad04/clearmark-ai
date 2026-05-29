"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  FaCoins,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
  FaImages,
  FaHome,
  FaTags,
  FaEraser,
} from "react-icons/fa";
import { SiVercel } from "react-icons/si";

const REPO_URL = "https://github.com/SamurAIGPT/clearmark-ai";
const VERCEL_DEPLOY_URL = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(REPO_URL)}`;

const navLinks = [
  { href: "/",        label: "Studio",  icon: FaHome   },
  { href: "/gallery", label: "Gallery", icon: FaImages },
  { href: "/pricing", label: "Pricing", icon: FaTags   },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white mr-4 flex-shrink-0"
        >
          <span className="h-7 w-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <FaEraser className="text-white text-sm" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            <span className="text-white">ClearMark</span>
            <span className="text-indigo-400"> AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-all ${
                  active
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Controls */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {/* Vercel Deploy */}
          <a
            href={VERCEL_DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2.5 py-1.5 rounded transition-all"
            title="Deploy to Vercel"
          >
            <SiVercel className="text-sm" />
            <span>Deploy</span>
          </a>

          {/* Credits */}
          {session?.user && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1.5 rounded">
              <FaCoins className="animate-pulse" />
              <span>{session.user.credits ?? 0} credits</span>
            </div>
          )}

          {/* Auth */}
          {session?.user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 rounded transition-all cursor-pointer"
            >
              <FaSignOutAlt />
              <span>Sign out</span>
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-3 py-1.5 rounded shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <FaSignInAlt />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

        {/* Mobile: credits + hamburger */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          {session?.user && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
              <FaCoins className="animate-pulse" />
              <span>{session.user.credits ?? 0}</span>
            </div>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown — absolute overlay */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 z-[200] bg-zinc-950/98 backdrop-blur-md border-b border-zinc-800 flex flex-col p-4 gap-2 md:hidden">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded transition-all ${
                  active
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Icon className="text-xs" />
                {label}
              </Link>
            );
          })}

          <div className="border-t border-zinc-800 pt-3 mt-1 flex flex-col gap-2">
            {session?.user ? (
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded transition-all cursor-pointer"
              >
                <FaSignOutAlt />
                Sign out
              </button>
            ) : (
              <button
                onClick={() => { signIn("google"); setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 rounded transition-all cursor-pointer"
              >
                <FaSignInAlt />
                Sign in with Google
              </button>
            )}
            <a
              href={VERCEL_DEPLOY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-400 border border-zinc-700 px-4 py-2.5 rounded transition-all"
            >
              <SiVercel />
              Deploy to Vercel
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
