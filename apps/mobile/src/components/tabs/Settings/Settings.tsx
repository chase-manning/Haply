import React, { Component } from "react";
import styles from "./Settings.module.css";

export default class Settings extends Component {
  render() {
    return (
      <div className={styles.Settings} data-testid="Settings">
        Settings Component
      </div>
    );
  }
}
