// Catálogo de tipos de RCD (hoja "3.1 Fml Obra Dist.> 2000m2"). Se usa tanto
// para sembrar RcdCatalogItem (prisma/seed.ts) como referencia de la
// estructura esperada por RcdCatalogTree.

export interface RcdCatalogNodeSeed {
  codigo: string;
  nombre: string;
  hijos?: RcdCatalogNodeSeed[];
}

export interface RcdCatalogFlatItem {
  id: string;
  codigo: string;
  nombre: string;
  nivel: "GRUPO" | "ITEM";
  parentId: string | null;
  requiereTratamiento: boolean;
}

export interface RcdCatalogTreeNode extends RcdCatalogFlatItem {
  hijos: RcdCatalogTreeNode[];
}

// Anida una lista plana (tal como viene de Prisma) en un árbol, preservando
// el orden por código. Usado por RcdCatalogTree.
export function buildCatalogTree(flat: RcdCatalogFlatItem[]): RcdCatalogTreeNode[] {
  const nodosPorId = new Map<string, RcdCatalogTreeNode>(
    flat.map((item) => [item.id, { ...item, hijos: [] }]),
  );

  const raiz: RcdCatalogTreeNode[] = [];

  for (const nodo of nodosPorId.values()) {
    if (nodo.parentId) {
      nodosPorId.get(nodo.parentId)?.hijos.push(nodo);
    } else {
      raiz.push(nodo);
    }
  }

  return raiz;
}

export const RCD_CATALOG: RcdCatalogNodeSeed[] = [
  {
    codigo: "01 01",
    nombre: "Excavación",
    hijos: [
      { codigo: "01 01 01", nombre: "Coberturas vegetales" },
      { codigo: "01 01 02", nombre: "Tierras limpias de excavación" },
      { codigo: "01 01 03", nombre: "Limos" },
      { codigo: "01 01 04", nombre: "Materiales pétreos productos de la excavación" },
      { codigo: "01 01 05", nombre: "Otros residuos de excavación" },
    ],
  },
  {
    codigo: "01 02",
    nombre: "Productos de Cimentación y Pilotaje",
    hijos: [
      { codigo: "01 02 01", nombre: "Arcillas" },
      { codigo: "01 02 02", nombre: "Bentonitas" },
      { codigo: "01 02 03", nombre: "Otros residuos de cimentación y pilotaje" },
    ],
  },
  {
    codigo: "01 03",
    nombre: "Pétreos",
    hijos: [
      { codigo: "01 03 01", nombre: "Concretos" },
      { codigo: "01 03 02", nombre: "Gravas" },
      { codigo: "01 03 03", nombre: "Cantos" },
      { codigo: "01 03 04", nombre: "Ladrillos" },
      { codigo: "01 03 05", nombre: "Arenas" },
      { codigo: "01 03 06", nombre: "Morteros" },
      { codigo: "01 03 07", nombre: "Materiales Cerámicos" },
      { codigo: "01 03 08", nombre: "Residuos de material asfáltico" },
      { codigo: "01 03 09", nombre: "Bases y sub bases granulares" },
      { codigo: "01 03 10", nombre: "Otros residuos pétreos" },
    ],
  },
  {
    codigo: "01 04",
    nombre: "No pétreos",
    hijos: [
      { codigo: "01 04 01", nombre: "Madera" },
      { codigo: "01 04 02", nombre: "Plásticos" },
      { codigo: "01 04 03", nombre: "Vidrio" },
      { codigo: "01 04 04", nombre: "Papel y Cartón" },
      { codigo: "01 04 05", nombre: "Gomas y cauchos" },
      { codigo: "01 04 06", nombre: "Cartón yeso (drywall)" },
      { codigo: "01 04 07", nombre: "Acrílico" },
      { codigo: "01 04 08", nombre: "Mezclas bituminosas y alquitrán" },
      { codigo: "01 04 09", nombre: "Materiales a base fibrocemento" },
      { codigo: "01 04 10", nombre: "Otros residuos no pétreos" },
    ],
  },
  {
    codigo: "01 05",
    nombre: "Metales",
    hijos: [
      { codigo: "01 05 01", nombre: "Acero y hierro" },
      { codigo: "01 05 02", nombre: "Zinc" },
      { codigo: "01 05 03", nombre: "Cobre" },
      { codigo: "01 05 04", nombre: "Aluminio" },
      { codigo: "01 05 05", nombre: "Otros metales" },
    ],
  },
  {
    codigo: "02",
    nombre: "RCD - No susceptibles de aprovechamiento",
    hijos: [
      { codigo: "02 01", nombre: "Los que por su estado no pueden ser aprovechados" },
      {
        codigo: "02 02",
        nombre: "Los que tengan características de peligrosidad",
        hijos: [
          { codigo: "02 02 01", nombre: "Residuos con contenido de asbesto o amianto" },
          { codigo: "02 02 02", nombre: "Otros residuos con características de peligrosidad" },
        ],
      },
    ],
  },
];
