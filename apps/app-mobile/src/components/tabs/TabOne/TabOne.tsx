import React from "react";
import styles from "./TabOne.module.css";

const TabOne: React.FC = () => (
  <div className={styles.TabOne} data-testid="TabOne">
    TabOne Component
    <button onClick={meow}>Meow</button>
  </div>
);

function meow(): void {
  console.log("werwerA");
  fetch(
    "https://us-central1-happiness-software.cloudfunctions.net/happiness-create"
  )
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export default TabOne;
