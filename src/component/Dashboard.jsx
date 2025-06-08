import React from 'react';
import SideBar from "../pages/DashSide_bar";

const Dashboard = () => {
  return (
    <>
      <section
        className="w-full h-screen "
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'none',       // Firefox
          msOverflowStyle: 'none',      // IE 10+
        }}
      >
        <style>
          {`
            /* Chrome, Safari and Opera */
            section::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <SideBar />
      </section>
    </>
  );
};

export default Dashboard;
