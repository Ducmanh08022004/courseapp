function NotificationItem({ notification }) {
  return (
    <div className="border-b p-2">
      <h3 className="font-semibold">{notification.title}</h3>
      <p>{notification.body}</p>
      {!notification.isRead && <span className="text-red-500">Mới</span>}
    </div>
  );
}

export default NotificationItem;