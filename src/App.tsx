import { useCallback } from "react";
import "./App.css";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import InfoCard from "./components/InfoCard";
import Counter from "./components/Counter";
import TechnologyForm from "./components/TechnologyForm";
import EditTechnologyForm from "./components/EditTechnologyForm";
import TechnologyFilters from "./components/TechnologyFilters";
import Notification from "./components/Notification";
import ConfirmModal from "./components/ConfirmModal";
import DashboardStats from "./components/DashboardStats";

import { useTechnologies } from "./hooks/useTechnologies";

function App() {
  const {
    technologies,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    sortOrder,
    setSortOrder,
    sortedTechnologies,
    editingTechnology,
    setEditingTechnology,
    filteredTechnologies,
    handleAddTechnology,
    handleDeleteTechnology,
    handleEditTechnology,
    handleSaveEdit,
    handleCancelEdit,
    handleResetTechnologies,
    notification,
    setNotification,
    pendingConfirmation,
    handleConfirmAction,
    handleCancelConfirmation,
    handleExportTechnologies,
    pendingImport,
    handleImportTechnologies,
    handleConfirmImport,
    handleCancelImport,
  } = useTechnologies();

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, [setNotification]);

  return (
    <>
      <main className="dashboard">
        <Header />

        <Welcome />
        <DashboardStats technologies={technologies} />

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleCloseNotification}
          />
        )}

        <div className="toolbar">
          <TechnologyForm onAdd={handleAddTechnology} />

          <div className="toolbar-actions">
            <button
              className="export-button"
              type="button"
              onClick={handleExportTechnologies}
            >
              <span>↓</span> Exportar JSON
            </button>

            <input
              id="import-json"
              type="file"
              accept=".json,application/json"
              onChange={handleImportTechnologies}
              style={{ display: "none" }}
            />

            <label htmlFor="import-json" className="export-button">
              <span>↑</span> Importar JSON
            </label>

            <button
              className="reset-button"
              type="button"
              onClick={handleResetTechnologies}
            >
              Restaurar valores predeterminados
            </button>
          </div>
        </div>

        <div className="section-heading">
          <h2>Mis tecnologías</h2>

          <span className="technology-count">
            {filteredTechnologies.length} de {technologies.length} registradas
          </span>
        </div>

        <TechnologyFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <div className="sort-control">
          <label htmlFor="technology-sort">Ordenar tecnologías</label>

          <div className="sort-select-wrapper">
            <select
              id="technology-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="default">Orden original</option>
              <option value="az">Nombre: A → Z</option>
              <option value="za">Nombre: Z → A</option>
              <option value="category">Categoría</option>
            </select>
          </div>
        </div>

        {editingTechnology && (
          <EditTechnologyForm
            technology={editingTechnology}
            onChange={setEditingTechnology}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}

        <section className="cards">
          {filteredTechnologies.length > 0 ? (
            sortedTechnologies.map((technology) => (
              <InfoCard
                key={technology.title}
                label={technology.label}
                title={technology.title}
                description={technology.description}
                onEdit={() => handleEditTechnology(technology)}
                onDelete={() => handleDeleteTechnology(technology.title)}
              />
            ))
          ) : (
            <div className="empty-state">
              {technologies.length === 0 ? (
                <>
                  <h3>Tu espacio está vacío</h3>
                  <p>
                    Todavía no agregaste tecnologías. ¡Incorporá tu primera
                    herramienta para comenzar!
                  </p>
                </>
              ) : (
                <>
                  <h3>No encontramos resultados</h3>
                  <p>
                    No hay tecnologías que coincidan con tu búsqueda o
                    categoría. Probá con otros términos o filtros.
                  </p>
                </>
              )}
            </div>
          )}
        </section>

        <Counter />

        <footer>Mi primer proyecto · React + TypeScript</footer>
      </main>

      {pendingConfirmation && (
        <ConfirmModal
          title={pendingConfirmation.title}
          message={pendingConfirmation.message}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelConfirmation}
        />
      )}

      {pendingImport && (
        <ConfirmModal
          title="Importar tecnologías"
          message={`Se reemplazarán tus tecnologías actuales por ${pendingImport.length} tecnologías del archivo. ¿Deseás continuar?`}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      )}
    </>
  );
}

export default App;
