interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export function TimerDisplay({
  remainingSeconds,
  totalSeconds,
  isRunning,
  isPaused
}: TimerDisplayProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
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

  return (
    <div
      className={`rounded-lg p-8 transition-colors duration-500 ${getBgColorClass()}`}
    >
      {/* プログレスバー */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ${
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
        className={`text-8xl font-mono font-bold text-center transition-colors duration-500 ${getColorClass()}`}
      >
        {formatTime(remainingSeconds)}
      </div>

      {/* ステータス表示 */}
      <div className="text-center mt-4">
        {isPaused && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800">
            一時停止中
          </span>
        )}
        {isRunning && !isPaused && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
            実行中
          </span>
        )}
        {!isRunning && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
            停止中
          </span>
        )}
      </div>

      {/* 残り時間の詳細情報 */}
      <div className="text-center mt-4 text-gray-600">
        <p className="text-sm">
          経過時間: {formatTime(totalSeconds - remainingSeconds)} / 総時間:{" "}
          {formatTime(totalSeconds)}
        </p>
        <p className="text-sm mt-1">
          進捗: {getProgressPercentage().toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
