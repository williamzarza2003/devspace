import type { Technology } from "../hooks/useTechnologies";

type EditTechnologyFormProps = {
  technology: Technology;
  onChange: (technology: Technology) => void;
  onSave: () => void;
  onCancel: () => void;
};

function EditTechnologyForm({
  technology,
  onChange,
  onSave,
  onCancel,
}: EditTechnologyFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave();
  }

  return (
    <section className="edit-form-panel">
      <h2>Editar tecnología</h2>

      <form className="edit-form" onSubmit={handleSubmit}>
        <label htmlFor="edit-title">Nombre</label>
        <input
          id="edit-title"
          type="text"
          value={technology.title}
          onChange={(event) =>
            onChange({
              ...technology,
              title: event.target.value,
            })
          }
          required
        />

        <label htmlFor="edit-label">Categoría</label>
        <select
          id="edit-label"
          value={technology.label}
          onChange={(event) =>
            onChange({
              ...technology,
              label: event.target.value,
            })
          }
        >
          <option value="LENGUAJE">Lenguaje</option>
          <option value="FRAMEWORK">Framework</option>
          <option value="HERRAMIENTA">Herramienta</option>
          <option value="BASE DE DATOS">Base de datos</option>
        </select>

        <label htmlFor="edit-description">Descripción</label>
        <input
          id="edit-description"
          type="text"
          value={technology.description}
          onChange={(event) =>
            onChange({
              ...technology,
              description: event.target.value,
            })
          }
          required
        />

        <div className="edit-form-actions">
          <button type="submit">Guardar cambios</button>

          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditTechnologyForm;
