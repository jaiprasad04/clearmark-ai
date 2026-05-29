"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  FaCoins,
  FaCheck,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const PLANS = [
  {
    id: "basic",
    name: "Basic Pack",
    credits: 1000,
    price: 5,
    generations: 55,
    description: "Perfect for trying out ClearMark AI",
    highlight: false,
  },
  {
    id: "standard",
    name: "Standard Pack",
    credits: 2000,
    price: 10,
    generations: 111,
    description: "Great for regular watermark removal",
    highlight: false,
  },
  {
    id: "pro",
    name: "Professional Pack",
    credits: 4000,
    price: 20,
    generations: 222,
    description: "Best value for power users",
    highlight: true,
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 10000,
    price: 50,
    generations: 555,
    description: "High-volume batch processing",
    highlight: false,
  },
];

const FEATURES = [
  "Remove watermarks, logos & text overlays",
  "Restore old & damaged photographs",
  "Clean documents & scanned receipts",
  "2K / 4K high-resolution output",
  "GPT Image 2 powered reconstruction",
  "Personal gallery with HD downloads",
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setToast({ type: "success", message: "Payment successful! Credits added to your account." });
    } else if (params.get("canceled") === "true") {
      setToast({ type: "error", message: "Payment canceled. No credits were charged." });
    }
    if (toast) setTimeout(() => setToast(null), 5000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePurchase = async (planId) => {
    if (!session?.user) { signIn("google"); return; }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setToast({ type: "error", message: "Could not start checkout. Please try again." });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl border shadow-2xl text-xs font-semibold ${
            toast.type === "success"
              ? "bg-emerald-900/80 border-emerald-500/40 text-emerald-200"
              : "bg-red-900/80 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold px-3 py-1.5 rounded-full mb-5">
            <FaCoins className="text-amber-400" />
            $1 = 200 Credits · 18 Credits per Removal
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Credit Packs
          </h1>
          <p className="text-sm text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
            One-time purchase. No subscriptions. Use credits at your own pace across all ClearMark AI features.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-indigo-600/20 to-violet-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold text-center py-1.5 tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              <div className={`flex flex-col gap-4 p-6 flex-1 ${plan.highlight ? "pt-8" : ""}`}>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{plan.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{plan.description}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">${plan.price}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {plan.credits.toLocaleString()} credits · ~{plan.generations} removals
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer mt-auto disabled:opacity-50 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <><FaSpinner className="animate-spin" /> Processing...</>
                  ) : (
                    `Get ${plan.credits.toLocaleString()} Credits`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="text-sm font-bold text-zinc-100 mb-5 text-center">All Plans Include</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaCheck className="text-[9px] text-indigo-400" />
                </div>
                <span className="text-xs text-zinc-400">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-600 mt-6">
          Credits never expire · Secure payment via Stripe · No recurring charges
        </p>
      </div>
    </div>
  );
}
