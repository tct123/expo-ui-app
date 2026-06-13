// Shared ordering preferences. Lives above the navigator so the Restaurant
// menu (filtering, order summary) and the Preferences screen stay in sync
// across routes.
import { createContext, useContext, useMemo, useState } from "react";

type Preferences = {
  vegetarianOnly: boolean;
  setVegetarianOnly: (value: boolean) => void;
  hideSpicy: boolean;
  setHideSpicy: (value: boolean) => void;
  orderType: string;
  setOrderType: (value: string) => void;
  tip: number;
  setTip: (value: number) => void;
  orderUpdates: boolean;
  setOrderUpdates: (value: boolean) => void;
  promos: boolean;
  setPromos: (value: boolean) => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [hideSpicy, setHideSpicy] = useState(false);
  const [orderType, setOrderType] = useState("pickup");
  const [tip, setTip] = useState(15);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promos, setPromos] = useState(false);

  const value = useMemo(
    () => ({
      vegetarianOnly,
      setVegetarianOnly,
      hideSpicy,
      setHideSpicy,
      orderType,
      setOrderType,
      tip,
      setTip,
      orderUpdates,
      setOrderUpdates,
      promos,
      setPromos,
    }),
    [vegetarianOnly, hideSpicy, orderType, tip, orderUpdates, promos],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
