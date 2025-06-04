import AlertConfig from "@/components/AlertConfig";
import TimeInput from "@/components/TimeInput";
import { useCallback, useState } from "react";

interface TimeSettingsProps {
  onTimeSet: (minutes: number, alerts: number[]) => void;
  disabled: boolean;
}

export function TimeSettings({ onTimeSet, disabled }: TimeSettingsProps) {
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(0);
  const [alert1Minutes, setAlert1Minutes] = useState(10);
  const [alert1Seconds, setAlert1Seconds] = useState(0);
  const [alert2Minutes, setAlert2Minutes] = useState(5);
  const [alert2Seconds, setAlert2Seconds] = useState(0);
  const [alert3Minutes, setAlert3Minutes] = useState(1);
  const [alert3Seconds, setAlert3Seconds] = useState(0);

  // ===
  // State for alerts
  const [alerts, setAlerts] = useState<{ time: number; triggered: boolean }[]>(
    []
  );
  const addAlert = useCallback(() => {
    if (alerts.length >= 3) return;

    const totalSeconds = minutes * 60 + seconds;

    // Default to halfway point if no alerts yet, otherwise after the last alert
    let defaultTime = Math.floor(totalSeconds / 2);
    if (alerts.length > 0) {
      const lastAlertTime = Math.max(...alerts.map((a) => a.time));
      defaultTime = Math.min(totalSeconds, lastAlertTime + 60);
    }

    setAlerts((prevAlerts) => [
      ...prevAlerts,
      {
        time: defaultTime,
        triggered: false,
      },
    ]);
  }, [alerts, minutes, seconds]);

  // Remove an alert
  const removeAlert = useCallback((time: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.time !== time)
    );
  }, []);

  // Update an alert
  const updateAlert = useCallback((time: number, newTime: number) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.time === time ? { ...alert, time: newTime } : alert
      )
    );
  }, []);

  // ===

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = minutes + seconds / 60;
    if (totalMinutes <= 0) {
      alert("⚠️ 時間は1秒以上設定してください");
      return;
    }

    const alert1Total = alert1Minutes + alert1Seconds / 60;
    const alert2Total = alert2Minutes + alert2Seconds / 60;
    const alert3Total = alert3Minutes + alert3Seconds / 60;

    const alerts = [alert1Total, alert2Total, alert3Total]
      .filter((alert) => alert > 0 && alert < totalMinutes)
      .sort((a, b) => b - a); // 降順でソート

    // アラート時間が重複していないかチェック
    const uniqueAlerts = [...new Set(alerts)];
    if (alerts.length !== uniqueAlerts.length) {
      alert("⚠️ アラート時間が重複しています。異なる時間を設定してください。");
      return;
    }

    onTimeSet(totalMinutes, alerts);
  };

  const presetTimes = [
    { label: "10分", minutes: 10, seconds: 0 },
    { label: "15分", minutes: 15, seconds: 0 },
    { label: "20分", minutes: 20, seconds: 0 },
    { label: "30分", minutes: 30, seconds: 0 },
  ];

  const handlePresetClick = (presetMinutes: number, presetSeconds: number) => {
    setMinutes(presetMinutes);
    setSeconds(presetSeconds);

    // プリセット時間に応じてアラートを自動設定
    const totalTime = presetMinutes + presetSeconds / 60;
    if (totalTime <= 5) {
      setAlert1Minutes(2);
      setAlert1Seconds(0);
      setAlert2Minutes(1);
      setAlert2Seconds(0);
      setAlert3Minutes(0);
      setAlert3Seconds(30);
    } else if (totalTime <= 15) {
      setAlert1Minutes(Math.floor(totalTime / 2));
      setAlert1Seconds(0);
      setAlert2Minutes(Math.floor(totalTime / 4));
      setAlert2Seconds(0);
      setAlert3Minutes(1);
      setAlert3Seconds(0);
    } else {
      setAlert1Minutes(10);
      setAlert1Seconds(0);
      setAlert2Minutes(5);
      setAlert2Seconds(0);
      setAlert3Minutes(1);
      setAlert3Seconds(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        プレゼンテーション時間設定
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                setMinutes(m);
                setSeconds(s);
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

        {/* 設定ボタン */}
        {/* TODO: 入力したタイミングで同期 */}
        <button
          type="submit"
          disabled={disabled || (minutes === 0 && seconds === 0)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <span>🚀</span>
          <span>タイマーを設定して開始</span>
        </button>
      </form>
    </div>
  );
}
