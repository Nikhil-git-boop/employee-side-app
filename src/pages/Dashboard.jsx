import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [marked, setMarked] = useState(false);
  const [message, setMessage] = useState("");
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const name = localStorage.getItem("employeeName");
  const employeeId = localStorage.getItem("employeeId");
  const token = localStorage.getItem("employeeToken");
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString();

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);
const markAttendance = async () => {
  if (!navigator.geolocation) {
    setMessage("Geolocation not supported by your browser.");
    return;
  }

  setMessage("📍 Getting your location...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await API.post(
          "/attendance/mark",
          { latitude, longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMarked(true);
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || "Error marking attendance");
      }
    },
    (error) => {
      setMessage("❌ Location access denied. Please allow location access.");
      console.error(error);
    }
  );
};


  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/auth/employee/change-password", {
        employeeId,
        oldPassword,
        newPassword,
      });
      setPasswordMsg(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setShowChangePass(false);
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Password change failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {name}</h2>
        <div>
          <button onClick={() => setShowChangePass(true)}>Change Password</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <h3>Today: {today}</h3>

      <button
        onClick={markAttendance}
        disabled={marked}
        className={marked ? "disabled" : ""}
      >
        {marked ? "Marked Present" : "Mark Attendance"}
      </button>

      {message && <p className="message">{message}</p>}

      {showChangePass && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form onSubmit={changePassword}>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit">Update Password</button>
            </form>
            <button className="close-btn" onClick={() => setShowChangePass(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {passwordMsg && <p className="message">{passwordMsg}</p>}
    </div>
  );
}
