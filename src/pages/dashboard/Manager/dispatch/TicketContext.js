import React, { createContext, useContext, useReducer } from 'react';

const TicketContext = createContext();

const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TICKET':
      return {
        ...state,
        ticket: action.payload,
      };
    default:
      return state;
  }
};

const TicketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, {
    ticket: null,
  });

  const updateTicket = (updatedTicket) => {
    dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
  };

  return (
    <TicketContext.Provider value={{ state, dispatch, updateTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export { TicketProvider, useTicket };