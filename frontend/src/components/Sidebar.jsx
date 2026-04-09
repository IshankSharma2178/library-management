import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import {
  BookOpen,
  BookMarked,
  Users,
  ClipboardList,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  FileText,
  PlusCircle,
  Edit3,
  FolderOpen
} from 'lucide-react';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null;

  const studentLinks = [
    { path: '/books', icon: BookOpen, label: 'Books' },
    { path: '/my-books', icon: BookMarked, label: 'My Books' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { path: '/books', icon: BookOpen, label: 'Books' },
    { path: '/add-book', icon: PlusCircle, label: 'Add Books' },
    { path: '/update-book', icon: Edit3, label: 'Update Books' },
    { path: '/categories', icon: FolderOpen, label: 'Categories' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/requests', icon: FileText, label: 'Requests' },
    { path: '/transactions', icon: ClipboardList, label: 'Transactions' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  const links = user.role === 'admin' ? adminLinks : studentLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-link ${isActive(link.path) ? 'sidebar-link-active' : ''}`}
            title={collapsed ? link.label : ''}
          >
            <link.icon size={20} />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
          )}
        </div>
        <button className="sidebar-logout" onClick={logout} title="Logout">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
