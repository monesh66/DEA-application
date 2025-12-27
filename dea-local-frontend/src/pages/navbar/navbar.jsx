// dea-local-frontend/pages/navbar/navbar.jsx

import "./navbar.css";
import { MdDashboard } from "react-icons/md";
import { FaPager } from "react-icons/fa6";
import { FaDatabase } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { FaCubes } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/*
  API IMPORT (to be implemented later)
*/
// import { logoutUser } from "../../api/auth.api";

function Navbar({ userRole, userIdd }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [page, setPage] = useState("");

    /* ===============================
       TRACK ACTIVE ROUTE
    =============================== */
    useEffect(() => {
        const current = location.pathname.split("/")[1];
        setPage(current);
    }, [location.pathname]);

    /* ===============================
       NAVIGATION HANDLERS
    =============================== */
    const goDashboard = () => navigate("/dashboard");
    const goWorkspace = () => navigate("/workspace");
    const goDatabase = () => navigate("/database");
    const goBundleManagement = () => navigate("/bundle-management");

    /* ===============================
       LOGOUT HANDLER
    =============================== */
    const handleLogout = async () => {
        try {
            /*
              await logoutUser();
            */

            // TEMP (until backend exists)
            sessionStorage.clear();

        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="navbar">
            <div className="title">
                <p className="big">
                    <span className="bold">DEA</span> - Data Entry Automation
                </p>
            </div>

            <div className="body">
                <div
                    className={page === "dashboard" ? "itm active" : "itm"}
                    onClick={goDashboard}
                >
                    <div className="left"><MdDashboard /></div>
                    <div className="right"><p>Dashboard</p></div>
                </div>

                <div
                    className={page === "workspace" ? "itm active" : "itm"}
                    onClick={goWorkspace}
                >
                    <div className="left"><FaPager /></div>
                    <div className="right"><p>Workspace</p></div>
                </div>

                <div
                    className={page === "database" ? "itm active" : "itm"}
                    onClick={goDatabase}
                >
                    <div className="left"><FaDatabase /></div>
                    <div className="right"><p>Database</p></div>
                </div>

                {/* TEAM LEAD ONLY */}
                {userRole === "Team Lead" && (
                    <div
                        className={page === "bundle-management" ? "itm active" : "itm"}
                        onClick={goBundleManagement}
                    >
                        <div className="left"><FaCubes /></div>
                        <div className="right"><p>Bundle Management</p></div>
                    </div>
                )}
            </div>

            <div className="bottom">
                <div className="profile">
                    <div className="left"><FaUserCircle /></div>
                    <div className="right">{userIdd}</div>
                </div>

                <div className="logout" onClick={handleLogout}>
                    <div className="left"><FiLogOut /></div>
                    <div className="right">Logout</div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
