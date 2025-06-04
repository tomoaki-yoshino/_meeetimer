"use client";

import { TimeInput } from "@/components/TimeInput";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type TimerSettings, useTimer } from "@/hooks/useTimer";
import { useState } from "react";

export default function Home() {
  const [savedSettings, setSavedSettings] = useLocalStorage<TimerSettings>(
    "timerSettings",
    {
      totalMinutes: 20,
      alerts: [10, 5, 1],
    }
  );
  const [settings, setSettings] = useState<TimerSettings>(savedSettings);
  const [isSetupMode, setIsSetupMode] = useState(true);

  const timer = useTimer(settings);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleTimeSet = (minutes: number, alerts: number[]) => {
    const newSettings = { totalMinutes: minutes, alerts };
    setSettings(newSettings);
    setSavedSettings(newSettings);
    setIsSetupMode(false);
  };

  const handleReset = () => {
    timer.reset();
    setIsSetupMode(true);
  };

  const handleStartPause = () => {
    if (!timer.isRunning) {
      timer.start();
    } else if (timer.isPaused) {
      timer.resume();
    } else {
      timer.pause();
    }
  };

  // キーボードショートカット
  useKeyboardShortcuts({
    onStart: handleStartPause,
    onPause: timer.pause,
    onReset: handleReset,
    onFullscreen: toggleFullscreen,
  });

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isFullscreen
          ? "bg-black text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } p-4`}
    >
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header
          className={`text-center transition-all duration-300 ${
            isFullscreen ? "py-4" : "py-8"
          }`}
        >
          <h1
            className={`font-bold mb-2 transition-all duration-300 ${
              isFullscreen ? "text-6xl text-white" : "text-4xl text-gray-800"
            }`}
          >
            🎯 Meeetimer
          </h1>
          {!isFullscreen && (
            <p className="text-gray-600">プレゼンテーション時間管理ツール</p>
          )}
        </header>

        {/* メインコンテンツ */}
        <main className="space-y-8">
          {isSetupMode ? (
            /* 設定モード */
            <TimeInput onTimeSet={handleTimeSet} disabled={timer.isRunning} />
          ) : (
            /* タイマーモード */
            <>
              <TimerDisplay
                remainingSeconds={timer.remainingSeconds}
                totalSeconds={settings.totalMinutes * 60}
                isRunning={timer.isRunning}
                isPaused={timer.isPaused}
                isFullscreen={isFullscreen}
              />

              <TimerControls
                isRunning={timer.isRunning}
                isPaused={timer.isPaused}
                onStart={timer.start}
                onPause={timer.pause}
                onResume={timer.resume}
                onReset={handleReset}
                onFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
              />

              {/* アラート設定表示 */}
              {!isFullscreen && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    アラート設定
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {settings.alerts.map((alert, index) => (
                      <span
                        key={alert}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          timer.alertsTriggered.has(alert)
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        残り {alert} 分
                        {timer.alertsTriggered.has(alert) && " ✓"}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    総時間: {settings.totalMinutes} 分
                  </p>
                </div>
              )}
            </>
          )}
        </main>

        {/* フッター */}
        {!isFullscreen && (
          <footer className="text-center py-8 text-gray-500 text-sm">
            <p>© 2025 Meeetimer - プレゼンテーション時間を効率的に管理</p>
          </footer>
        )}
      </div>
    </div>
  );
}
