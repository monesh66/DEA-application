import { useEffect, useState } from "react";
import "./addBundle.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { usePopup } from "@/context/PopupContext";

import { API } from "../../api/endpoints";
import apiClient from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

function AddBundle() {

    const { showPopup } = usePopup();
    const navigate = useNavigate();



    /* ===============================
       STATES
    =============================== */
    const [bundleName, setBundleName] = useState("");
    const [deadLine, setDeadLine] = useState("");

    const [memberList, setMemberList] = useState("loading");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [fileList, setFileList] = useState([]);
    const [fileStatus, setFileStatus] = useState(null);

    /* ===============================
       FETCH MEMBERS
    =============================== */
    useEffect(() => {
        async function fetchMembers() {
            try {
                const res = await apiClient.post(API.GATEWAY, { forwardURL: API.ADD_BUNDLE.MEMBER_LIST, forwardMethod: "get" })
                console.log(res)
                if (res.status == 200) {
                    setMemberList(res.data.cloud.list)
                }
                else if (res.status == 401) {
                    showPopup("Session Expired, Please Login to continue", "red")
                    navigate("/login")
                }

            }
            catch (err) {
                console.log("add bundle ERROR")
                console.log(err)
                setMemberList("error")
                showPopup("Error While Fetching Members List", "red")
            }
        }
        setTimeout(() => {
            fetchMembers();
        }, 1000);

    }, []);

    /* ===============================
       MEMBER SELECTION
    =============================== */
    function handleSelection(id) {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    }

    /* ===============================
       FOLDER UPLOAD
    =============================== */
    function handleFolderUpload(e) {
        try {
            setFileStatus("loading");

            const files = Array.from(e.target.files || []);
            if (files.length === 0) {
                setFileList([]);
                setFileStatus(null);
                return;
            }

            setFileList(files);
            setFileStatus(null);
        } catch (err) {
            console.error(err);
            setFileStatus("error");
        }
    }

    /* ===============================
       CREATE BUNDLE
    =============================== */
    async function handleCreatebtn() {
        if (!bundleName.trim()) {
            showPopup("Bundle name required", "red");
            return;
        }

        if (fileList.length === 0) {
            showPopup("Please upload a folder", "red");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("bundleName", bundleName);
            formData.append("deadLine", deadLine);
            formData.append("members", JSON.stringify(selectedMembers));

            fileList.forEach(file => {
                formData.append("files", file);
            });


            const res = await apiClient.post(API.ADD_BUNDLE.CREATE_BUNDLE, formData)
            console.log(res)


            showPopup("Bundle created successfully", "green");

            // reset
            // setBundleName("");
            // setDeadLine("");
            // setSelectedMembers([]);
            // setFileList([]);

        } catch (err) {
            if (err === "Request failed with status code 409") {
                showPopup("Bundle Creation Failed: bundle name already exists in bundle-storage", "red");
            }
            else{
                showPopup("Something went wrong while creating bundle", "red");
            }

        }
    }

    return (
        <div className="addBundle">


            <div className="head">
                <div className="title">
                    <p>Bundle Management / New Bundle</p>
                </div>
            </div>

            <div className="body">
                <div className="content">
                    <div className="box">

                        {/* LEFT */}
                        <div className="left">
                            <div className="head"><p>New Bundle Details</p></div>

                            <div className="body">
                                <div className="itm bn">
                                    <div className="left"><p>Bundle Name:</p></div>
                                    <div className="right">
                                        <input
                                            placeholder="Bundle Name"
                                            type="text"
                                            value={bundleName}
                                            onChange={e => setBundleName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="itm dl">
                                    <div className="left"><p>Dead Line:</p></div>
                                    <div className="right">
                                        <input
                                            type="date"
                                            value={deadLine}
                                            onChange={e => setDeadLine(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="itm am">
                                    <div className="left"><p>Select Members:</p></div>
                                    <div className="right">

                                        {memberList === "loading" && (
                                            <div className="loading">
                                                <div className="top"><AiOutlineLoading3Quarters className="icon" /></div>
                                                <p>Getting Members List...</p>
                                            </div>
                                        )}

                                        {memberList === "error" && (
                                            <p className="error">Error while fetching Members List</p>
                                        )}

                                        {Array.isArray(memberList) && (
                                            <div className="membersList">
                                                {memberList.map(m => (
                                                    <div
                                                        key={m.id}
                                                        className="ls"
                                                        onClick={() => handleSelection(m.id)}
                                                    >
                                                        <div className="left"><p>{m.name}</p></div>
                                                        <div className="right">
                                                            <div className="circle">
                                                                {selectedMembers.includes(m.id) && (
                                                                    <div className="highlight"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="right">
                            <div className="file">
                                <div className="head"><p>File List</p></div>

                                <div className="body">
                                    {fileStatus === "loading" && (
                                        <div className="loading">
                                            <AiOutlineLoading3Quarters className="icon" />
                                            <p>Processing file list...</p>
                                        </div>
                                    )}

                                    {fileList.length === 0 && fileStatus !== "loading" && (
                                        <p>No File Found</p>
                                    )}

                                    {fileList.length > 0 && (
                                        <div className="fileList">
                                            {fileList.map((f, i) => (
                                                <div className="lss" key={i}>
                                                    <div className="img"><FaFileAlt /></div>
                                                    <div className="fn">
                                                        <p>{f.webkitRelativePath || f.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bottom">
                                    <input
                                        type="file"
                                        webkitdirectory="true"
                                        directory="true"
                                        multiple
                                        onChange={handleFolderUpload}
                                    />
                                </div>
                            </div>

                            <div className="createbtn">
                                <input
                                    type="button"
                                    value="Create Bundle"
                                    onClick={handleCreatebtn}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBundle;
