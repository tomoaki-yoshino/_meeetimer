import { useState } from "react";

interface TimeInputProps {
  onTimeSet: (minutes: number, alerts: number[]) => void;
  disabled: boolean;
}

export function TimeInput({ onTimeSet, disabled }: TimeInputProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(20);
  const [alert1, setAlert1] = useState(10);
  const [alert2, setAlert2] = useState(5);
  const [alert3, setAlert3] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes <= 0) {
      alert("時間は1分以上設定してください");
      return;
    }

    const alerts = [alert1, alert2, alert3]
      .filter((alert) => alert > 0 && alert < totalMinutes)
      .sort((a, b) => b - a); // 降順でソート

    onTimeSet(totalMinutes, alerts);
  };

  const presetTimes = [
    { label: "5分", minutes: 5 },
    { label: "10分", minutes: 10 },
    { label: "15分", minutes: 15 },
    { label: "20分", minutes: 20 },
    { label: "30分", minutes: 30 },
    { label: "45分", minutes: 45 },
    { label: "60分", minutes: 60 }
  ];

  const handlePresetClick = (presetMinutes: number) => {
    const presetHours = Math.floor(presetMinutes / 60);
    const remainingMinutes = presetMinutes % 60;
    setHours(presetHours);
    setMinutes(remainingMinutes);

    // プリセット時間に応じてアラートを自動設定
    if (presetMinutes <= 5) {
      setAlert1(2);
      setAlert2(1);
      setAlert3(0);
    } else if (presetMinutes <= 15) {
      setAlert1(Math.floor(presetMinutes / 2));
      setAlert2(Math.floor(presetMinutes / 4));
      setAlert3(1);
    } else {
      setAlert1(10);
      setAlert2(5);
      setAlert3(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        プレゼンテーション時間設定
      </h2>

      {/* プリセットボタン */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          クイック設定
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {presetTimes.map((preset) => (
            <button
              key={preset.minutes}
              type="button"
              onClick={() => handlePresetClick(preset.minutes)}
              disabled={disabled}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 時間設定 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">詳細設定</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="hours"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                時間
              </label>
              <input
                type="number"
                id="hours"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="minutes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                分
              </label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* アラート設定 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            アラート設定{" "}
            <span className="text-sm font-normal text-gray-500">
              (残り時間, 分)
            </span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="alert1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                1回目
              </label>
              <input
                type="number"
                id="alert1"
                min="0"
                value={alert1}
                onChange={(e) => setAlert1(parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="alert2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                2回目
              </label>
              <input
                type="number"
                id="alert2"
                min="0"
                value={alert2}
                onChange={(e) => setAlert2(parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="alert3"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                3回目
              </label>
              <input
                type="number"
                id="alert3"
                min="0"
                value={alert3}
                onChange={(e) => setAlert3(parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            0を入力するとそのアラートは無効になります
          </p>
        </div>

        {/* 設定ボタン */}
        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          タイマーを設定
        </button>
      </form>
    </div>
  );
}
