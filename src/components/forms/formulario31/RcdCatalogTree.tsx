"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RcdCatalogTreeNode } from "@/lib/rcd-catalog";
import type { Reporte31Input } from "@/lib/validators/reporte31.schema";

import { TratamientoSelect } from "./TratamientoSelect";

export function RcdCatalogTree({
  nodes,
  indexByItemId,
  readOnly = false,
}: {
  nodes: RcdCatalogTreeNode[];
  indexByItemId: Record<string, number>;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      {nodes.map((node) => (
        <CatalogNode key={node.id} node={node} indexByItemId={indexByItemId} readOnly={readOnly} />
      ))}
    </div>
  );
}

function CatalogNode({
  node,
  indexByItemId,
  readOnly,
}: {
  node: RcdCatalogTreeNode;
  indexByItemId: Record<string, number>;
  readOnly: boolean;
}) {
  if (node.nivel === "ITEM") {
    return <CatalogLeafRow node={node} indexByItemId={indexByItemId} readOnly={readOnly} />;
  }

  return (
    <div className="rounded-md border p-3">
      <p className="text-sm font-semibold">
        {node.codigo} {node.nombre}
      </p>
      <div className="mt-3 space-y-3 border-l pl-4">
        {node.hijos.map((hijo) => (
          <CatalogNode
            key={hijo.id}
            node={hijo}
            indexByItemId={indexByItemId}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}

function CatalogLeafRow({
  node,
  indexByItemId,
  readOnly,
}: {
  node: RcdCatalogTreeNode;
  indexByItemId: Record<string, number>;
  readOnly: boolean;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Reporte31Input>();

  const index = indexByItemId[node.id];
  const cantidad = watch(`items.${index}.cantidadTon`);
  const tratamiento = watch(`items.${index}.tratamiento`);
  const itemErrors = errors.items?.[index];

  return (
    <div className="grid grid-cols-12 items-start gap-2 py-1">
      <div className="col-span-5 pt-1.5 text-sm">
        {node.codigo} {node.nombre}
      </div>
      <div className="col-span-2">
        <Label className="sr-only" htmlFor={`items.${index}.cantidadTon`}>
          Cantidad (Ton)
        </Label>
        <Input
          id={`items.${index}.cantidadTon`}
          type="number"
          step="0.01"
          min="0"
          disabled={readOnly}
          placeholder="Ton"
          {...register(`items.${index}.cantidadTon`)}
        />
      </div>
      {Number(cantidad) > 0 && (
        <>
          <div className="col-span-2">
            <TratamientoSelect
              value={tratamiento}
              onChange={(v) =>
                setValue(
                  `items.${index}.tratamiento`,
                  v as Reporte31Input["items"][number]["tratamiento"],
                )
              }
            />
            {itemErrors?.tratamiento && (
              <p className="text-xs text-destructive">{itemErrors.tratamiento.message}</p>
            )}
          </div>
          {tratamiento === "DISPOSICION_FINAL" && (
            <div className="col-span-3">
              <Input
                placeholder="Lugar de disposición final"
                disabled={readOnly}
                {...register(`items.${index}.lugarDisposicionFinal`)}
              />
              {itemErrors?.lugarDisposicionFinal && (
                <p className="text-xs text-destructive">
                  {itemErrors.lugarDisposicionFinal.message}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
