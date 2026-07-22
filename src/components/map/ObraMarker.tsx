"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

export interface ObraPin {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  clasificacion: "DISTRITAL" | "NACIONAL";
  tamano: "MAYOR_2000" | "MENOR_2000";
  centroDeTrabajo: string | null;
  estado: "AL_DIA" | "ATRASADO" | "SIN_METAS";
}

const COLOR_POR_ESTADO: Record<ObraPin["estado"], string> = {
  AL_DIA: "#16a34a",
  ATRASADO: "#dc2626",
  SIN_METAS: "#9ca3af",
};

function crearIcono(pin: ObraPin) {
  const color = COLOR_POR_ESTADO[pin.estado];
  const forma = pin.clasificacion === "DISTRITAL" ? "50%" : "4px";

  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:${forma};background:${color};border:2px solid white;box-shadow:0 0 2px rgba(0,0,0,0.6)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const ESTADO_LABEL: Record<ObraPin["estado"], string> = {
  AL_DIA: "Al día",
  ATRASADO: "Atrasado",
  SIN_METAS: "Sin metas",
};

export function ObraMarker({ pin }: { pin: ObraPin }) {
  return (
    <Marker position={[pin.lat, pin.lng]} icon={crearIcono(pin)}>
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{pin.nombre}</p>
          <p>
            {pin.clasificacion} · {pin.tamano === "MAYOR_2000" ? ">2000m²" : "<2000m²"}
          </p>
          <p>Estado: {ESTADO_LABEL[pin.estado]}</p>
          {pin.centroDeTrabajo && <p>Centro: {pin.centroDeTrabajo}</p>}
        </div>
      </Popup>
    </Marker>
  );
}
