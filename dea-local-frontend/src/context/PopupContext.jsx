import { createContext, useContext, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";

const PopupContext = createContext(null);

export const usePopup = () => useContext(PopupContext);

export function PopupProvider({ children }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");
  const [stay, setStay] = useState(false);

  const showPopup = (msg, clr = "black", persistent = false) => {
    setShow(false); // reset animation
    setTimeout(() => {
      setMessage(msg);
      setColor(clr);
      setStay(persistent);
      setShow(true);
    }, 10);
  };

  useEffect(() => {
    if (show && !stay) {
      const timer = setTimeout(() => setShow(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [show, stay]);

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}

      {/* GLOBAL POPUP UI */}
      {show && (
        <div className="popup popinAni">
          <div className="warp">
            <div className="left">
              <p>{message}</p>
            </div>
            <div className="right">
              <FaPlus className="icon" onClick={() => setShow(false)} />
            </div>
            <div className="timer" style={{ background: color }} />
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}
