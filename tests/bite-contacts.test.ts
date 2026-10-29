import { describe, expect, it } from "vitest";
import { BufferAttribute, BufferGeometry } from "three";
import { applyBiteContacts } from "../src/treatment-viewer/bite-contacts";

describe("Bite Contacts Calculation", () => {
  it("computes heavy, medium, and light contact points based on vertical clearance", () => {
    // Upper jaw with 3 points at Y = 10
    const upperGeom = new BufferGeometry();
    const upperVertices = new Float32Array([
      0, 10.0, 0,    // Point 1
      5, 10.0, 0,    // Point 2
      10, 10.0, 0,   // Point 3
    ]);
    upperGeom.setAttribute("position", new BufferAttribute(upperVertices, 3));

    // Lower jaw opposing teeth:
    // Point 1: Y = 9.85 -> clearance 0.15mm (Heavy contact <= 0.25mm)
    // Point 2: Y = 9.60 -> clearance 0.40mm (Medium contact <= 0.60mm)
    // Point 3: Y = 9.15 -> clearance 0.85mm (Light contact <= 1.00mm)
    // Point 4: Y = 7.00 -> clearance 3.00mm (Clear / No contact)
    const lowerGeom = new BufferGeometry();
    const lowerVertices = new Float32Array([
      0, 9.85, 0,
      5, 9.60, 0,
      10, 9.15, 0,
      0, 7.00, 5,
    ]);
    lowerGeom.setAttribute("position", new BufferAttribute(lowerVertices, 3));

    const result = applyBiteContacts(upperGeom, lowerGeom);

    expect(result.heavyCount).toBe(1);
    expect(result.mediumCount).toBe(1);
    expect(result.lightCount).toBe(1);

    // Verify vertex color attributes attached to geometry
    const lowerColors = lowerGeom.getAttribute("color");
    expect(lowerColors).toBeDefined();
    expect(lowerColors.count).toBe(4);

    // Heavy contact should be colored Red: R > 0.8, G < 0.3
    expect(lowerColors.getX(0)).toBeGreaterThan(0.8);
    expect(lowerColors.getY(0)).toBeLessThan(0.3);

    // Clear point should be colored normal enamel ivory: R ~ 0.91, G ~ 0.88, B ~ 0.84
    expect(lowerColors.getX(3)).toBeCloseTo(0.91, 1);
    expect(lowerColors.getY(3)).toBeCloseTo(0.88, 1);
  });
});
