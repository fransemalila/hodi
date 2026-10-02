"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { SavedLocation } from "@/lib/types";
import { Button, Input } from "./ui";

/** Add-a-location form. Coordinates are approximate until GPS/maps land. */
export function LocationForm({ onSaved }: { onSaved: (loc: SavedLocation) => void }) {
  const { t } = useI18n();
  const { addLocation } = useStore();
  const [label, setLabel] = useState("");
  const [landmark, setLandmark] = useState("");
  const [note, setNote] = useState("");

  const save = () => {
    if (!label.trim() || !landmark.trim()) return;
    const loc = addLocation({
      label: label.trim(),
      landmark: landmark.trim(),
      note: note.trim() || undefined,
      // Dar es Salaam centre with a little jitter; replaced by a map pin later.
      lat: -6.79 + (Math.random() - 0.5) * 0.08,
      lng: 39.24 + (Math.random() - 0.5) * 0.08,
    });
    onSaved(loc);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm text-gray-600">{t("locationLabel")}</label>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t("locationLabelPh")} className="h-12 rounded-xl border-gray-200 px-4" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-gray-600">{t("landmark")}</label>
        <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder={t("landmarkPh")} className="h-12 rounded-xl border-gray-200 px-4" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-gray-600">{t("locationNote")}</label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("notePlaceholder")} className="h-12 rounded-xl border-gray-200 px-4" />
      </div>
      <Button
        onClick={save}
        disabled={!label.trim() || !landmark.trim()}
        className="h-12 w-full rounded-full bg-[#0F3D2E] text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
      >
        {t("save")}
      </Button>
    </div>
  );
}
