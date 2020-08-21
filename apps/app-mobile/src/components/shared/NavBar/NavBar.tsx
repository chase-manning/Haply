import React from "react";
import styles from "./NavBar.module.css";
import AccessAlarm from "@material-ui/icons/AccessAlarm";
import AddBox from "@material-ui/icons/AddBox";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import AccountBox from "@material-ui/icons/AccountBox";
import InsertChart from "@material-ui/icons/InsertChart";
import Settings from "@material-ui/icons/Settings";

const NavBar: React.FC = () => (
  <div className={styles.NavBar} data-testid="NavBar">
    <a href="/" className={styles.NavItem}>
      <AccountBox />
      <span>Profile</span>
    </a>
    <a href="/" className={styles.NavItem}>
      <LibraryBooks />
      <span>Entries</span>
    </a>
    <a href="/users" className={styles.NavItem}>
      <AddBox />
      <span>Capture</span>
    </a>
    <a href="/" className={styles.NavItem}>
      <InsertChart />
      <span>Stats</span>
    </a>
    <a href="/" className={styles.NavItem}>
      <Settings />
      <span>Settings</span>
    </a>
  </div>
);

export default NavBar;
