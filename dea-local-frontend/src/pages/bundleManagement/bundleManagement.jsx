// dea-local-frontend/pages/bundleManagement/bundleManagement.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bundleManagement.css";
import { bundleAPI } from "../../api/api";

function BundleManagement() {
    const navigate = useNavigate();

    const gotoAddNew = () => {
        navigate("/bundle-management/new-bundle");
    };

    const [bundleList, setBundleList] = useState("loading");

    /* ===============================
       LOAD BUNDLES
    =============================== */
    useEffect(() => {
        const loadBundles = async () => {
            try {
                const data = await bundleAPI.getBundles();
                setBundleList(data);
            } catch (err) {
                setBundleList("error");
            }
        };

        loadBundles();
    }, []);

    return (
        <div className="bundleManagement">
            <div className="head">
                <div className="title">
                    <p>Bundle Management</p>
                </div>
            </div>

            <div className="body">
                <div className="content">
                    <div className="livebundle">
                        <div className="head">
                            <div className="title">
                                <p>Live Bundle</p>
                            </div>
                            <div className="addNew">
                                <p onClick={gotoAddNew}>new bundle</p>
                            </div>
                        </div>

                        <div className="body">
                            {/* LOADING */}
                            {bundleList === "loading" && (
                                <div className="loading">
                                    <p>Just a moment...</p>
                                </div>
                            )}

                            {/* ERROR */}
                            {bundleList === "error" && (
                                <div className="error">
                                    <p>Error while loading the data</p>
                                </div>
                            )}

                            {/* DATA */}
                            {Array.isArray(bundleList) && (
                                <div className="list">
                                    {bundleList.map((bundle) => {
                                        const percentage = Math.round(
                                            (bundle.completedItems /
                                                bundle.totalItems) *
                                                100
                                        );

                                        return (
                                            <div
                                                className="ctn"
                                                key={bundle.bundleId}
                                            >
                                                <div className="left">
                                                    <p>{bundle.bundleName}</p>
                                                </div>

                                                <div className="right">
                                                    <div className="percentage">
                                                        <p>{percentage}%</p>
                                                    </div>
                                                    <div className="value">
                                                        <p>
                                                            {bundle.completedItems}
                                                        </p>
                                                        <p className="bold">
                                                            /
                                                            {bundle.totalItems}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BundleManagement;
