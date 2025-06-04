import TimeInput from "@/components/TimeInput";
import React from "react";

interface AlertConfigProps {
  alerts: number[];
  onAddAlert: () => void;
  onRemoveAlert: (time: number) => void;
  onUpdateAlert: (time: number, newTime: number) => void;
  maxTime: number;
  disabled: boolean;
}

const AlertConfig: React.FC<AlertConfigProps> = ({
  alerts,
  onAddAlert,
  onRemoveAlert,
  onUpdateAlert,
  maxTime,
  disabled,
}) => {
  const formatTimeFromSeconds = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return {
      minutes: m,
      seconds: s,
    };
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🔔</span>
          アラート設定
          <span className="text-sm font-normal text-gray-600 ml-2">
            (残り時間で通知)
          </span>
        </h3>
        {alerts.length < 3 && (
          <button
            type="button"
            onClick={onAddAlert}
            className="flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors"
            disabled={alerts.length >= 3}
          >
            {/* <Plus size={16} className="mr-1" /> */}
            アラートを追加
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-6 text-gray-500 bg-white rounded-lg">
          <p>アラートが設定されていません</p>
          <button
            type="button"
            onClick={onAddAlert}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            最初のアラートを追加
          </button>
        </div>
      ) : (
        <ul className="grid gap-4">
          {alerts.map((alertTime, key) => {
            const { minutes, seconds } = formatTimeFromSeconds(alertTime);
            return (
              <li
                key={alertTime}
                className="bg-white p-4 rounded-lg border border-yellow-300 flex justify-between items-center"
              >
                <span className="text-sm font-medium text-gray-700">
                  {key + 1}回目
                </span>
                <div className="flex items-end">
                  <TimeInput
                    minutes={minutes}
                    seconds={seconds}
                    onTimeChange={(m, s) => {
                      const newTime = m * 60 + s;
                      if (newTime <= maxTime) {
                        onUpdateAlert(alertTime, newTime);
                      }
                    }}
                    disabled={disabled}
                  />
                  <span className="text-ms text-gray-500">前</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAlert(alertTime)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove alert"
                  disabled={disabled}
                >
                  {/* <Trash2 size={16} /> */}✖
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {alerts.length === 3 && (
        <p className="text-xs text-gray-500 mt-2">登録上限に達しました</p>
      )}
    </div>
  );
};

export default AlertConfig;
