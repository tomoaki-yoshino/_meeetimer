interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset
}: TimerControlsProps) {
  return (
    <div className="flex justify-center space-x-4">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
        >
          ▶️ スタート
        </button>
      ) : (
        <>
          {isPaused ? (
            <button
              onClick={onResume}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              ▶️ 再開
            </button>
          ) : (
            <button
              onClick={onPause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              ⏸️ 一時停止
            </button>
          )}
        </>
      )}

      <button
        onClick={onReset}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
      >
        🔄 リセット
      </button>
    </div>
  );
}
