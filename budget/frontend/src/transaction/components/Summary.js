function upperFirst(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export function Summary({ transaction }) {
  return (
    <>
      <strong>{upperFirst(transaction.merchantName())}</strong> for $
      {transaction.displayAmount()} on {transaction.displayTime()}.
    </>
  );
}
