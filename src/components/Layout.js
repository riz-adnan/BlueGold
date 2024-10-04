import React from 'react';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import './Layout.css'; // Custom CSS for layout

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar and Main Content */}
      <div>
        <Sidebar />
        
        <div>
          {children} {/* This will render the content of the page */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
