import { describe, expect, it } from "vitest";
import { BufferAttribute, BufferGeometry } from "three";
import { applyBiteContacts, clearBiteContacts } from "../src/treatment-viewer/bite-contacts";

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

  it("preserves native model base colors and cleanly restores them when contacts are cleared", () => {
    const upperGeom = new BufferGeometry();
    upperGeom.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([0, 10.0, 0, 5, 10.0, 0]), 3),
    );
    // Distinctive warm enamel and amber attachment colors
    upperGeom.setAttribute(
      "color",
      new BufferAttribute(new Float32Array([0.82, 0.76, 0.68, 0.96, 0.52, 0.16]), 3),
    );

    const lowerGeom = new BufferGeometry();
    lowerGeom.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([0, 9.85, 0, 5, 5.0, 0]), 3),
    );
    // Distinctive vascular gingiva and enamel
    lowerGeom.setAttribute(
      "color",
      new BufferAttribute(new Float32Array([0.50, 0.09, 0.12, 0.76, 0.71, 0.63]), 3),
    );

    // 1. Apply bite contacts
    applyBiteContacts(upperGeom, lowerGeom);

    // Contact heatmap was applied: point 0 on lower is heavy contact (<0.25mm) -> Crimson Red
    const lowerContactColors = lowerGeom.getAttribute("color");
    expect(lowerContactColors.getX(0)).toBeCloseTo(0.94, 1);
    expect(lowerContactColors.getY(0)).toBeCloseTo(0.22, 1);

    // Original base colors must be backed up on userData
    expect(lowerGeom.userData.baseColors).toBeDefined();
    expect((lowerGeom.userData.baseColors as BufferAttribute).getX(0)).toBeCloseTo(0.50, 2);

    // 2. Clear contacts
    clearBiteContacts(upperGeom, lowerGeom);

    // Verify original colors are cleanly restored!
    const restoredLower = lowerGeom.getAttribute("color");
    expect(restoredLower.getX(0)).toBeCloseTo(0.50, 2);
    expect(restoredLower.getY(0)).toBeCloseTo(0.09, 2);
    expect(restoredLower.getZ(0)).toBeCloseTo(0.12, 2);

    const restoredUpper = upperGeom.getAttribute("color");
    // Amber attachment restored: 0.96, 0.52, 0.16
    expect(restoredUpper.getX(1)).toBeCloseTo(0.96, 2);
    expect(restoredUpper.getY(1)).toBeCloseTo(0.52, 2);
    expect(restoredUpper.getZ(1)).toBeCloseTo(0.16, 2);
  });
});
