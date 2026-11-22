import { useEffect, useState, type ChangeEvent } from "react";
import { initialTechnologies } from "../data/initialTechnologies";
import type {
  NotificationData,
  PendingConfirmation,
  SortOrder,
  Technology,
} from "../types/technology";
import { downloadJson } from "../utils/downloadJson";
import {
  ALL_CATEGORIES,
  filterTechnologies,
  loadStoredSortOrder,
  loadStoredTechnologies,
  parseImportedTechnologies,
  sortTechnologies,
  titleExists,
} from "../utils/technologies";

// Se reexportan para no romper los imports existentes de los componentes.
export type { NotificationData, SortOrder, Technology };

const TECHNOLOGIES_KEY = "devspace-technologies";
const SORT_ORDER_KEY = "devspace-sort-order";

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>(() =>
    loadStoredTechnologies(localStorage.getItem(TECHNOLOGIES_KEY)),
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [sortOrder, setSortOrder] = useState<SortOrder>(() =>
    loadStoredSortOrder(localStorage.getItem(SORT_ORDER_KEY)),
  );
  const [notification, setNotification] = useState<NotificationData | null>(
    null,
  );

  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(
    null,
  );

  const [originalEditingTitle, setOriginalEditingTitle] = useState<
    string | null
  >(null);

  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation | null>(null);

  const [pendingImport, setPendingImport] = useState<Technology[] | null>(
    null,
  );

  useEffect(() => {
    localStorage.setItem(TECHNOLOGIES_KEY, JSON.stringify(technologies));
  }, [technologies]);

  useEffect(() => {
    localStorage.setItem(SORT_ORDER_KEY, sortOrder);
  }, [sortOrder]);

  const filteredTechnologies = filterTechnologies(
    technologies,
    search,
    categoryFilter,
  );

  const sortedTechnologies = sortTechnologies(filteredTechnologies, sortOrder);

  function handleAddTechnology(newTechnology: Technology) {
    if (titleExists(technologies, newTechnology.title)) {
      setNotification({
        message: "Esta tecnología ya está registrada.",
        type: "error",
      });
      return;
    }

    setTechnologies((currentTechnologies) => [
      ...currentTechnologies,
      newTechnology,
    ]);

    setNotification({
      message: "Tecnología agregada correctamente.",
      type: "success",
    });
  }

  function handleDeleteTechnology(title: string) {
    setPendingConfirmation({
      title: "Eliminar tecnología",
      message: `¿Estás seguro de que querés eliminar ${title}? Esta acción no se puede deshacer.`,
      action: "delete",
      technologyTitle: title,
    });
  }

  function handleEditTechnology(technology: Technology) {
    setEditingTechnology({ ...technology });
    setOriginalEditingTitle(technology.title);
  }

  function handleSaveEdit() {
    if (!editingTechnology || !originalEditingTitle) {
      return;
    }

    const cleanTitle = editingTechnology.title.trim();
    const cleanDescription = editingTechnology.description.trim();

    if (!cleanTitle || !cleanDescription) {
      setNotification({
        message: "Completá todos los campos.",
        type: "error",
      });
      return;
    }

    if (titleExists(technologies, cleanTitle, originalEditingTitle)) {
      setNotification({
        message: "Ya existe una tecnología con ese nombre.",
        type: "error",
      });
      return;
    }

    const updatedTechnology = {
      ...editingTechnology,
      title: cleanTitle,
      description: cleanDescription,
    };

    setTechnologies((currentTechnologies) =>
      currentTechnologies.map((technology) =>
        technology.title === originalEditingTitle
          ? updatedTechnology
          : technology,
      ),
    );

    setEditingTechnology(null);
    setOriginalEditingTitle(null);

    setNotification({
      message: "Cambios guardados correctamente.",
      type: "success",
    });
  }

  function handleCancelEdit() {
    setEditingTechnology(null);
    setOriginalEditingTitle(null);
  }

  function handleResetTechnologies() {
    setPendingConfirmation({
      title: "Restaurar tecnologías",
      message:
        "¿Querés restaurar todas las tecnologías originales? Se perderán los cambios actuales.",
      action: "reset",
    });
  }

  function handleConfirmAction() {
    if (!pendingConfirmation) {
      return;
    }

    if (pendingConfirmation.action === "delete") {
      const title = pendingConfirmation.technologyTitle;

      if (title) {
        setTechnologies((currentTechnologies) =>
          currentTechnologies.filter(
            (technology) => technology.title !== title,
          ),
        );

        setNotification({
          message: "Tecnología eliminada correctamente.",
          type: "success",
        });
      }
    } else {
      setTechnologies(initialTechnologies);

      setNotification({
        message: "Tecnologías originales restauradas.",
        type: "success",
      });
    }

    setPendingConfirmation(null);
  }

  function handleCancelConfirmation() {
    setPendingConfirmation(null);
  }

  function handleExportTechnologies() {
    downloadJson(technologies, "devspace-technologies.json");

    setNotification({
      message: "Tecnologías exportadas correctamente.",
      type: "success",
    });
  }

  function handleImportTechnologies(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      setNotification({
        message: "Seleccioná un archivo con extensión .json.",
        type: "error",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        setPendingImport(parseImportedTechnologies(reader.result as string));

        setNotification({
          message: "Archivo válido. Confirmá la importación para continuar.",
          type: "info",
        });
      } catch (error) {
        setNotification({
          message:
            error instanceof Error
              ? error.message
              : "No se pudo leer el archivo.",
          type: "error",
        });
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setNotification({
        message: "Ocurrió un error al leer el archivo.",
        type: "error",
      });
      event.target.value = "";
    };

    reader.readAsText(file);
  }

  function handleConfirmImport() {
    if (!pendingImport) {
      return;
    }

    setTechnologies(pendingImport);
    setPendingImport(null);
    setEditingTechnology(null);
    setOriginalEditingTitle(null);

    setNotification({
      message: "Tecnologías importadas correctamente.",
      type: "success",
    });
  }

  function handleCancelImport() {
    setPendingImport(null);
  }

  return {
    technologies,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    notification,
    setNotification,
    editingTechnology,
    setEditingTechnology,
    filteredTechnologies,
    handleAddTechnology,
    handleDeleteTechnology,
    handleEditTechnology,
    handleSaveEdit,
    handleCancelEdit,
    handleResetTechnologies,
    pendingConfirmation,
    handleConfirmAction,
    handleCancelConfirmation,
    sortOrder,
    setSortOrder,
    sortedTechnologies,
    handleExportTechnologies,
    pendingImport,
    handleImportTechnologies,
    handleConfirmImport,
    handleCancelImport,
  };
}
