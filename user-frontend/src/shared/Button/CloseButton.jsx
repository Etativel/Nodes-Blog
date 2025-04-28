import { XIcon } from "../../assets/svg";

function CloseButton({ onClick }) {
  return (
    <button className="close-dialog-btn" onClick={onClick}>
      <XIcon stroke="currentColor" strokeWidth={1} className="x-logo" />
    </button>
  );
}

export default CloseButton;
