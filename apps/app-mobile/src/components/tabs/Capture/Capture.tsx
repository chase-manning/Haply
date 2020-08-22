import React, { Component } from "react";
import styles from "./Capture.module.css";
import Mood from "../../../models/mood";

export default class Capture extends Component {
  meow(moodValue: number): void {
    const mood: Mood = new Mood(moodValue);
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
        <button onClick={() => this.meow(10)}>10</button>
        <button onClick={() => this.meow(9)}>9</button>
        <button onClick={() => this.meow(8)}>8</button>
        <button onClick={() => this.meow(7)}>7</button>
        <button onClick={() => this.meow(6)}>6</button>
        <button onClick={() => this.meow(5)}>5</button>
        <button onClick={() => this.meow(4)}>4</button>
        <button onClick={() => this.meow(3)}>3</button>
        <button onClick={() => this.meow(2)}>2</button>
        <button onClick={() => this.meow(1)}>1</button>
      </div>
    );
  }
}
