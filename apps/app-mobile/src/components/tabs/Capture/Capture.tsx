import React, { Component } from "react";
import styles from "./Capture.module.css";
import Mood from "../../../../../../shared/models/mood";

export default class Capture extends Component {
  meow(moodValue: number): void {
    const mood: Mood = new Mood(6);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: mood.string,
    };
    fetch(
      "https://us-central1-happiness-software.cloudfunctions.net/webApi/api/moods",
      requestOptions
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
