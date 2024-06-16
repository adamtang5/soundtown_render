import { createContext, useState } from "react";

export const AnyDropdownContext = createContext();

const AnyDropdownProvider = (props) => {
  const [showAnyDropdown, setShowAnyDropdown] = useState(false);

  return (
    <AnyDropdownContext.Provider value={{
      showAnyDropdown,
      setShowAnyDropdown,
    }}>
      {props.children}
    </AnyDropdownContext.Provider>
  );
};

export default AnyDropdownProvider;