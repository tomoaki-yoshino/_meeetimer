interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isFullscreen?: boolean;
}

export function TimerDisplay({
  remainingSeconds,
  totalSeconds,
  isRunning,
  isPaused,
  isFullscreen = false,
}: TimerDisplayProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
    if (isFullscreen) return "bg-transparent";
    const percentage = getProgressPercentage();
    if (percentage >= 90) return "bg-red-100";
    if (percentage >= 75) return "bg-orange-100";
    if (percentage >= 50) return "bg-yellow-100";
    return "bg-green-100";
  };

  const getTextColorClass = (): string => {
    if (isFullscreen) {
      const percentage = getProgressPercentage();
      if (percentage >= 90) return "text-red-400";
      if (percentage >= 75) return "text-orange-400";
      if (percentage >= 50) return "text-yellow-400";
      return "text-green-400";
    }
    return getColorClass();
  };

  return (
    <div
      className={`rounded-lg transition-colors duration-500 ${
        isFullscreen ? "p-16" : "p-8"
      } ${getBgColorClass()}`}
    >
      {/* プログレスバー */}
      <div
        className={`w-full rounded-full transition-all duration-1000 ${
          isFullscreen ? "bg-gray-800 h-8 mb-12" : "bg-gray-200 h-4 mb-6"
        }`}
      >
        <div
          className={`rounded-full transition-all duration-1000 ${
            isFullscreen ? "h-8" : "h-4"
          } ${
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
        className={`font-mono font-bold text-center transition-colors duration-500 ${
          isFullscreen ? "text-9xl" : "text-8xl"
        } ${getTextColorClass()}`}
      >
        {formatTime(remainingSeconds)}
      </div>

      {/* ステータス表示 */}
      <div
        className={`text-center transition-all duration-300 ${
          isFullscreen ? "mt-8" : "mt-4"
        }`}
      >
        {isPaused && (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${
              isFullscreen
                ? "text-lg bg-yellow-900 text-yellow-200"
                : "text-sm bg-yellow-200 text-yellow-800"
            }`}
          >
            一時停止中
          </span>
        )}
        {isRunning && !isPaused && (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${
              isFullscreen
                ? "text-lg bg-green-900 text-green-200"
                : "text-sm bg-green-200 text-green-800"
            }`}
          >
            実行中
          </span>
        )}
        {!isRunning && (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${
              isFullscreen
                ? "text-lg bg-gray-800 text-gray-200"
                : "text-sm bg-gray-200 text-gray-800"
            }`}
          >
            停止中
          </span>
        )}
      </div>

      {/* 残り時間の詳細情報 */}
      {!isFullscreen && (
        <div className="text-center mt-4 text-gray-600">
          <p className="text-sm">
            経過時間: {formatTime(totalSeconds - remainingSeconds)} / 総時間:{" "}
            {formatTime(totalSeconds)}
          </p>
          <p className="text-sm mt-1">
            進捗: {getProgressPercentage().toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
