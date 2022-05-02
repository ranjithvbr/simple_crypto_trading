import React, { useCallback, useState } from "react";
import "./input.scss";

interface InputParams {
  onChange: (e: string) => void;
  onBlur?: () => void;
  type?: "text" | "password";
  errMsg?: string;
  customInputStyle?: string;
  placeholder?: string;
}

export default function Input({
  onChange,
  onBlur,
  type = "text",
  errMsg,
  customInputStyle,
  placeholder,
}: InputParams) {
  const [value, setValue] = useState<string>("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let targetValue = e.target.value;
      setValue(targetValue);
      onChange(targetValue);
    },
    [onChange]
  );

  return (
    <div className={`inputContainer ${customInputStyle}`}>
      <input
        type={type}
        onChange={handleChange}
        value={value}
        onBlur={onBlur}
        placeholder={placeholder}
      />
      {errMsg && <span className="errmsg">{errMsg}</span>}
    </div>
  );
}
