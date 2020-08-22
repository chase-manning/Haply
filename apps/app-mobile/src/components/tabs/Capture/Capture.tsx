import React, { Component } from "react";
import styles from "./Capture.module.css";

export default class Capture extends Component {
  meow(moodValue: number): void {
    console.log("werwerA");
    fetch(
      "https://us-central1-happiness-software.cloudfunctions.net/mood-create"
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  render() {
    return (
      <div className={styles.Capture} data-testid="Capture">
        Capture Component
        <button onClick={() => this.meow(6)}>Meow</button>
      </div>
    );
  }
}
