import { useContext } from "react";
import { AuthContext, AuthContextData } from "../context/AuthContext";

export const useAuth = (): AuthContextData => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};