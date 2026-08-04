// hooks/useOTPInput.jsx
import { useState } from "react";

export function useOTPInput() {
  const [otp, setOtp] = useState("");

  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function FakeCaret() {
    return (
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse">
        <div className="w-0.5 h-4 min-[270px]:h-8 bg-cyan-500" />
      </div>
    );
  }

  function Slot({ char, isActive, hasFakeCaret, index, otp, setOtp }) {
    const handleChange = (e) => {
      const val = e.target.value;
      if (val && !/^\d$/.test(val)) {
        e.target.value = "";
        return;
      }
      const newOtp = otp.split("");
      newOtp[index] = val;
      setOtp(newOtp.join(""));
    };

    const handleKeyDown = (e) => {
      if (e.key.length === 1 && !/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      if (e.key === "Backspace" && !char && index > 0) {
        const prevInput = document.querySelector(
          `[data-otp-index="${index - 1}"]`
        );
        if (prevInput) prevInput.focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      if (/^\d+$/.test(pasted) && pasted.length <= 6) {
        const newOtp = pasted.padEnd(6, "").slice(0, 6);
        setOtp(newOtp);
        document
          .querySelectorAll("[data-otp-index]")
          .forEach((el) => el.blur());
      }
    };

    return (
      <div
        className={cn(
          "relative w-12 h-14 text-2xl",
          "flex items-center justify-center",
          "transition-all duration-300",
          "border-2 border-gray-300 dark:border-gray-700",
          "first:rounded-l-lg last:rounded-r-lg",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-white",
          "font-semibold",
          isActive && "border-cyan-500 ring-2 ring-cyan-500/20"
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={char || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="absolute inset-0 w-full h-full bg-transparent text-center text-2xl font-semibold outline-none text-gray-900 dark:text-white"
          autoComplete="one-time-code"
          data-otp-index={index}
        />
        {hasFakeCaret && <FakeCaret />}
      </div>
    );
  }

  return {
    otp,
    setOtp,
    Slot,
    cn,
    FakeCaret,
  };
}