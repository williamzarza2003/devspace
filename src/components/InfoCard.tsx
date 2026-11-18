type InfoCardProps = {
  label: string;
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
};

function InfoCard({
  label,
  title,
  description,
  onEdit,
  onDelete,
}: InfoCardProps) {
  return (
    <article className="card">
      <div className="card-actions">
        <button
          className="icon-button edit-icon"
          type="button"
          onClick={onEdit}
          aria-label={`Editar ${title}`}
          title="Editar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
          </svg>
        </button>

        <button
          className="icon-button delete-icon"
          type="button"
          onClick={onDelete}
          aria-label={`Eliminar ${title}`}
          title="Eliminar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <span className="card-label">{label}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}

export default InfoCard;
