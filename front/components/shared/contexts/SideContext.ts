import React from "react";
type ISide = "give" | "get" | "buy" | "sell";
const SideContext = React.createContext<ISide | null>(null);
export default SideContext;
