import React from "react";
import styles from "./NavBar.module.css";

const NavBar: React.FC = () => (
  <div className={styles.NavBar} data-testid="NavBar">
    <a href="/">mewow</a>
    <a href="/users">mewow</a>
  </div>
);

export default NavBar;
