import { useReducer } from "react";
import { createContext } from "react";


const EditTicketContext = createContext();

const initialState = {
    isOpen: false,
    ticketId: null,
};

const editTicketReducer = (state, action) => {
    switch(action, type) {
        case 'OPEN_DIALOG':
            return { isOpen: true, ticketId: action.payload.ticketId };
        case 'CLOSE_DIALOG':
            return initialState;
        default: 
            return state;
    }
};


export const EditTicketProvider = ({ children }) => {
    const [state, dispatch] = useReducer(editTicketReducer, initialState);

    return (
        <EditTicketContext.Provider value={{state, dispatch}}>
            {children}
        </EditTicketContext.Provider>
    )
}