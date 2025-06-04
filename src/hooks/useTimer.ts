import { useCallback, useEffect, useState } from "react";

export interface TimerSettings {
  totalMinutes: number;
  alerts: number[]; // アラートを鳴らす残り時間（分）
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  elapsedSeconds: number;
  alertsTriggered: Set<number>;
}

export function useTimer(settings: TimerSettings) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    remainingSeconds: settings.totalMinutes * 60,
    elapsedSeconds: 0,
    alertsTriggered: new Set(),
  });

  // タイマーのメインロジック
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRunning && !state.isPaused) {
      interval = setInterval(() => {
        setState((prev) => {
          const newElapsed = prev.elapsedSeconds + 1;
          const newRemaining = Math.max(
            0,
            settings.totalMinutes * 60 - newElapsed
          );

          // アラートチェック
          const remainingMinutes = Math.ceil(newRemaining / 60);
          const newAlertsTriggered = new Set(prev.alertsTriggered);

          for (const alertMinute of settings.alerts) {
            if (
              remainingMinutes <= alertMinute &&
              !prev.alertsTriggered.has(alertMinute) &&
              newRemaining > 0
            ) {
              newAlertsTriggered.add(alertMinute);
              // アラート音を鳴らす
              playAlert();
            }
          }

          // タイマー終了チェック
          if (newRemaining === 0) {
            playAlert();
            return {
              ...prev,
              isRunning: false,
              elapsedSeconds: newElapsed,
              remainingSeconds: 0,
              alertsTriggered: newAlertsTriggered,
            };
          }

          return {
            ...prev,
            elapsedSeconds: newElapsed,
            remainingSeconds: newRemaining,
            alertsTriggered: newAlertsTriggered,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isRunning, state.isPaused, settings]);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isRunning: false,
      isPaused: false,
      remainingSeconds: settings.totalMinutes * 60,
      elapsedSeconds: 0,
      alertsTriggered: new Set(),
    });
  }, [settings.totalMinutes]);

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
  };
}

function playAlert() {
  // Web Audio APIを使用してアラート音を再生
  try {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn("Audio playback failed:", error);
    // フォールバック: システムビープ音
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  }
}
