import React, { useState } from "react";
import {
  FaSearch,
  FaUsers,
  FaProjectDiagram,
  FaCalendarAlt,
  FaFile,
  FaChartLine,
  FaCog,
  FaBell,
  FaRegEdit,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineMore } from "react-icons/ai";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } sm:block md:w-1/6 md:fixed sm:w-64 md:min-h-screen bg-white shadow-lg`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaSearch className="mr-2" />
                Search
              </a>
            </li>
            <li>
              <a
                href="/dashboard/addTask"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaUsers className="mr-2" />
                Team
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaProjectDiagram className="mr-2" />
                Projects
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaCalendarAlt className="mr-2" />
                Calendar
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaFile className="mr-2" />
                Documents
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <FaChartLine className="mr-2" />
                Reports
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-6 p-4">
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FaCog className="mr-2" />
            Settings
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:absolute -z-0 right-0 md:w-5/6">
        {/**navbar --> search and profile*/}
        <div className="w-full z-10 md:fixed rounded-xl bg-white flex justify-between items-center shadow-md relative lg:mb-8 md:mb-4 mb-2 p-4">
          {/*Search input */}
          <div className="relative w-full w-1/3">
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 py-2 border w-40 md:w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/*Profile*/}
          <div className="flex items-center space-x-6 relative">
            <FaBell className="text-gray-600 md:text-xl cursor-pointer" />
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img src="" alt="" className="w-10 h-10 rounded-full border" />
                <span className=" md:block hidden">Name</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Toggle Button */}
        <div className="sm:hidden p-4 rounded-xl flex justify-between items-center bg-white shadow-md mt-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600"
          >
            <FaCog />
          </button>
        </div>

        {/*Body Content */}
        <div className="md:absolute top-8 w-full">
          <div className="lg:px-6 md:bottom-0 rounded-lg md:px-4 md:py-6 py-3 px-2 md:my-8 my-4 ">
            <div className="flex justify-between items-center">
              <h2 className="lg:text-5xl md:text-3xl text-2xl font-bold">
                Task Plan
              </h2>
              <div className="flex justify-between items-center md:gap-5 gap-2">
                <Link to="/dashboard/addTaskForm">
                  <button className="bg-primary text-white rounded-full px-4 py-2 md:px-6 md:py-3 font-bold md:text-lg text-sm">Add Task</button>
                </Link>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="m-1">
                  <AiOutlineMore className="md:text-3xl text-2xl" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li>
                      <a><span className="text-primary"><FaRegEdit size={20} /></span> Edit task</a>
                    </li>
                    <li>
                      <a><span className="text-red-600"><MdDeleteForever size={25} /></span> Delete task</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
                <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
