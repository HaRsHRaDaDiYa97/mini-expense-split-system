import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getSummaryApi } from "../api/summaryApi";

const Summary = () => {
  const { id } = useParams();

  const [balances, setBalances] = useState({});

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getSummaryApi(id);
        setBalances(res.data.balances);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      }
    };

    fetchSummary();
  }, [id]);

  const balanceEntries = Object.entries(balances);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Group Summary
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of total balances for all members.
          </p>
        </div>

        {/* Balances List */}
        <div className="space-y-4">
          {balanceEntries.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
              <p className="text-sm text-gray-500 font-medium">
                No balances found for this group.
              </p>
            </div>
          ) : (
            balanceEntries.map(([name, amount]) => {
              // Determine status for dynamic styling
              const isPositive = amount > 0;
              const isNegative = amount < 0;
              
              const amountColor = isPositive
                ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                : isNegative
                ? "text-red-700 bg-red-50 border-red-100"
                : "text-gray-700 bg-gray-50 border-gray-200";

              return (
                <div
                  key={name}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md"
                >
                  
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 border border-gray-200">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {name}
                    </h3>
                  </div>

                  {/* Balance Info */}
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${amountColor}`}>
                      {isNegative ? "-" : ""}₹{Math.abs(amount)}
                    </span>
                    <span className="text-xs text-gray-500 mt-1.5 font-medium uppercase tracking-wider">
                      {isPositive ? "Gets back" : isNegative ? "Owes" : "Settled up"}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
};

export default Summary;