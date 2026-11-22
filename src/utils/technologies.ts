import { initialTechnologies } from "../data/initialTechnologies";
import {
  isCategory,
  isSortOrder,
  type SortOrder,
  type Technology,
} from "../types/technology";

export const ALL_CATEGORIES = "TODAS";

export function filterTechnologies(
  technologies: Technology[],
  search: string,
  categoryFilter: string,
): Technology[] {
  const normalizedSearch = search.toLowerCase().trim();

  return technologies.filter((technology) => {
    const matchesSearch = technology.title
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesCategory =
      categoryFilter === ALL_CATEGORIES || technology.label === categoryFilter;

    return matchesSearch && matchesCategory;
  });
}

export function sortTechnologies(
  technologies: Technology[],
  sortOrder: SortOrder,
): Technology[] {
  return [...technologies].sort((a, b) => {
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
}

/** Indica si ya existe una tecnología con ese título (sin distinguir mayúsculas). */
export function titleExists(
  technologies: Technology[],
  title: string,
  ignoreTitle?: string,
): boolean {
  const normalizedTitle = title.trim().toLowerCase();

  return technologies.some(
    (technology) =>
      technology.title.toLowerCase() === normalizedTitle &&
      technology.title !== ignoreTitle,
  );
}

function isValidTechnology(item: unknown): item is Technology {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const technology = item as Record<string, unknown>;

  return (
    isCategory(technology.label) &&
    typeof technology.title === "string" &&
    technology.title.trim().length > 0 &&
    typeof technology.description === "string" &&
    technology.description.trim().length > 0
  );
}

function trimTechnology(technology: Technology): Technology {
  return {
    label: technology.label,
    title: technology.title.trim(),
    description: technology.description.trim(),
  };
}

/**
 * Valida el contenido de un archivo JSON importado.
 * Lanza un Error con un mensaje para el usuario si el contenido no es válido.
 */
export function parseImportedTechnologies(json: string): Technology[] {
  let data: unknown;

  try {
    data = JSON.parse(json);
  } catch {
    throw new Error("El archivo no es un JSON válido.");
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("El archivo no contiene una lista válida.");
  }

  if (!data.every(isValidTechnology)) {
    throw new Error("El archivo contiene tecnologías con datos inválidos.");
  }

  const technologies = data.map(trimTechnology);
  const titles = technologies.map((technology) =>
    technology.title.toLowerCase(),
  );

  if (new Set(titles).size !== titles.length) {
    throw new Error("El archivo contiene tecnologías duplicadas.");
  }

  return technologies;
}

/** Lee las tecnologías guardadas; si faltan o están dañadas, usa las iniciales. */
export function loadStoredTechnologies(saved: string | null): Technology[] {
  if (!saved) {
    return initialTechnologies;
  }

  try {
    const data: unknown = JSON.parse(saved);

    if (Array.isArray(data) && data.every(isValidTechnology)) {
      return data;
    }
  } catch {
    // Datos dañados: se usan las tecnologías iniciales.
  }

  return initialTechnologies;
}

export function loadStoredSortOrder(saved: string | null): SortOrder {
  return isSortOrder(saved) ? saved : "default";
}
