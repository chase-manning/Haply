import React, { Component } from "react";
import styled from "styled-components";
import styles from "./Profile.module.css";

export default class Profile extends Component {
  render() {
    return (
      <div className={styles.Profile} data-testid="Profile">
        Profile Component
      </div>
    );
  }
}
