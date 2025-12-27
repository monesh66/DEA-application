// dea-local-frontend/pages/login/login.jsx
import { useEffect, useState } from "react";
import "./login.css";
import { FaUser, FaKey } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";

const LOCAL_URL = import.meta.env.VITE_LOCAL_SERVER_URL;


function Login({ onLoginSuccess }) {

    const [popupMSG, setPopupMSG] = useState("Default Message");
    const [popupColor, setPopupColor] = useState("black");
    const [showPopup, setShowPopup] = useState(0);

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    /* ===============================
       POPUP HELPERS
    =============================== */
    const showError = (msg) => {
        setPopupMSG(msg);
        setPopupColor("red");
        setShowPopup(1);
    };

    useEffect(() => {
        if (showPopup === 1) {
            const timer = setTimeout(() => {
                setShowPopup(0);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    /* ===============================
       LOGIN HANDLER (BROWSER)
    =============================== */
    const handleLogin = async () => {
        if (isLoading) return;

        if (!userId.trim() || !password.trim()) {
            showError("UserID and password cannot be empty");
            return;
        }

        // if (!navigator.onLine) {
        //   showError("No Internet connection. Please connect");
        //   return;
        // }

        setIsLoading(true);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            console.log(LOCAL_URL)
            const res = await fetch(`${LOCAL_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ IMPORTANT for cookies
                signal: controller.signal,
                body: JSON.stringify({
                    userId,
                    password
                })
            });

            clearTimeout(timeout);

            const data = await res.json();

            if (!res.ok || !data.ok) {
                switch (data.reason) {
                    case "INVALID_CREDENTIALS":
                        showError("Invalid username or password");
                        return;

                    case "DEVICE_NOT_AUTHORIZED":
                        showError("This device is not authorized");
                        return;

                    case "DEVICE_BLOCKED":
                        showError("Access denied. Device blocked");
                        return;

                    default:
                        showError("Login failed. Please try again");
                        return;
                }
            }

            console.log("wd")
            const meRes = await fetch(`${LOCAL_URL}/auth/me`, {
                credentials: "include"
            });

            if (meRes.ok) {
                onLoginSuccess(); 
            } else {
                showError("Authentication failed after login");
            }

        } catch (err) {
            console.log(err)
            if (err.name === "AbortError") {
                showError("Request timeout. Please try again");
                return;
            }

            showError("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    /* ===============================
       UI (UNCHANGED)
    =============================== */
    return (
        <div className="login">
            {showPopup ? (
                <div className="popup popinAni">
                    <div className="warp">
                        <div className="left">
                            <p>{popupMSG}</p>
                        </div>
                        <div className="right">
                            <FaPlus
                                className="icon"
                                onClick={() => setShowPopup(0)}
                            />
                        </div>
                        <div
                            className="timer"
                            style={{ background: popupColor }}
                        />
                    </div>
                </div>
            ) : null}

            <div className="loginbox">
                <div className="title">
                    <p className="t1">
                        <span className="bold">D</span>ata{" "}
                        <span className="bold">E</span>ntry{" "}
                        <span className="bold">A</span>utomation
                    </p>
                    <p className="t2">
                        <span className="bold2">DEA</span> - application
                    </p>
                    <p className="t3">Login to continue</p>
                </div>

                <div className="body">
                    <div className="dataentry">
                        <div className="userid">
                            <FaUser className="icon" />
                            <input
                                type="text"
                                placeholder="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="pass">
                            <FaKey className="icon" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="buttonbox">
                        <div
                            className="btn"
                            onClick={!isLoading ? handleLogin : undefined}
                            style={{ pointerEvents: isLoading ? "none" : "auto" }}
                        >
                            <p>
                                {isLoading ? (
                                    <VscLoading className="loading" />
                                ) : (
                                    "Login"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
