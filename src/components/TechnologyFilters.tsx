type TechnologyFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
};

function TechnologyFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: TechnologyFiltersProps) {
  return (
    <div className="search-panel">
      <input
        type="search"
        placeholder="Buscar tecnología..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Buscar tecnología"
      />

      <select
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filtrar por categoría"
      >
        <option value="TODAS">Todas las categorías</option>
        <option value="LENGUAJE">Lenguajes</option>
        <option value="FRAMEWORK">Frameworks</option>
        <option value="HERRAMIENTA">Herramientas</option>
        <option value="BASE DE DATOS">Bases de datos</option>
      </select>
    </div>
  );
}

export default TechnologyFilters;
