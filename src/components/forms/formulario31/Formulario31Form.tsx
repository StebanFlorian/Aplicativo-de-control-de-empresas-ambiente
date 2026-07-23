"use client";

import { useMemo, useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RcdCatalogFlatItem, RcdCatalogTreeNode } from "@/lib/rcd-catalog";
import { reporte31Schema, type Reporte31Input } from "@/lib/validators/reporte31.schema";

import { AdquisicionMaterialRows } from "./AdquisicionMaterialRows";
import { RcdCatalogTree } from "./RcdCatalogTree";

function toDateInputValue(date?: Date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function collectLeaves(nodes: RcdCatalogTreeNode[]): RcdCatalogFlatItem[] {
  const leaves: RcdCatalogFlatItem[] = [];
  for (const node of nodes) {
    if (node.nivel === "ITEM") leaves.push(node);
    else leaves.push(...collectLeaves(node.hijos));
  }
  return leaves;
}

export function Formulario31Form({
  catalogTree,
  defaultValues,
  onSubmit,
  successRedirect,
  readOnly = false,
}: {
  catalogTree: RcdCatalogTreeNode[];
  defaultValues?: Partial<Reporte31Input>;
  onSubmit?: (data: Reporte31Input) => Promise<{ error?: string; reporteId?: string }>;
  successRedirect?: string;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const leaves = useMemo(() => collectLeaves(catalogTree), [catalogTree]);
  const leafIds = useMemo(() => leaves.map((l) => l.id), [leaves]);
  const indexByItemId = useMemo(
    () => Object.fromEntries(leafIds.map((id, i) => [id, i])),
    [leafIds],
  );

  const resolver: Resolver<Reporte31Input> = async (values, context, options) => {
    const zodValidate = zodResolver(reporte31Schema) as unknown as Resolver<Reporte31Input>;
    return zodValidate(values, context, options);
  };

  const methods = useForm<Reporte31Input>({
    resolver,
    defaultValues: {
      periodoInicio: new Date(),
      periodoFin: new Date(),
      adquisiciones: [],
      items: leafIds.map((id) => ({ rcdCatalogItemId: id, cantidadTon: 0 })),
      ...defaultValues,
    },
  });

  const { handleSubmit, watch, setValue, formState } = methods;
  const periodoInicio = watch("periodoInicio");
  const periodoFin = watch("periodoFin");
  const itemsRootError = (
    formState.errors.items as unknown as { message?: string; root?: { message?: string } } | undefined
  )?.root?.message ?? (formState.errors.items as unknown as { message?: string } | undefined)?.message;

  async function submit(data: Reporte31Input) {
    if (!onSubmit) return;

    setSubmitting(true);
    const result = await onSubmit(data);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Reporte guardado correctamente.");
    if (successRedirect) router.push(successRedirect);
    router.refresh();
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="periodoInicio">Inicio del periodo</Label>
            <Input
              id="periodoInicio"
              type="date"
              disabled={readOnly}
              value={toDateInputValue(periodoInicio)}
              onChange={(e) => setValue("periodoInicio", new Date(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodoFin">Fin del periodo</Label>
            <Input
              id="periodoFin"
              type="date"
              disabled={readOnly}
              value={toDateInputValue(periodoFin)}
              onChange={(e) => setValue("periodoFin", new Date(e.target.value))}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Adquisición de material valorizado</h2>
          <div className="mt-3">
            <AdquisicionMaterialRows materiales={leaves} readOnly={readOnly} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Tipo de RCD</h2>
          {itemsRootError && <p className="mt-1 text-sm text-destructive">{itemsRootError}</p>}
          <div className="mt-3">
            <RcdCatalogTree nodes={catalogTree} indexByItemId={indexByItemId} readOnly={readOnly} />
          </div>
        </div>

        {!readOnly && (
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar reporte"}
          </Button>
        )}
      </form>
    </FormProvider>
  );
}
