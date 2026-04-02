import React from "react";
import { IMaker } from "../../../types/p2p";

const MakerEditContext = React.createContext<IMaker | null>(null);

export function MakerEditProvider({
  maker,
  children,
}: {
  maker: IMaker;
  children: React.ReactNode;
}) {
  return <MakerEditContext.Provider value={maker}>{children}</MakerEditContext.Provider>;
}

export function useMakerEditContext() {
  const maker = React.useContext(MakerEditContext);
  if (!maker) {
    throw new Error("useMakerEditContext must be used inside MakerEditProvider");
  }
  return maker;
}
