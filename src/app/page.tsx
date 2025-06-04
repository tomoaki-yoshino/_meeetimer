"use client";

import { TimeSettings } from "@/components/TimeSettings";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
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

  const timer = useTimer(settings);

  const handleTimeSet = (minutes: number, alerts: number[]) => {
    const newSettings = { totalMinutes: minutes, alerts };
    setSettings(newSettings);
    setSavedSettings(newSettings);
  };

  const handleReset = () => {
    timer.reset();
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
  });

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center transition-all duration-300 py-8">
          <h1 className="font-bold mb-2 transition-all duration-300 text-4xl text-gray-800">
            🎯 Meeetimer
          </h1>
          <p className="text-gray-600">プレゼンテーション時間管理ツール</p>
        </header>

        {/* メインコンテンツ */}
        <main className="space-y-8">
          <>
            <TimerDisplay
              remainingSeconds={timer.remainingSeconds}
              totalSeconds={settings.totalMinutes * 60}
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              alerts={settings.alerts}
              alertsTriggered={timer.alertsTriggered}
            />
            <TimerControls
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              onStart={timer.start}
              onPause={timer.pause}
              onResume={timer.resume}
              onReset={handleReset}
            />
            <TimeSettings
              onTimeSet={handleTimeSet}
              disabled={timer.isRunning}
            />
          </>
        </main>

        {/* フッター */}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>© 2025 Meeetimer - プレゼンテーション時間を効率的に管理</p>
        </footer>
      </div>
    </div>
  );
}
