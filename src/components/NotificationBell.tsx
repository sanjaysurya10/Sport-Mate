"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MOCK_NOTIFICATIONS } from "@/lib/mockData";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  const hasUnread = notifications.some((n) => !n.read);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-white/80 hover:text-white p-1 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-[#0d0d0d]">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
            <h3 className="font-bold text-sm">Notifications</h3>
            {hasUnread && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#4a6cf7] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">You're all caught up</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-4 border-b border-[#2a2a2a] last:border-0 ${
                    !notif.read ? "bg-[#222]" : "bg-transparent"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notif.type === "booking"
                          ? "bg-green-500"
                          : notif.type === "cancellation"
                          ? "bg-red-500"
                          : "bg-[#4a6cf7]"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 leading-snug mb-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
