/**
 * Entry point for the treatment viewer page.
 */
import "./treatment.css";
import { createTreatmentApp } from "./treatment-app";

const root = document.querySelector<HTMLElement>("#app");
if (root === null) throw new Error("The page has no #app mount point.");

createTreatmentApp(root);
