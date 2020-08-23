import React, { Component } from "react";
import styles from "./NavBar.module.css";
import AddBox from "@material-ui/icons/AddBox";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import AccountBox from "@material-ui/icons/AccountBox";
import InsertChart from "@material-ui/icons/InsertChart";
import Settings from "@material-ui/icons/Settings";

export default class NavBar extends Component {
  render() {
    return (
      <div className={styles.NavBar} data-testid="NavBar">
        <a href="/" className={styles.NavItem}>
          <AccountBox />
          <span>Profile</span>
        </a>
        <a href="/entries" className={styles.NavItem}>
          <LibraryBooks />
          <span>Entries</span>
        </a>
        <a href="/capture" className={styles.NavItem}>
          <AddBox />
          <span>Capture</span>
        </a>
        <a href="/stats" className={styles.NavItem}>
          <InsertChart />
          <span>Stats</span>
        </a>
        <a href="/settings" className={styles.NavItem}>
          <Settings />
          <span>Settings</span>
        </a>
      </div>
    );
  }
}
