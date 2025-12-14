import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [credit, setCredit] = useState(0);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const getAuthHeaders = () => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/credits`, getAuthHeaders());
            console.log("Credits API response:", data);
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            } else {
                toast.error(data.message || "Failed to load credits.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Error loading credits.");
        }
    };

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/image/generate-image`, { prompt }, getAuthHeaders());

            if (data.success && data.resultImage?.startsWith("data:image")) {
                loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message || "Image generation failed.");
                loadCreditsData();
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Failed to generate image.");
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setCredit(0);
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            loadCreditsData();
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
