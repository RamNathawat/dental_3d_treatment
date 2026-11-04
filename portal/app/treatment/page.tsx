import type { Metadata } from "next";
import TreatmentViewerClient from "./TreatmentViewerClient";

export const metadata: Metadata = {
  title: "Dental Treatment Viewer",
  description:
    "Interactive 3D dental treatment progression viewer — navigate through treatment stages with upper and lower arch models.",
};

export default function TreatmentPage() {
  return <TreatmentViewerClient />;
}

