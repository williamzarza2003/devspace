import { describe, expect, it } from "vitest";
import { initialTechnologies } from "../data/initialTechnologies";
import { isSortOrder, type Technology } from "../types/technology";
import {
  filterTechnologies,
  loadStoredSortOrder,
  loadStoredTechnologies,
  parseImportedTechnologies,
  sortTechnologies,
  titleExists,
} from "./technologies";

const sample: Technology[] = [
  { label: "LENGUAJE", title: "TypeScript", description: "Tipos" },
  { label: "FRAMEWORK", title: "React", description: "UI" },
  { label: "BASE DE DATOS", title: "PostgreSQL", description: "SQL" },
  { label: "LENGUAJE", title: "Java", description: "JVM" },
];

const titles = (list: Technology[]) => list.map((t) => t.title);

describe("filterTechnologies", () => {
  it("devuelve todo con búsqueda vacía y TODAS", () => {
    expect(filterTechnologies(sample, "", "TODAS")).toEqual(sample);
  });

  it("busca sin distinguir mayúsculas e ignora espacios", () => {
    expect(titles(filterTechnologies(sample, "  REAC ", "TODAS"))).toEqual([
      "React",
    ]);
  });

  it("filtra por categoría", () => {
    expect(titles(filterTechnologies(sample, "", "LENGUAJE"))).toEqual([
      "TypeScript",
      "Java",
    ]);
  });

  it("combina búsqueda y categoría", () => {
    expect(filterTechnologies(sample, "react", "LENGUAJE")).toEqual([]);
  });
});

describe("sortTechnologies", () => {
  it("mantiene el orden original con default", () => {
    expect(titles(sortTechnologies(sample, "default"))).toEqual(
      titles(sample),
    );
  });

  it("ordena A → Z y Z → A", () => {
    expect(titles(sortTechnologies(sample, "az"))).toEqual([
      "Java",
      "PostgreSQL",
      "React",
      "TypeScript",
    ]);
    expect(titles(sortTechnologies(sample, "za"))).toEqual([
      "TypeScript",
      "React",
      "PostgreSQL",
      "Java",
    ]);
  });

  it("ordena por categoría y luego por nombre", () => {
    expect(titles(sortTechnologies(sample, "category"))).toEqual([
      "PostgreSQL",
      "React",
      "Java",
      "TypeScript",
    ]);
  });

  it("no modifica la lista original", () => {
    const copy = [...sample];
    sortTechnologies(sample, "az");
    expect(sample).toEqual(copy);
  });
});

describe("titleExists", () => {
  it("detecta duplicados sin distinguir mayúsculas", () => {
    expect(titleExists(sample, "react")).toBe(true);
    expect(titleExists(sample, "  JAVA ")).toBe(true);
    expect(titleExists(sample, "Go")).toBe(false);
  });

  it("ignora el título que se está editando", () => {
    expect(titleExists(sample, "react", "React")).toBe(false);
    expect(titleExists(sample, "java", "React")).toBe(true);
  });
});

describe("parseImportedTechnologies", () => {
  it("acepta una lista válida y recorta espacios", () => {
    const json = JSON.stringify([
      { label: "LENGUAJE", title: "  Go ", description: " Backend  " },
    ]);
    expect(parseImportedTechnologies(json)).toEqual([
      { label: "LENGUAJE", title: "Go", description: "Backend" },
    ]);
  });

  it("rechaza JSON mal formado", () => {
    expect(() => parseImportedTechnologies("{no es json")).toThrow(
      "El archivo no es un JSON válido.",
    );
  });

  it("rechaza listas vacías o que no son listas", () => {
    expect(() => parseImportedTechnologies("[]")).toThrow(
      "El archivo no contiene una lista válida.",
    );
    expect(() => parseImportedTechnologies('{"a":1}')).toThrow(
      "El archivo no contiene una lista válida.",
    );
  });

  it("rechaza categorías no permitidas y campos vacíos", () => {
    const badCategory = JSON.stringify([
      { label: "OTRA", title: "X", description: "Y" },
    ]);
    const emptyTitle = JSON.stringify([
      { label: "LENGUAJE", title: "   ", description: "Y" },
    ]);
    expect(() => parseImportedTechnologies(badCategory)).toThrow(
      "El archivo contiene tecnologías con datos inválidos.",
    );
    expect(() => parseImportedTechnologies(emptyTitle)).toThrow(
      "El archivo contiene tecnologías con datos inválidos.",
    );
  });

  it("rechaza duplicados sin distinguir mayúsculas", () => {
    const json = JSON.stringify([
      { label: "LENGUAJE", title: "Go", description: "A" },
      { label: "LENGUAJE", title: " go ", description: "B" },
    ]);
    expect(() => parseImportedTechnologies(json)).toThrow(
      "El archivo contiene tecnologías duplicadas.",
    );
  });
});

describe("datos guardados en localStorage", () => {
  it("usa las tecnologías iniciales si no hay datos o están dañados", () => {
    expect(loadStoredTechnologies(null)).toBe(initialTechnologies);
    expect(loadStoredTechnologies("{roto")).toBe(initialTechnologies);
    expect(loadStoredTechnologies('{"a":1}')).toBe(initialTechnologies);
  });

  it("respeta una lista guardada, aunque esté vacía", () => {
    expect(loadStoredTechnologies(JSON.stringify(sample))).toEqual(sample);
    expect(loadStoredTechnologies("[]")).toEqual([]);
  });

  it("valida el orden guardado", () => {
    expect(loadStoredSortOrder("za")).toBe("za");
    expect(loadStoredSortOrder("cualquiera")).toBe("default");
    expect(loadStoredSortOrder(null)).toBe("default");
    expect(isSortOrder("category")).toBe(true);
  });
});
