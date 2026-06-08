export const calculateSettlement = (balances) => {
  const creditors = [];
  const debtors = [];

  // Separate creditors and debtors
  Object.entries(balances).forEach(
    ([user, balance]) => {
      if (balance > 0) {
        creditors.push({
          user,
          amount: balance,
        });
      } else if (balance < 0) {
        debtors.push({
          user,
          amount: Math.abs(balance),
        });
      }
    }
  );

  const settlements = [];

  let i = 0;
  let j = 0;

  while (
    i < debtors.length &&
    j < creditors.length
  ) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(
      debtor.amount,
      creditor.amount
    );

    settlements.push({
      from: debtor.user,
      to: creditor.user,
      amount,
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) i++;

    if (creditor.amount === 0) j++;
  }

  return settlements;
};