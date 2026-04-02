import React, { createContext, useContext } from "react";

const ExchangerIdContext = createContext<string | undefined>(undefined);

export const ExchangerIdProvider = ({
  exchangerId,
  children,
}: {
  exchangerId: string;
  children: React.ReactNode;
}) => (
  <ExchangerIdContext.Provider value={exchangerId}>
    {children}
  </ExchangerIdContext.Provider>
);

export const useExchangerId = () => {
  const exchangerId = useContext(ExchangerIdContext);
  if (!exchangerId) {
    throw new Error("useExchangerId must be used inside ExchangerIdProvider");
  }
  return exchangerId;
};
