import React from 'react'
import "./SideNavbar.css";
import { ChartColumn, Coins, House, List, PieChart, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkAuth } from '../../CheckAuth';

const Button = ({ icon, label, link }) => (
  <NavLink to={link} className={({ isActive }) =>
    `sideNavbarBtn ${isActive ? "active" : ""}`
  }>
    {icon}
    <span>{label}</span>
  </NavLink>
);

const SideNavbar = () => {
  const {user} = useSelector(state => state.user);

  return (
    <div className="sideNavbar cardBorder">
      <Button icon={<House size={20} color="#22c55e" />} label="Home" link="/" />
      <Button icon={<List size={20} color="#f97316" />} label="Problems" link="/problems" />
      {checkAuth(user) && <Button icon={<PieChart size={20} color="#10b981" />} label="Progress" link="/progress" />}
       <Button icon={<ChartColumn size={20} color="#576DD7" />} label="Leader Board" link="/leaderboard" />
      {checkAuth(user) && <Button icon={<Users size={20} color="#eab308" />} label="Groups" link="/groups" />}
      {/* <Button icon={<Users size={20} color="#eab308" />} label="Groups" link="/groups" /> */}
      {/* <Button icon={<Coins size={20} color="#eab308" />} label="Points" link="/" /> */}
    </div>
  )
}

export default SideNavbar