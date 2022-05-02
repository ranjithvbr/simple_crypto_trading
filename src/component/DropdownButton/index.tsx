import { useState } from "react";
import "./dropDownButton.scss";

interface DropdownButtonparams {
  options: {
    id: number;
    value: string;
    disable?: boolean;
  }[];
  defaultvalue: string;
  customDropdownStyles?: string;
}

export default function DropdownButton({
  options,
  defaultvalue,
  customDropdownStyles,
}: DropdownButtonparams) {
  const [dropDownValue, setDropDownValue] = useState<string>("");

  const handleOptionsUpdate = (value: string) => {
    if (value === "Logout") {
      localStorage.clear();
      window.location.reload();
      return;
    }
    setDropDownValue(value);
  };
  return (
    <div className={`dropdown ${customDropdownStyles}`}>
      <div className="dropbtn">
        {dropDownValue || defaultvalue}
        <span>^</span>
      </div>
      <div className="dropdown-content">
        {options.map((label) => {
          return (
            <div
              onClick={
                label.disable
                  ? () => {}
                  : () => handleOptionsUpdate(label.value)
              }
              key={label.id}
            >
              {label.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
