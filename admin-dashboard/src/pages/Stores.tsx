import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api, fetcher } from "../api";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// --- COMPONENT 1: The Event Listener (Child) ---
function LocationEvents({
  setPos,
}: {
  setPos: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setPos(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- COMPONENT 2: The Main Page ---
export default function Stores() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: "",
      address: "",
      latitude: 27.7172,
      longitude: 85.324,
      radiusKm: 3,
    },
  });

  // Watch values live
  const lat = watch("latitude");
  const lng = watch("longitude");
  const radiusKm = watch("radiusKm"); // <--- We watch this now

  // Fetch Data
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetcher("/admin/stores"),
  });

  // Create Mutation
  const createStore = useMutation({
    mutationFn: (data: any) => api.post("/admin/stores", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      reset();
      alert("✅ Store Created Successfully!");
    },
    onError: (err: any) => {
      alert("❌ Error: " + err.message);
    },
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dark Store Locations</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* --- LEFT: CREATE FORM --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold mb-4 text-blue-600">Add New Store</h2>

          <form
            onSubmit={handleSubmit((data) => createStore.mutate(data))}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Store Name
              </label>
              <input
                {...register("name")}
                className="w-full border p-2 rounded"
                placeholder="e.g. Baneshwor Hub"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Address
              </label>
              <input
                {...register("address")}
                className="w-full border p-2 rounded"
                placeholder="Street Address"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Radius (KM)
              </label>
              <input
                type="number"
                step="0.1"
                {...register("radiusKm", { valueAsNumber: true })}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* --- MAP SECTION --- */}
            <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
              <MapContainer
                center={[27.7172, 85.324]}
                zoom={13}
                scrollWheelZoom={true} // <--- Enabled Finger/Wheel Zoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 1. The Center Point (Red Dot) */}
                <CircleMarker
                  center={[lat, lng]}
                  radius={5}
                  pathOptions={{ color: "red", fillOpacity: 1 }}
                />

                {/* 2. The Coverage Area (Blue Circle) */}
                {/* Radius in Leaflet is in meters, so we multiply KM * 1000 */}
                <Circle
                  center={[lat, lng]}
                  radius={(Number(radiusKm) || 0) * 1000}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.2,
                  }}
                />

                {/* 3. Event Listener (Child) */}
                <LocationEvents
                  setPos={(newLat, newLng) => {
                    setValue("latitude", newLat);
                    setValue("longitude", newLng);
                  }}
                />
              </MapContainer>
            </div>

            <p className="text-xs text-center text-gray-400">
              Coverage: {radiusKm} KM around {Number(lat).toFixed(4)},{" "}
              {Number(lng).toFixed(4)}
            </p>

            <button className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
              Launch Store
            </button>
          </form>
        </div>

        {/* --- RIGHT: STORE LIST --- */}
        <div className="space-y-4">
          <h2 className="font-bold">Active Stores</h2>

          {!stores || stores.length === 0 ? (
            <div className="p-4 bg-gray-100 rounded text-gray-500 text-center">
              No stores found. Create one!
            </div>
          ) : (
            stores.map((store: any) => (
              <div
                key={store.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.address}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    Radius: {store.radiusKm}km
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    store.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
