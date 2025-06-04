interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  alerts: number[];
  alertsTriggered: Set<number>;
}

export function TimerDisplay({
  remainingSeconds,
  totalSeconds,
  isRunning,
  isPaused,
  alerts,
  alertsTriggered,
}: TimerDisplayProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const getColorClass = (): string => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-orange-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const getBgColorClass = (): string => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return "bg-red-100";
    if (percentage >= 75) return "bg-orange-100";
    if (percentage >= 50) return "bg-yellow-100";
    return "bg-green-100";
  };

  const getTextColorClass = (): string => {
    return getColorClass();
  };

  return (
    <div
      className={`rounded-lg transition-colors duration-500 px-8 py-6 ${getBgColorClass()}`}
    >
      {/* プログレスバー */}
      <div className="w-full rounded-full transition-all duration-1000 bg-gray-200 h-4 mb-6">
        <div
          className={`rounded-full transition-all duration-1000 h-4 ${
            getProgressPercentage() >= 90
              ? "bg-red-500"
              : getProgressPercentage() >= 75
                ? "bg-orange-500"
                : getProgressPercentage() >= 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* 時間表示 */}
      <div
        className={`font-mono font-bold text-center transition-colors duration-500 text-8xl ${getTextColorClass()}`}
      >
        {formatTime(remainingSeconds)}
      </div>

      {/* ステータス表示 */}
      <div className="text-center transition-all duration-300 mt-4">
        {isPaused && (
          <span className="inline-flex items-center px-3 py-1 rounded-full font-medium text-sm bg-yellow-200 text-yellow-800">
            一時停止中
          </span>
        )}
        {isRunning && !isPaused && (
          <span className="inline-flex items-center px-3 py-1 rounded-full font-medium text-sm bg-green-200 text-green-800">
            実行中
          </span>
        )}
        {!isRunning && (
          <span className="inline-flex items-center px-3 py-1 rounded-full font-medium text-sm bg-gray-200 text-gray-800">
            停止中
          </span>
        )}
      </div>

      {/* 残り時間の詳細情報 */}
      <div className="text-center mt-4 text-gray-600">
        <p className="text-sm">
          経過時間: {formatTime(totalSeconds - remainingSeconds)}
        </p>
      </div>

      {/* TODO: バーに重ねて表示 */}
      <h3 className="text-sm font-semibold mb-2 text-gray-800">アラート設定</h3>
      <div className="flex flex-wrap gap-2">
        {alerts.map((alert) => (
          <span
            key={alert}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              alertsTriggered.has(alert)
                ? "bg-red-200 text-red-800"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            残り {alert} 秒{alertsTriggered.has(alert) && " ✓"}
          </span>
        ))}
      </div>
    </div>
  );
}
