// pages/admin.tsx
"use client";
import { title } from "@/components/primitives";
import Logging from "@/components/logging";
import ThreatDetectionAdmin from "@/components/threat-detection-admin";
import Authentication from "@/components/authentication";

export default function AdminPage() {
  return (
    <div className="flex flex-col w-full items-center justify-center gap-4 py-8 md:py-10">
      <h1 className={title()}>Admin</h1>
      <p>Bienvenue dans la section admin. Accès réservé aux administrateurs.</p>
      <Logging />
      <ThreatDetectionAdmin />
      <Authentication />
    </div>
  );
}
