import { useEffect, useState, type ChangeEvent } from "react";

export type Technology = {
  label: string;
  title: string;
  description: string;
};

export type NotificationData = {
  message: string;
  type: "success" | "error" | "info";
};

type PendingConfirmation = {
  title: string;
  message: string;
  action: "delete" | "reset";
  technologyTitle?: string;
};

type PendingImport = Technology[];

const initialTechnologies: Technology[] = [
  {
    label: "FRAMEWORK",
    title: "React",
    description: "Interfaces interactivas",
  },
  {
    label: "LENGUAJE",
    title: "TypeScript",
    description: "JavaScript con tipos",
  },
  {
    label: "HERRAMIENTA",
    title: "Vite",
    description: "Desarrollo rápido",
  },
  {
    label: "LENGUAJE",
    title: "Python",
    description: "Automatización y desarrollo",
  },
  {
    label: "LENGUAJE",
    title: "Java",
    description: "Desarrollo de aplicaciones",
  },
  {
    label: "LENGUAJE",
    title: "C++",
    description: "Programación de propósito general",
  },
];

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>(() => {
    const savedTechnologies = localStorage.getItem("devspace-technologies");

    if (savedTechnologies) {
      try {
        return JSON.parse(savedTechnologies) as Technology[];
      } catch {
        return initialTechnologies;
      }
    }

    return initialTechnologies;
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("TODAS");
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("devspace-sort-order") || "default";
  });
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

  const [pendingImport, setPendingImport] = useState<PendingImport | null>(
    null,
  );

  useEffect(() => {
    localStorage.setItem("devspace-technologies", JSON.stringify(technologies));
  }, [technologies]);

  useEffect(() => {
    localStorage.setItem("devspace-sort-order", sortOrder);
  }, [sortOrder]);

  const filteredTechnologies = technologies.filter((technology) => {
    const matchesSearch = technology.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesCategory =
      categoryFilter === "TODAS" || technology.label === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedTechnologies = [...filteredTechnologies].sort((a, b) => {
    switch (sortOrder) {
      case "az":
        return a.title.localeCompare(b.title);

      case "za":
        return b.title.localeCompare(a.title);

      case "category":
        return a.label.localeCompare(b.label) || a.title.localeCompare(b.title);

      default:
        return 0;
    }
  });

  function handleAddTechnology(newTechnology: Technology) {
    const alreadyExists = technologies.some(
      (technology) =>
        technology.title.toLowerCase() === newTechnology.title.toLowerCase(),
    );

    if (alreadyExists) {
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

    const alreadyExists = technologies.some(
      (technology) =>
        technology.title.toLowerCase() === cleanTitle.toLowerCase() &&
        technology.title !== originalEditingTitle,
    );

    if (alreadyExists) {
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
    const json = JSON.stringify(technologies, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "devspace-technologies.json";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

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
        const importedData: unknown = JSON.parse(reader.result as string);

        if (!Array.isArray(importedData) || importedData.length === 0) {
          throw new Error("El archivo no contiene una lista válida.");
        }

        const allowedCategories = [
          "LENGUAJE",
          "FRAMEWORK",
          "HERRAMIENTA",
          "BASE DE DATOS",
        ];

        const validTechnologies = importedData.every((item: unknown) => {
          if (typeof item !== "object" || item === null) {
            return false;
          }

          const technology = item as Record<string, unknown>;

          return (
            typeof technology.label === "string" &&
            allowedCategories.includes(technology.label) &&
            typeof technology.title === "string" &&
            technology.title.trim().length > 0 &&
            typeof technology.description === "string" &&
            technology.description.trim().length > 0
          );
        });

        if (!validTechnologies) {
          throw new Error(
            "El archivo contiene tecnologías con datos inválidos.",
          );
        }

        const normalizedTechnologies = importedData as Technology[];

        const titles = normalizedTechnologies.map((technology) =>
          technology.title.trim().toLowerCase(),
        );

        if (new Set(titles).size !== titles.length) {
          throw new Error("El archivo contiene tecnologías duplicadas.");
        }

        setPendingImport(
          normalizedTechnologies.map((technology) => ({
            ...technology,
            title: technology.title.trim(),
            description: technology.description.trim(),
          })),
        );

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
