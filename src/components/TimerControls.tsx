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
  onReset,
}: TimerControlsProps) {
  return (
    <div className="space-y-4">
      {/* メインコントロール */}
      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <button
            type="button"
            onClick={onStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
          >
            ▶️ スタート
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                type="button"
                onClick={onResume}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                ▶️ 再開
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                ⏸️ 一時停止
              </button>
            )}
          </>
        )}

        <button
          type="button"
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
        >
          🔄 リセット
        </button>
      </div>

      {/* キーボードショートカットヘルプ */}

      <div className="text-center">
        <details className="inline-block">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            ⌨️ キーボードショートカット
          </summary>
          <div className="mt-2 p-3 bg-white rounded-lg shadow-sm text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-2 text-left">
              <div>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                  Space/Enter
                </kbd>{" "}
                スタート/一時停止
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">P</kbd>{" "}
                一時停止
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                  Esc
                </kbd>{" "}
                リセット
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">
                  F11
                </kbd>{" "}
                全画面切り替え
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
