import React, { Component } from "react";
import styles from "./Stats.module.css";
import styled from "styled-components";

export default class Stats extends Component {
  render() {
    return (
      <div className={styles.Stats} data-testid="Stats">
        Stats Component
      </div>
    );
  }
}
