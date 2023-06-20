import { createContext, useContext } from "react";

export const Store = createContext();
export const useStore = () => useContext(Store);
