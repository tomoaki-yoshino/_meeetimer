import { useState } from "react";

interface TimeInputProps {
  onTimeSet: (minutes: number, alerts: number[]) => void;
  disabled: boolean;
}

export function TimeInput({ onTimeSet, disabled }: TimeInputProps) {
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(0);
  const [alert1Minutes, setAlert1Minutes] = useState(10);
  const [alert1Seconds, setAlert1Seconds] = useState(0);
  const [alert2Minutes, setAlert2Minutes] = useState(5);
  const [alert2Seconds, setAlert2Seconds] = useState(0);
  const [alert3Minutes, setAlert3Minutes] = useState(1);
  const [alert3Seconds, setAlert3Seconds] = useState(0);

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
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center flex items-center justify-center">
            <span className="mr-2">⏱️</span>
            プレゼンテーション時間
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <label
                htmlFor="minutes"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                分
              </label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="999"
                value={minutes}
                onChange={(e) => {
                  const value = Math.max(
                    0,
                    Math.min(999, Number.parseInt(e.target.value) || 0)
                  );
                  setMinutes(value);
                }}
                disabled={disabled}
                className="w-20 px-2 py-4 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white shadow-sm"
                placeholder="20"
              />
              <div className="text-xs text-gray-500 mt-1">0-999</div>
            </div>
            <div className="text-4xl font-bold text-blue-600 pt-8">:</div>
            <div className="text-center">
              <label
                htmlFor="seconds"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                秒
              </label>
              <input
                type="number"
                id="seconds"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => {
                  const value = Math.max(
                    0,
                    Math.min(59, Number.parseInt(e.target.value) || 0)
                  );
                  setSeconds(value);
                }}
                disabled={disabled}
                className="w-20 px-2 py-4 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white shadow-sm"
                placeholder="0"
              />
              <div className="text-xs text-gray-500 mt-1">0-59</div>
            </div>
          </div>
          <div className="text-center mt-4 p-3 bg-white rounded-md border border-blue-300">
            <span className="text-lg font-medium text-blue-800">
              総時間: {minutes}分{seconds > 0 ? `${seconds}秒` : ""}
            </span>
            <span className="text-sm text-blue-600 block mt-1">
              ({Math.floor(minutes + seconds / 60)}分
              {Math.floor(((minutes + seconds / 60) % 1) * 60)}秒)
            </span>
          </div>
        </div>

        {/* アラート設定 */}
        <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span className="mr-2">🔔</span>
            アラート設定
            <span className="text-sm font-normal text-gray-600 ml-2">
              (残り時間で通知)
            </span>
          </h3>
          <div className="grid gap-4">
            {/* 1回目アラート */}
            <div className="bg-white p-4 rounded-lg border border-yellow-300">
              <span className="block text-sm font-medium text-gray-700 mb-3">
                1回目アラート
              </span>
              <div className="flex items-center justify-center space-x-3">
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={alert1Minutes}
                    onChange={(e) =>
                      setAlert1Minutes(
                        Math.max(0, Number.parseInt(e.target.value) || 0)
                      )
                    }
                    disabled={disabled}
                    className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-1">分</div>
                </div>
                <div className="text-xl font-bold text-yellow-600">:</div>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={alert1Seconds}
                    onChange={(e) =>
                      setAlert1Seconds(
                        Math.max(
                          0,
                          Math.min(59, Number.parseInt(e.target.value) || 0)
                        )
                      )
                    }
                    disabled={disabled}
                    className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-1">秒</div>
                </div>
                <span className="text-sm text-gray-500">前</span>
              </div>
            </div>

            {/* 2回目アラート */}
            <div className="bg-white p-4 rounded-lg border border-yellow-300">
              <span className="block text-sm font-medium text-gray-700 mb-3">
                2回目アラート
              </span>
              <div className="flex items-center justify-center space-x-3">
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={alert2Minutes}
                    onChange={(e) =>
                      setAlert2Minutes(
                        Math.max(0, Number.parseInt(e.target.value) || 0)
                      )
                    }
                    disabled={disabled}
                    className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-1">分</div>
                </div>
                <div className="text-xl font-bold text-yellow-600">:</div>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={alert2Seconds}
                    onChange={(e) =>
                      setAlert2Seconds(
                        Math.max(
                          0,
                          Math.min(59, Number.parseInt(e.target.value) || 0)
                        )
                      )
                    }
                    disabled={disabled}
                    className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-1">秒</div>
                </div>
                <span className="text-sm text-gray-500">前</span>
              </div>
            </div>

            {/* 3回目アラート */}
            <div className="bg-white p-4 rounded-lg border border-yellow-300">
              <span className="block text-sm font-medium text-gray-700 mb-3">
                3回目アラート
              </span>
              <div className="flex items-center justify-center space-x-3">
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={alert3Minutes}
                    onChange={(e) =>
                      setAlert3Minutes(
                        Math.max(0, Number.parseInt(e.target.value) || 0)
                      )
                    }
                    disabled={disabled}
                    className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-1">分</div>
                </div>
                <div className="text-xl font-bold text-yellow-600">:</div>
                <div className="text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={alert3Seconds}
                    onChange={(e) =>
                      setAlert3Seconds(
                        Math.max(
                          0,
                          Math.min(59, Number.parseInt(e.target.value) || 0)
                        )
                      )
                    }
                    disabled={disabled}
                    className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-1">秒</div>
                </div>
                <span className="text-sm text-gray-500">前</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center bg-white p-2 rounded border">
            💡 0分0秒を入力するとそのアラートは無効になります
          </p>
        </div>

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
