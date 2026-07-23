"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Formulario31Form } from "@/components/forms/formulario31/Formulario31Form";
import type { RcdCatalogTreeNode } from "@/lib/rcd-catalog";
import type { Reporte31Input } from "@/lib/validators/reporte31.schema";

import { ReporteArchivoForm } from "./ReporteArchivoForm";

type Modo = "generico" | "archivo";

// El formulario oficial (3.2, 4, 5 o 6) para esta obra todavía no tiene
// reglas de negocio propias (ver Milestone 7). Mientras tanto, se ofrecen dos
// formas de dejar el reporte real registrado: el mismo catálogo RCD del
// Formulario 3.1, o un archivo preparado fuera del aplicativo.
export function ReporteManualPicker({
  catalogTree,
  formularioNombre,
  onSubmitGenerico,
  onSubmitArchivo,
  successRedirect,
}: {
  catalogTree: RcdCatalogTreeNode[];
  formularioNombre: string;
  onSubmitGenerico: (data: Reporte31Input) => Promise<{ error?: string; reporteId?: string }>;
  onSubmitArchivo: (formData: FormData) => Promise<{ error?: string; reporteId?: string }>;
  successRedirect?: string;
}) {
  const [modo, setModo] = useState<Modo>("generico");

  return (
    <div className="space-y-6">
      <p className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
        {formularioNombre} aún no tiene una estructura oficial definida en el aplicativo. Mientras
        tanto, puedes registrar el reporte con el catálogo genérico de RCD o adjuntando el archivo
        que ya hayas preparado.
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={modo === "generico" ? "default" : "outline"}
          size="sm"
          onClick={() => setModo("generico")}
        >
          Formulario genérico
        </Button>
        <Button
          type="button"
          variant={modo === "archivo" ? "default" : "outline"}
          size="sm"
          onClick={() => setModo("archivo")}
        >
          Adjuntar archivo
        </Button>
      </div>

      {modo === "generico" ? (
        <Formulario31Form
          catalogTree={catalogTree}
          onSubmit={onSubmitGenerico}
          successRedirect={successRedirect}
        />
      ) : (
        <ReporteArchivoForm onSubmit={onSubmitArchivo} successRedirect={successRedirect} />
      )}
    </div>
  );
}
