import React from "react";
import styles from "./NavBar.module.css";
import NavItem from "../NavItem/NavItem";

const NavBar: React.FC = () => (
  <div className={styles.NavBar} data-testid="NavBar">
    <NavItem></NavItem>
    <NavItem></NavItem>
    <NavItem></NavItem>
    <NavItem></NavItem>
  </div>
);

export default NavBar;
