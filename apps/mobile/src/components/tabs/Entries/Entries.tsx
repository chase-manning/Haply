import React, { Component } from "react";
import styles from "./Entries.module.css";
import styled from "styled-components";

export default class Entries extends Component {
  render() {
    return (
      <div className={styles.Entries} data-testid="Entries">
        Entries Component
      </div>
    );
  }
}
