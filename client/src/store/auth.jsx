import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

    const [token, setToken] = useState(localStorage.getItem('token'));

    const storetokenInLS = (serverToken) =>{
        setToken(serverToken);
        return localStorage.setItem('token', serverToken);
    }

    const LogoutUser = ()=>{
        setToken("");
        return localStorage.removeItem('token');
    }

    let isLoggedin = !!token;

    return (
    <AuthContext.Provider value={{storetokenInLS, LogoutUser, token, isLoggedin}}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth = ()=>{
    const authContextValue = useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the provider");
    }
    return authContextValue;
}