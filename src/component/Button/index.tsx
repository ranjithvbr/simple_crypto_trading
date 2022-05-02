import "./button.scss";

interface ButtonParams {
  label: string;
  onClick: () => void;
  customStyle?: string;
}

export default function Button({ label, onClick, customStyle }: ButtonParams) {
  return (
    <button className={`buttonStyle ${customStyle}`} onClick={onClick}>
      {label}
    </button>
  );
}
