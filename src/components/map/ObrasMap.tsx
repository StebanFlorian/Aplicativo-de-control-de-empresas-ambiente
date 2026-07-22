"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { ObraMarker, type ObraPin } from "./ObraMarker";

const BOGOTA_CENTER: [number, number] = [4.6486, -74.0912];

export default function ObrasMap({ centro }: { centro?: string }) {
  const [pines, setPines] = useState<ObraPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;
    const query = centro ? `?centro=${encodeURIComponent(centro)}` : "";

    fetch(`/api/mapa${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelado) return;
        setPines(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
      setLoading(true);
    };
  }, [centro]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-sm">
          Cargando obras...
        </div>
      )}
      <MapContainer
        center={BOGOTA_CENTER}
        zoom={11}
        style={{ height: "600px", width: "100%" }}
        className="rounded-md border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pines.map((pin) => (
          <ObraMarker key={pin.id} pin={pin} />
        ))}
      </MapContainer>
      {!loading && pines.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          No hay obras con coordenadas registradas para este filtro.
        </p>
      )}
    </div>
  );
}
