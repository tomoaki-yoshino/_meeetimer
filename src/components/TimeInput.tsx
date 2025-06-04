import React from "react";

interface TimeInputProps {
  minutes: number;
  seconds: number;
  onTimeChange: (minutes: number, seconds: number) => void;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
  minutes,
  seconds,
  onTimeChange,
  disabled = false,
}) => {
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      0,
      Math.min(59, Number.parseInt(e.target.value) || 0)
    );
    onTimeChange(value, seconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      0,
      Math.min(59, Number.parseInt(e.target.value) || 0)
    );
    onTimeChange(minutes, value);
  };

  return (
    <div className="flex items-center justify-center space-x-3 text-gray-400">
      <div className="text-center">
        <label className="flex items-end text-ms text-gray-500 gap-2">
          <input
            type="number"
            value={minutes}
            onChange={handleMinutesChange}
            min="0"
            max="59"
            className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
            disabled={disabled}
          />
          分
        </label>
      </div>
      <div className="text-center">
        <label className="flex items-end text-ms text-gray-500 gap-2">
          <input
            type="number"
            value={seconds}
            onChange={handleSecondsChange}
            min="0"
            max="59"
            className="w-16 px-2 py-2 text-lg font-medium text-center border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 bg-white"
            disabled={disabled}
          />
          秒
        </label>
      </div>
    </div>
  );
};

export default TimeInput;
