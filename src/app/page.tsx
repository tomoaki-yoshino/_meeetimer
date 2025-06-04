"use client";

import { useState } from "react";
import { TimerDisplay } from "@/components/TimerDisplay";
import { TimeInput } from "@/components/TimeInput";
import { TimerControls } from "@/components/TimerControls";
import { useTimer, type TimerSettings } from "@/hooks/useTimer";

export default function Home() {
  const [settings, setSettings] = useState<TimerSettings>({
    totalMinutes: 20,
    alerts: [10, 5, 1]
  });
  const [isSetupMode, setIsSetupMode] = useState(true);

  const timer = useTimer(settings);

  const handleTimeSet = (minutes: number, alerts: number[]) => {
    setSettings({ totalMinutes: minutes, alerts });
    setIsSetupMode(false);
  };

  const handleReset = () => {
    timer.reset();
    setIsSetupMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 Meeetimer
          </h1>
          <p className="text-gray-600">プレゼンテーション時間管理ツール</p>
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
              />

              <TimerControls
                isRunning={timer.isRunning}
                isPaused={timer.isPaused}
                onStart={timer.start}
                onPause={timer.pause}
                onResume={timer.resume}
                onReset={handleReset}
              />

              {/* アラート設定表示 */}
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
                      残り {alert} 分{timer.alertsTriggered.has(alert) && " ✓"}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  総時間: {settings.totalMinutes} 分
                </p>
              </div>
            </>
          )}
        </main>

        {/* フッター */}
        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>© 2024 Meeetimer - プレゼンテーション時間を効率的に管理</p>
        </footer>
      </div>
    </div>
  );
}
