import { useEffect } from "react";

export interface KeyboardShortcuts {
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Enterキーでスタート/一時停止
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        if (shortcuts.onStart) {
          shortcuts.onStart();
        }
      }

      // Escapeキーでリセット
      if (event.code === "Escape") {
        event.preventDefault();
        if (shortcuts.onReset) {
          shortcuts.onReset();
        }
      }

      // Pキーで一時停止
      if (event.code === "KeyP") {
        event.preventDefault();
        if (shortcuts.onPause) {
          shortcuts.onPause();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
