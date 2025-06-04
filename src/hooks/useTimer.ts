import { useCallback, useEffect, useState } from "react";

export interface TimerSettings {
  totalSeconds: number;
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
    remainingSeconds: settings.totalSeconds,
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
          const remainingSeconds = Math.max(
            0,
            settings.totalSeconds - newElapsed
          );

          // アラートチェック
          const newAlertsTriggered = new Set(prev.alertsTriggered);

          for (const [index, alertMinute] of settings.alerts.entries()) {
            if (
              remainingSeconds <= alertMinute &&
              !prev.alertsTriggered.has(alertMinute) &&
              remainingSeconds > 0
            ) {
              newAlertsTriggered.add(alertMinute);
              // アラート音を鳴らす

              let played = 0;
              const playNext = () => {
                if (played > index) return;
                playAlert();
                played++;

                setTimeout(playNext, 500);
              };
              playNext(); // 最初の再生
            }
          }

          // タイマー終了チェック
          if (remainingSeconds === 0) {
            let played = 0;
            const playNext = () => {
              if (played > settings.alerts.length) return;
              playAlert();
              played++;

              setTimeout(playNext, 500);
            };
            playNext(); // 最初の再生
            playAlertLast();
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
            remainingSeconds,
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
      remainingSeconds: settings.totalSeconds,
      elapsedSeconds: 0,
      alertsTriggered: new Set(),
    });
  }, [settings.totalSeconds]);

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
  };
}

function playAlert() {
  try {
    const audio = new Audio("/audio/Onoma-Ding04-2(Short).mp3");
    audio.play();
  } catch (error) {
    console.warn("Audio playback failed:", error);
    // フォールバック: システムビープ音
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  }
}

function playAlertLast() {
  try {
    const audio = new Audio("/audio/Onoma-Ding04-1(Long).mp3");
    audio.play();
  } catch (error) {
    console.warn("Audio playback failed:", error);
    // フォールバック: システムビープ音
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  }
}
