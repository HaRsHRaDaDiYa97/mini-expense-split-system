import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronDown, Award, Users, CreditCard, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { isAuthenticated } = useAuth();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the split calculation work?",
      a: "Our algorithm automatically resolves debts within a group to ensure the minimum number of transactions are required. It dynamically computes individual balances based on what everyone paid vs what they owe, then matches debtors and creditors."
    },
    {
      q: "Can I split expenses unevenly?",
      a: "Yes! We support Equal splits, Unequal splits (specific monetary amounts), Percentage splits (defining what percent each person owes), and Share splits (allocating shares of the total)."
    },
    {
      q: "Is it possible to record partial settlements?",
      a: "Absolutely. If you owe ₹1000, you can pay a partial amount like ₹500 and the remaining ₹500 balance will persist and be automatically tracked."
    },
    {
      q: "Can I upload receipt images?",
      a: "Yes, you can upload bills, receipts, or invoices directly when adding or editing expenses. They are securely uploaded and stored in the cloud."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-950 selection:text-white">
      {/* Navbar Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">ExpenseSplit</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-radial from-gray-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-gray-650" />
            Zero stress shared expense settling
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Simplify Group Expenses. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
              Settle Debts Instantly.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The easiest way to share bills, track travel expenses, divide office lunches, and settle up with friends without the awkward math conversations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gray-900 border border-transparent rounded-xl text-base font-semibold text-white hover:bg-gray-850 transition-colors shadow-md group cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gray-900 border border-transparent rounded-xl text-base font-semibold text-white hover:bg-gray-850 transition-colors shadow-md group cursor-pointer"
                >
                  Start Splitting Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-55 hover:text-gray-900 transition-all shadow-sm cursor-pointer"
                >
                  Log In to Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Packed with powerful features
            </h2>
            <p className="text-base sm:text-lg text-gray-550">
              Divide bills of any size, customize splits to fit any situation, and keep tabs on balances in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Group Management</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Create groups for trips, households, friends, or office events. Manage roles (Owner, Admin, Member) and permissions easily.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Splits</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose how to split: equally, unequally by absolute amounts, by percentages, or by custom shares. We do all the math automatically.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150 p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Settlements</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Minimize number of payments between members. Log partial payments, add notes, and upload receipt images directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Divide expenses in 3 easy steps
            </h2>
            <p className="text-base sm:text-lg text-gray-550">
              No spreadsheets, no manual calculation errors, no stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-lg mb-6 border border-gray-250">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Group</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Add friends, family, or colleagues into a group and select group categories (e.g. Travel, Office).
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-lg mb-6 border border-gray-250">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Log Expenses</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Add costs as they occur. Pick a split type, select categories (Food, Hotel), and optionally attach receipts.
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 text-lg mb-6 border border-gray-250">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Settle Up</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                See calculated recommendations, pay with one click, log payment details, and squared up immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Loved by splitters everywhere
            </h2>
            <p className="text-base sm:text-lg text-gray-550">
              See what our active users say about managing group finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <p className="text-sm text-gray-500 italic mb-6 leading-relaxed">
                "We used this system during our 5-day trip to Goa. It handled hotel bookings, fuel costs, and restaurant bills split across 6 people with zero issues!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-150 flex items-center justify-center font-bold text-gray-700">
                  H
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Harsh Radadiya</h4>
                  <span className="text-xs text-gray-400">Software Engineer</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <p className="text-sm text-gray-500 italic mb-6 leading-relaxed">
                "Our flat mates group runs exclusively on this. Rent, electricity, and groceries split equally, but office outings split unequally. Simply brilliant!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-150 flex items-center justify-center font-bold text-gray-700">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Mihir Shah</h4>
                  <span className="text-xs text-gray-400">Project Manager</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <p className="text-sm text-gray-500 italic mb-6 leading-relaxed">
                "No more awkward conversations asking friends to send money. The system displays exact settlements and lets us record partial amounts. Saves friendships!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-150 flex items-center justify-center font-bold text-gray-700">
                  J
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Jay Patel</h4>
                  <span className="text-xs text-gray-400">Marketing Lead</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-500">
              Clear answers to common questions about our settlement tool.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 border-t border-gray-100" : "max-h-0"} overflow-hidden`}
                  >
                    <div className="p-6 text-sm text-gray-500 leading-relaxed bg-gray-50">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="bg-gray-950 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to square up?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8 text-sm sm:text-base">
            Create an account, set up your first shared group, and settle expenses instantly.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-950 font-semibold rounded-xl text-base hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-950 font-semibold rounded-xl text-base hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
            >
              Get Started Now
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 text-center text-sm text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-bold text-gray-950">ExpenseSplit</span>
          </div>
          <p className="text-gray-450">&copy; 2026 ExpenseSplit Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
