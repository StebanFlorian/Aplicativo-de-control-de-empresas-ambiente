"use client";

import { FormProvider, useForm } from "react-hook-form";

import type { RcdCatalogTreeNode } from "@/lib/rcd-catalog";
import type { Reporte31Input } from "@/lib/validators/reporte31.schema";

import { RcdCatalogTree } from "../formulario31/RcdCatalogTree";

function collectLeafIds(nodes: RcdCatalogTreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.nivel === "ITEM") ids.push(node.id);
    else ids.push(...collectLeafIds(node.hijos));
  }
  return ids;
}

// Scaffold compartido para los formularios de reporte aún no detallados
// (Obra Distrital < 2000m², Obra Nacional > y < 2000m²). Reutiliza el mismo
// catálogo de RCD y árbol de captura que el Formulario 3.1, en modo solo
// lectura, para que la estructura quede lista cuando se definan el resto de
// reglas de negocio de cada variante.
export function ReporteStubForm({
  catalogTree,
  formularioNombre,
}: {
  catalogTree: RcdCatalogTreeNode[];
  formularioNombre: string;
}) {
  const leafIds = collectLeafIds(catalogTree);
  const indexByItemId = Object.fromEntries(leafIds.map((id, i) => [id, i]));

  const methods = useForm<Reporte31Input>({
    defaultValues: {
      periodoInicio: new Date(),
      periodoFin: new Date(),
      adquisiciones: [],
      items: leafIds.map((id) => ({ rcdCatalogItemId: id, cantidadTon: 0 })),
    },
  });

  return (
    <div className="space-y-6">
      <p className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
        {formularioNombre} está próximamente disponible. El catálogo de tipos de RCD ya está listo
        y se reutilizará tal cual cuando se definan las reglas específicas de este formulario.
      </p>
      <FormProvider {...methods}>
        <div className="pointer-events-none opacity-60">
          <RcdCatalogTree nodes={catalogTree} indexByItemId={indexByItemId} readOnly />
        </div>
      </FormProvider>
    </div>
  );
}
