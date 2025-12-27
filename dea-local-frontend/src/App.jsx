// dea-local-frontend/src/App.jsx

import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./app.css";
import { jwtDecode } from "jwt-decode";
import { FaPlus } from "react-icons/fa6";

import PreCheck from "./pages/preCheck/preCheck";
import Login from "./pages/login/login";
import Navbar from "./pages/navbar/navbar";
import Dashboard from "./pages/dashboard/dashboard";
import Workspace from "./pages/workspace/workspace";
import BundleManagement from "./pages/bundleManagement/bundleManagement";
import AddBundle from "./pages/bundleManagement/addBundle";

const LOCAL_URL = import.meta.env.VITE_LOCAL_SERVER_URL;

/* ===============================
   PROTECTED LAYOUT (NAVBAR ONCE)
=============================== */
function ProtectedLayout({ userRole, userIdd }) {
  return (
    <>
      <Navbar userRole={userRole} userIdd={userIdd} />
      <Outlet />
    </>
  );
}



function App() {
  const [userRole, setUserRole] = useState("member");
  const [userIdd, setUserIdd] = useState("");
  const [preCheckPassed, setPreCheckPassed] = useState(
    sessionStorage.getItem("precheck") === "true"
  );
  const [isAuth, setIsAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);


  /* ===============================
       POPUP
    =============================== */
  function popup({ popupMSG, popupColor }) {
    return (
      <>
        {showPopup ? (
          <div className="popup popinAni">
            <div className="warp">
              <div className="left"><p>{popupMSG}</p></div>
              <div className="right">
                <FaPlus className="icon" onClick={() => setShowPopup(0)} />
              </div>
              <div className="timer" style={{ background: popupColor }} />
            </div>
          </div>
        ) : null}
      </>
    )
  }
  const [popupMSG, setPopupMSG] = useState("Default Message");
  const [popupColor, setPopupColor] = useState("black");
  const [showPopup, setShowPopup] = useState(0);
  const [popupStay, setPopupStay] = useState(0);

  const showpop = (msg, clr, stay = 0) => {
    setShowPopup(0);
    setTimeout(() => {
      console.log(msg)
      setPopupMSG(msg || "some");
      setPopupColor(clr);
      setPopupStay(stay)
      setShowPopup(1);
    }, 1);

  };

  useEffect(() => {
    if (showPopup === 1 && popupStay === 0) {
      const timer = setTimeout(() => setShowPopup(0), 10000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  /* ===============================
     AUTH CHECK
  =============================== */
  const checkAuth = async () => {
    try {
      const res = await fetch(`${LOCAL_URL}/auth/me`, {
        credentials: "include"
      });

      if (res.ok) {
        setIsAuth(true);
        return;
      }

      const refresh = await fetch(`${LOCAL_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
      });

      if (refresh.ok) {
        const retry = await fetch(`${LOCAL_URL}/auth/me`, {
          credentials: "include"
        });
        setIsAuth(retry.ok);
      } else {
        setIsAuth(false);
      }
    } catch {
      setIsAuth(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  /* ===============================
     DECODE JWT (ROLE + USER)
     runs ONLY when auth is true
  =============================== */
  useEffect(() => {
    if (!isAuth) return;

    try {
      const cookie = document.cookie
        .split("; ")
        .find(c => c.startsWith("accessToken="));

      if (!cookie) return;

      const token = cookie.split("=")[1];
      const decoded = jwtDecode(token);

      setUserRole(decoded.role || "member");
      setUserIdd(decoded.userId || "");
    } catch {
      setUserRole("member");
      setUserIdd("");
    }
  }, [isAuth]);

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth) return null;

  return (
    <Routes>


      {/* ===============================
          PUBLIC ROUTES (NO NAVBAR)
      =============================== */}
      <Route
        path="/"
        element={
          <PreCheck
            setPreCheckPassed={(val) => {
              setPreCheckPassed(val);
              sessionStorage.setItem("precheck", val ? "true" : "false");
            }}
          />
        }
      />

      <Route
        path="/login"
        element={
          !preCheckPassed ? (
            <Navigate to="/" replace />
          ) : isAuth ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLoginSuccess={checkAuth} />
          )
        }
      />

      {/* ===============================
          PROTECTED ROUTES (NAVBAR)
      =============================== */}
      <Route
        element={
          !preCheckPassed ? (
            <Navigate to="/" replace />
          ) : isAuth ? (
            <ProtectedLayout userRole={userRole} userIdd={userIdd} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* MEMBER ROUTES */}
        <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
        <Route path="/workspace/*" element={<Workspace />} />
        {/* <Route path="/database/*" element={<Database />} /> */}

        {/* TEAM LEAD ONLY */}
        {userRole === "Team Lead" && (
          <>
            <Route path="/bundle-management" element={<BundleManagement showpop={showpop} />} />
            <Route
              path="/bundle-management/new-bundle"
              element={<AddBundle showpop={showpop} />}
            />
          </>
        )}
      </Route>

      {/* ===============================
          404 (STRICT)
      =============================== */}
      <Route path="*" element={<><div>404 – Page Not Found</div><a href="/dashboard">Go To Dashboard</a></>} />

    </Routes>
  );
}

export default App;
