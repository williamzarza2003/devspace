import { useState } from 'react'

type NewTechnology = {
  label: string
  title: string
  description: string
}

type TechnologyFormProps = {
  onAdd: (technology: NewTechnology) => void
}

function TechnologyForm({ onAdd }: TechnologyFormProps) {
  const [title, setTitle] = useState('')
  const [label, setLabel] = useState('LENGUAJE')
  const [description, setDescription] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      return
    }

    onAdd({
      label,
      title: title.trim(),
      description: description.trim(),
    })

    setTitle('')
    setLabel('LENGUAJE')
    setDescription('')
  }

  return (
    <section className="form-panel">
      <h2>Agregar tecnología</h2>
      <p>Incorporá una nueva herramienta a tu espacio de desarrollo.</p>

      <form className="technology-form" onSubmit={handleSubmit}>
        <label htmlFor="technology-title">Nombre</label>
        <input
          id="technology-title"
          type="text"
          placeholder="Ej.: Java"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="technology-label">Categoría</label>
        <select
          id="technology-label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
        >
          <option value="LENGUAJE">Lenguaje</option>
          <option value="FRAMEWORK">Framework</option>
          <option value="HERRAMIENTA">Herramienta</option>
          <option value="BASE DE DATOS">Base de datos</option>
        </select>

        <label htmlFor="technology-description">Descripción</label>
        <input
          id="technology-description"
          type="text"
          placeholder="Ej.: Desarrollo de aplicaciones"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <button type="submit">Agregar tecnología</button>
      </form>
    </section>
  )
}

export default TechnologyForm
