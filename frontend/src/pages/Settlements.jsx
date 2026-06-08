import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getSettlementsApi } from "../api/settlementApi";

const Settlements = () => {
  const { id } = useParams();

  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSettlementsApi(id);
        setSettlements(res.data.settlements);
      } catch (error) {
        console.error("Failed to fetch settlements:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Settlements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Suggested payments to clear all debts in this group.
          </p>
        </div>

        {/* Settlements List */}
        <div className="space-y-4">
          {settlements.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
              <p className="text-sm text-gray-500 font-medium">
                No pending settlements. Everyone is squared up!
              </p>
            </div>
          ) : (
            settlements.map((settlement, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-md"
              >
                
                {/* Transaction Details (Who owes Whom) */}
                <div className="flex items-center text-sm sm:text-base text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {settlement.from}
                  </span>
                  <span className="mx-3 text-gray-400 font-medium flex items-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {settlement.to}
                  </span>
                </div>

                {/* Amount */}
                <div className="flex items-center">
                  <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                    ₹{settlement.amount}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default Settlements;