import AlertConfig from "@/components/AlertConfig";
import TimeInput from "@/components/TimeInput";
import { TimerSettings } from "@/hooks/useTimer";
import { useCallback } from "react";

interface TimeSettingsProps {
  queryState: TimerSettings;
  onTimeSet: <K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => void;
  disabled: boolean;
}

export function TimeSettings({
  queryState: { totalSeconds, alerts },
  onTimeSet,
  disabled,
}: TimeSettingsProps) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (totalSeconds <= 0) {
    alert("⚠️ 時間は1秒以上設定してください");
    return;
  }

  const addAlert = useCallback(() => {
    if (alerts.length >= 3) return;

    const totalSeconds = minutes * 60 + seconds;

    // Default to halfway point if no alerts yet, otherwise after the last alert
    let defaultTime = Math.floor(totalSeconds / 2);
    if (alerts.length > 0) {
      const lastAlertTime = Math.max(...alerts);
      defaultTime = Math.min(totalSeconds, lastAlertTime + 60);
    }

    const newAlerts = [...alerts, defaultTime];
    const _newAlerts = newAlerts
      .filter((alert) => alert > 0 && alert < totalSeconds)
      .sort((a, b) => b - a); // 降順でソート

    // アラート時間が重複していないかチェック
    const uniqueAlerts = [...new Set(_newAlerts)];

    onTimeSet("alerts", uniqueAlerts);
  }, [alerts, minutes, seconds, onTimeSet]);

  // Remove an alert
  const removeAlert = useCallback(
    (time: number) => {
      const newAlerts = alerts.filter((alertTime) => alertTime !== time);
      const _newAlerts = newAlerts
        .filter((alert) => alert > 0 && alert < totalSeconds)
        .sort((a, b) => b - a); // 降順でソート

      // アラート時間が重複していないかチェック
      const uniqueAlerts = [...new Set(_newAlerts)];

      onTimeSet("alerts", uniqueAlerts);
    },
    [alerts, totalSeconds, onTimeSet]
  );

  // Update an alert
  const updateAlert = useCallback(
    (time: number, newTime: number) => {
      const newAlerts = alerts.map((alertTime) =>
        alertTime === time ? newTime : alertTime
      );
      const _newAlerts = newAlerts
        .filter((alert) => alert > 0 && alert < totalSeconds)
        .sort((a, b) => b - a); // 降順でソート

      // アラート時間が重複していないかチェック
      const uniqueAlerts = [...new Set(_newAlerts)];

      onTimeSet("alerts", uniqueAlerts);
    },
    [alerts, totalSeconds, onTimeSet]
  );

  const presetTimes = [
    { label: "10分", minutes: 10, seconds: 0 },
    { label: "15分", minutes: 15, seconds: 0 },
    { label: "20分", minutes: 20, seconds: 0 },
    { label: "30分", minutes: 30, seconds: 0 },
  ];

  const handlePresetClick = (presetMinutes: number, presetSeconds: number) => {
    const totalSeconds = presetMinutes * 60 + presetSeconds;

    if (totalSeconds <= 0) {
      alert("⚠️ 時間は1秒以上設定してください");
      return;
    }

    // アラートを自動設定
    const newAlerts = [
      totalSeconds - 10 * 60,
      totalSeconds - 5 * 60,
      totalSeconds - 1 * 60,
    ].filter((alert) => alert > 0 && alert < totalSeconds);

    onTimeSet("totalSeconds", totalSeconds);
    onTimeSet("alerts", newAlerts);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        プレゼンテーション時間設定
      </h2>

      <form className="space-y-6">
        {/* 時間設定 */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 text-gray-400">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
            <span className="mr-2">⏱️</span>
            プレゼンテーション時間
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <TimeInput
              minutes={minutes}
              seconds={seconds}
              onTimeChange={(m, s) => {
                onTimeSet("totalSeconds", m * 60 + s);
              }}
              disabled={disabled}
            />
          </div>
        </div>

        {/* アラート設定 */}
        <AlertConfig
          alerts={alerts}
          onAddAlert={addAlert}
          onRemoveAlert={removeAlert}
          onUpdateAlert={updateAlert}
          maxTime={minutes * 60 + seconds}
          disabled={disabled}
        />

        {/* プリセットボタン */}
        <div className="bg-green-50 rounded-lg p-5 border border-green-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span className="mr-2">⚡</span>
            クイック設定
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {presetTimes.map((preset) => (
              <button
                key={`${preset.minutes}-${preset.seconds}`}
                type="button"
                onClick={() =>
                  handlePresetClick(preset.minutes, preset.seconds)
                }
                disabled={disabled}
                className="px-4 py-3 text-sm font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200 active:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-green-300 hover:border-green-400"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            👆 ワンクリックで時間とアラートを自動設定
          </p>
        </div>
      </form>
    </div>
  );
}
