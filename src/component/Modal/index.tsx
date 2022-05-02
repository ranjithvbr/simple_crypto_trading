import "./modal.scss";

interface ModalParams {
  children: JSX.Element;
  modalVisible: boolean;
  closeModal: () => void;
}

export default function Modal({ children, modalVisible, closeModal }: ModalParams) {
  return (
    <>
      {modalVisible && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
