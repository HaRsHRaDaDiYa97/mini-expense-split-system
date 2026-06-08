export const calculateSummary = (expenses) => {
  const balances = {};

  expenses.forEach((expense) => {
    const payer = expense.paidBy.toString();

    // Add full amount to payer
    balances[payer] =
      (balances[payer] || 0) + expense.amount;

    // Subtract each member's share
    expense.splitAmong.forEach((split) => {
      const userId = split.user.toString();

      balances[userId] =
        (balances[userId] || 0) - split.amount;
    });
  });

  return balances;
};