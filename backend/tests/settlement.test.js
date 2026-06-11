import { calculateSettlement } from "../utils/calculateSettlement.js";

describe("calculateSettlement", () => {
  it("should return empty list when balances are all zero", () => {
    const balances = {
      Harsh: 0,
      Jay: 0,
      Mihir: 0,
    };
    const settlements = calculateSettlement(balances);
    expect(settlements).toEqual([]);
  });

  it("should match creditor and debtor with matching amounts", () => {
    const balances = {
      Harsh: 500,  // Creditor
      Jay: -500,   // Debtor
      Mihir: 0,
    };
    const settlements = calculateSettlement(balances);
    expect(settlements).toEqual([
      { from: "Jay", to: "Harsh", amount: 500 },
    ]);
  });

  it("should handle multiple creditors and debtors correctly", () => {
    const balances = {
      Harsh: 500,   // Creditor
      Jay: -300,    // Debtor
      Mihir: -200,  // Debtor
    };
    const settlements = calculateSettlement(balances);
    // Jay pays Harsh 300, Mihir pays Harsh 200
    expect(settlements).toEqual([
      { from: "Jay", to: "Harsh", amount: 300 },
      { from: "Mihir", to: "Harsh", amount: 200 },
    ]);
  });

  it("should distribute uneven debt splits", () => {
    const balances = {
      Harsh: 700,
      Jay: -500,
      Mihir: -200,
    };
    const settlements = calculateSettlement(balances);
    expect(settlements).toEqual([
      { from: "Jay", to: "Harsh", amount: 500 },
      { from: "Mihir", to: "Harsh", amount: 200 },
    ]);
  });
});
