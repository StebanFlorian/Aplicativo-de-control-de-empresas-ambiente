"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RcdCatalogFlatItem } from "@/lib/rcd-catalog";
import type { Reporte31Input } from "@/lib/validators/reporte31.schema";

export function AdquisicionMaterialRows({
  materiales,
  readOnly = false,
}: {
  materiales: RcdCatalogFlatItem[];
  readOnly?: boolean;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Reporte31Input>();

  const { fields, append, remove } = useFieldArray({ control, name: "adquisiciones" });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => {
        const rcdCatalogItemId = watch(`adquisiciones.${index}.rcdCatalogItemId`);
        return (
          <div key={field.id} className="grid grid-cols-12 items-start gap-2">
            <div className="col-span-4">
              <Select
                value={rcdCatalogItemId || ""}
                onValueChange={(v) =>
                  setValue(`adquisiciones.${index}.rcdCatalogItemId`, v ?? "")
                }
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de material" />
                </SelectTrigger>
                <SelectContent>
                  {materiales.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.codigo} {m.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.adquisiciones?.[index]?.rcdCatalogItemId && (
                <p className="text-xs text-destructive">
                  {errors.adquisiciones[index]?.rcdCatalogItemId?.message}
                </p>
              )}
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Cantidad (Ton)"
                disabled={readOnly}
                {...register(`adquisiciones.${index}.cantidadTon`)}
              />
              {errors.adquisiciones?.[index]?.cantidadTon && (
                <p className="text-xs text-destructive">
                  {errors.adquisiciones[index]?.cantidadTon?.message}
                </p>
              )}
            </div>
            <div className="col-span-3">
              <Input
                placeholder="Proveedor"
                disabled={readOnly}
                {...register(`adquisiciones.${index}.proveedor`)}
              />
              {errors.adquisiciones?.[index]?.proveedor && (
                <p className="text-xs text-destructive">
                  {errors.adquisiciones[index]?.proveedor?.message}
                </p>
              )}
            </div>
            {!readOnly && (
              <div className="col-span-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                  Quitar
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ rcdCatalogItemId: "", cantidadTon: 0, proveedor: "" })}
        >
          Agregar adquisición
        </Button>
      )}
    </div>
  );
}
