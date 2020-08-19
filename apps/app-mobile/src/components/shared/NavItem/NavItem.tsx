import React from "react";
import styles from "./NavItem.module.css";
import AccessAlarm from "@material-ui/icons/AccessAlarm";

const NavItem: React.FC = () => (
  <a href="/">
    <div className={styles.NavItem} data-testid="NavItem">
      <AccessAlarm />
      <span>Menu</span>
    </div>
  </a>
);

export default NavItem;
