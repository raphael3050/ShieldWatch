"use client";
/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import ThreatDetection from "@/components/threat-detection";
import Logging from "@/components/logging";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-4xl font-bold text-center">ShieldWatch</h1>

      {/* Card pour le Threat Detection Service */}
      <ThreatDetection />

      {/* Card pour le Logging Service */}
      <Logging />
    </section>
  );
}
