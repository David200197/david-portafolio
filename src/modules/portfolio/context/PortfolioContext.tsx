"use client";

import { createContext, useContext } from "react";

type PortfolioContextProps = {
  title: { big: string; small: string };
};

export const PortfolioContext = createContext<PortfolioContextProps | null>(
  null
);

type Props = { children: React.ReactNode; value: PortfolioContextProps };
export const PortfolioProvider = ({ children, value: data }: Props) => (
  <PortfolioContext.Provider value={data}>{children}</PortfolioContext.Provider>
);

export const usePorfolioContext = () => {
  const data = useContext(PortfolioContext);
  if (!data)
    throw new Error(
      "usePorfolioContext must be used within a PorfolioProvider"
    );
  return data;
};
