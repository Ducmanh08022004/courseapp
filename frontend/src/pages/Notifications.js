import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import NotificationItem from "../components/NotificationItem";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axiosClient.get("/notifications").then(res => setNotifications(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thông báo</h1>
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}

export default Notifications;