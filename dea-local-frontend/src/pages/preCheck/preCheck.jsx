// dea-local-frontend/pages/preCheck/preCheck.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./preCheck.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ImCross } from "react-icons/im";

/*
  API IMPORTS (to be implemented later)
*/
// import {
//   checkLocalHealth,
//   checkCloudHealth,
//   checkDeviceAuth,
//   checkOCRStatus
// } from "../../api/precheck.api";

function PreCheck({ setPreCheckPassed }) {
    const navigate = useNavigate();

    const [localServer, setLocalServer] = useState("checking");
    const [cloudServer, setCloudServer] = useState("checking");
    const [deviceAuth, setDeviceAuth] = useState("checking");
    const [ocrEngine, setOcrEngine] = useState("checking");
    const [msg, setMsg] = useState("");

    /* ===============================
       RUN PRECHECK SEQUENCE
    =============================== */
    useEffect(() => {
        setTimeout(() => {
            setTimeout(() => checkLocal(), 1000);
            setTimeout(() => checkCloud(), 1500);
            setTimeout(() => checkDevice(), 1700);
            setTimeout(() => checkOCR(), 1200);
        }, 1200);
    }, []);

    /* ===============================
       ALL CHECKS PASSED
    =============================== */
    useEffect(() => {
        if (
            localServer === 1 &&
            cloudServer === 1 &&
            deviceAuth === 1 &&
            ocrEngine === 1
        ) {
            setMsg("Pre-Check Passed. Redirecting... ");
            setTimeout(() => {
                setPreCheckPassed(true);
                navigate("/login");
            }, 3000);
        }
    }, [localServer, cloudServer, deviceAuth, ocrEngine]);

    /* ===============================
       CHECK FUNCTIONS (API LAYER)
    =============================== */

    // 1️⃣ Local server
    const checkLocal = async () => {
        try {
            /*
              const res = await checkLocalHealth();
              setLocalServer(res.ok ? 1 : 0);
            */
            setLocalServer(1); // TEMP MOCK
        } catch {
            setLocalServer(0);
        }
    };

    // 2️⃣ Cloud server
    const checkCloud = async () => {
        try {
            /*
              const res = await checkCloudHealth();
              setCloudServer(res.ok ? 1 : 0);
            */
            setCloudServer(1); // TEMP MOCK
        } catch {
            setCloudServer(0);
        }
    };

    // 3️⃣ Device authorization
    const checkDevice = async () => {
        try {
            /*
              const res = await checkDeviceAuth();
              setDeviceAuth(res.ok ? 1 : 0);
            */
            setDeviceAuth(1); // TEMP MOCK
        } catch {
            setDeviceAuth(0);
        }
    };

    // 4️⃣ OCR engine
    const checkOCR = async () => {
        try {
            /*
              const res = await checkOCRStatus();
              setOcrEngine(res.ok ? 1 : 0);
            */
            setOcrEngine(1); // TEMP MOCK
        } catch {
            setOcrEngine(0);
        }
    };

    /* ===============================
       UI (UNCHANGED)
    =============================== */
    return (
        <div className="preCheck">
            <div className="box">
                <div className="title">
                    <p>Running PreCheck...</p>
                </div>

                <div className="body">
                    <div className="localServer">
                        <div className="left"><p>Checking Local Server</p></div>
                        <div className="right">
                            {localServer === "checking" && <AiOutlineLoading3Quarters className="icon" />}
                            {localServer === 1 && <IoMdCheckmarkCircleOutline className="green" />}
                            {localServer === 0 && <ImCross className="red" />}
                        </div>
                    </div>

                    <div className="cloudServer">
                        <div className="left"><p>Checking Cloud Server</p></div>
                        <div className="right">
                            {cloudServer === "checking" && <AiOutlineLoading3Quarters className="icon" />}
                            {cloudServer === 1 && <IoMdCheckmarkCircleOutline className="green" />}
                            {cloudServer === 0 && <ImCross className="red" />}
                        </div>
                    </div>

                    <div className="localServer">
                        <div className="left"><p>Checking Device Authorization</p></div>
                        <div className="right">
                            {deviceAuth === "checking" && <AiOutlineLoading3Quarters className="icon" />}
                            {deviceAuth === 1 && <IoMdCheckmarkCircleOutline className="green" />}
                            {deviceAuth === 0 && <ImCross className="red" />}
                        </div>
                    </div>

                    <div className="localServer">
                        <div className="left"><p>Checking OCR Engine</p></div>
                        <div className="right">
                            {ocrEngine === "checking" && <AiOutlineLoading3Quarters className="icon" />}
                            {ocrEngine === 1 && <IoMdCheckmarkCircleOutline className="green" />}
                            {ocrEngine === 0 && <ImCross className="red" />}
                        </div>
                    </div>

                    <div className="msg">
                        <p>{msg}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreCheck;
