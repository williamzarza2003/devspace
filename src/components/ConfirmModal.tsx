type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <section
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-icon">!</div>

        <h2 id="modal-title">{title}</h2>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>
            Cancelar
          </button>

          <button className="modal-confirm" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmModal;
