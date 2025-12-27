// dea-local-frontend/pages/workspace/workspace.jsx
import "./workspace.css";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";


function Workspace() {

    const [bundleList, setBundleList] = useState([
        {bundleId: 21,
        bundleName: "Bundle 21",
        totalItems: 350,
        completedItems: 142},
        //.....
        
    ]); // loading, error, {data list}


    return (
        <>

            <div className="workspace">

                <div className="head">
                    <div className="title">
                        <p>WorkSpace</p>
                    </div>

                </div>
                <div className="body">
                    <div className="content">
                        <div className="livebundle">
                            <div className="head">
                                <div className="title"><p>Live Bundle</p></div>
                            </div>
                            <div className="body">
                                {bundleList == "loading" ? (
                                    <div className="loading">
                                        <div className="iconbox"><AiOutlineLoading className="icon" /></div>
                                        <div className="txt"><p>Just a moment...</p></div>
                                    </div>) : (<></>)}

                                {bundleList == "error" ? (
                                    <div className="error">
                                        <div className="txt"><p>Error while loading the data</p></div>
                                    </div>) : (<></>)}
                                {bundleList != "error" && bundleList != "loading" ? (
                                    <div className="list">
                                        {/* create like below from the bundleList */}
                                        <div className="ctn">
                                            <div className="left"><p>Bundle 1</p></div>
                                            <div className="right">
                                                <div className="percentage"><p>21%</p></div>
                                                <div className="value"><p>71</p><p className="bold">/350</p></div>
                                            </div>
                                        </div>

                                        
                                    </div>) : (<></>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Workspace;