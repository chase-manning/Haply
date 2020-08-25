import React, { Component } from "react";
import styles from "./Settings.module.css";
import styled from "styled-components";

export default class Settings extends Component {
  render() {
    return (
      <div className={styles.Settings} data-testid="Settings">
        Settings Component
      </div>
    );
  }
}
