// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/NavBar';
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This renders the matched child route */}
    </>
  );
};

export default MainLayout;
