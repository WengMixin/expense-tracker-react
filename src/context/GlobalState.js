import React, { createContext, useContext, useReducer } from "react";
import AppReducer from "./AppReducer";

// Initial state
const initalSate = {
  transactions: [
    { id: 1, text: "Flower", amount: -20 },
    { id: 2, text: "Salary", amount: 300 },
    { id: 3, text: "Book", amount: -10 },
    { id: 4, text: "Camera", amount: 150 },
  ],
};

// Create context
export const GlobalContext = createContext(initalSate);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initalSate);

  // Action
  function deleteTransaction(id) {
    dispatch({
      type: "DELETE_TRANSACTION",
      playload: id,
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      playload: transaction,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
