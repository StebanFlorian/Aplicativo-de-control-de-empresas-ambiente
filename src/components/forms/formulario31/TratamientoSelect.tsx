"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPCIONES = [
  { value: "DISPOSICION_FINAL", label: "Disposición final" },
  { value: "REUTILIZACION", label: "Reutilización" },
  { value: "RECICLAJE", label: "Reciclaje" },
  { value: "OTROS", label: "Otros" },
] as const;

export function TratamientoSelect({
  value,
  onChange,
  id,
}: {
  value?: string;
  onChange: (value: string | undefined) => void;
  id?: string;
}) {
  return (
    <Select value={value ?? ""} onValueChange={(v) => onChange(v || undefined)}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Tipo de tratamiento" />
      </SelectTrigger>
      <SelectContent>
        {OPCIONES.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
