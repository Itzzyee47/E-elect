import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="logo">E-Voting System</h1>
                <nav className="nav">
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><a href='#about'>About</a></li>
                        <li><Link to="/vote">Vote</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </nav>
                <button className="menu-toggle" onClick={toggleSidebar}>
                    ☰
                </button>
            </div>

            {isSidebarOpen && (
                <aside className="sidebar">
                    <button className="close-sidebar" onClick={toggleSidebar}>✖</button>
                    <ul className="sidebar-links">
                        <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
                        <li><a href='#about' onClick={toggleSidebar}>About</a></li>
                        <li><Link to="/vote" onClick={toggleSidebar}>Vote</Link></li>
                        <li><Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
                    </ul>
                </aside>
            )}
        </header>
    );
};

export default Header;
