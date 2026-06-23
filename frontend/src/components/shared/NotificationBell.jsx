import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchNotifications = async () => {
            try {
                const res = await notificationsAPI.getNotifications();
                if (res?.data) {
                    setNotifications(res.data);
                    setUnreadCount(res.data.filter(n => !n.isRead).length);
                }
            } catch (err) {
                console.error("Failed to load notifications", err);
            }
        };

        fetchNotifications();
        
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            setLoading(true);
            await notificationsAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-muted-foreground hover:bg-muted/50 rounded-full transition-colors focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-card" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-80 max-h-96 bg-card border border-border/80 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/10">
                        <h3 className="text-sm font-headline font-bold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                disabled={loading}
                                className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-sans">You have no notifications.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/30">
                                {notifications.map(notification => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 flex gap-3 transition-colors ${!notification.isRead ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                                        onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-sans ${!notification.isRead ? 'font-bold text-foreground' : 'text-foreground'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                className="shrink-0 p-1 rounded-full text-primary hover:bg-primary/10 transition-colors self-center"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
