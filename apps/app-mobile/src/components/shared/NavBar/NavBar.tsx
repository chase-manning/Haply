import React from "react";
import styles from "./NavBar.module.css";
import AccessAlarm from "@material-ui/icons/AccessAlarm";

const NavBar: React.FC = () => (
  <div className={styles.NavBar} data-testid="NavBar">
    <a href="/" className={styles.NavItem}>
      <AccessAlarm />
      <span>Meow</span>
    </a>
    <a href="/users" className={styles.NavItem}>
      <AccessAlarm />
      <span>Meow</span>
    </a>
    <a href="/" className={styles.NavItem}>
      <AccessAlarm />
      <span>Meow</span>
    </a>
    <a href="/" className={styles.NavItem}>
      <AccessAlarm />
      <span>Meow</span>
    </a>
  </div>
);

export default NavBar;
