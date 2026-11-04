import { normalizeDisclosureData } from "./src/lib/disclosure-engine/utils/normalizeDisclosureData";

const payload = {
  questions: [null, null, "YES", null, "NO", "NO", null],
  page2Flood: {
    q4: null,
    q5: null,
    q6: null
  },
  inlineOptions: {
    fireSuppresionDate: "2024-01-01",
    acType: null,
  },
  appliances: ["NONE", null, "WORKING", "NONE"],
  systems: {
    fireSuppression: null,
    ac: "WORKING",
  }
};

console.log(JSON.stringify(normalizeDisclosureData(payload), null, 2));
