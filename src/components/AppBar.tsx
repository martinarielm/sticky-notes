import { useState } from "react";
import styles from "./AppBar.module.css";

interface AppBarProps {
  onCreateNote: (width: number, height: number) => void;
  disabled: boolean;
}

export default function AppBar({ onCreateNote, disabled }: AppBarProps) {
  const [width, setWidth] = useState("120");
  const [height, setHeight] = useState("60");

  return (
    <header className={styles.appbar}>
      <h1>Sticky Notes</h1>

      <form
        className={styles.controls}
        onSubmit={(event) => {
          event.preventDefault();
          if (disabled) return;
          onCreateNote(Number(width), Number(height));
        }}
      >
        <label htmlFor="width">Width (pixels):</label>
        <input
          disabled={disabled}
          id="width"
          min="120"
          name="width"
          onChange={(e) => setWidth(e.target.value)}
          required
          step="1"
          type="number"
          value={width}
        />

        <label htmlFor="height">Height (pixels):</label>
        <input
          disabled={disabled}
          id="height"
          min="60"
          name="height"
          onChange={(e) => setHeight(e.target.value)}
          required
          step="1"
          type="number"
          value={height}
        />

        <button type="submit" disabled={disabled}>
          Add Note
        </button>
      </form>
    </header>
  );
}
