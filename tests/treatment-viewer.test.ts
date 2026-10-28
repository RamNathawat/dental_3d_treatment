// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  STAGE_COUNT,
  TREATMENT_STAGES,
  stageAt,
} from "../src/treatment-viewer/stage-config";
import {
  clearStlBufferCache,
  loadStageModels,
  stlLoader,
} from "../src/treatment-viewer/model-loader";
import {
  createTreatmentApp,
  LOWER_ARCH_COLOUR,
  LOWER_ARCH_ID,
  UPPER_ARCH_COLOUR,
  UPPER_ARCH_ID,
} from "../src/treatment-viewer/treatment-app";
import type { CaseManifest } from "../src/treatment-viewer/stage-manifest";
import { FakeViewport } from "./fake-viewport";

describe("Treatment Stage Configuration", () => {
  it("defines stages with upper and lower jaw URLs", () => {
    expect(STAGE_COUNT).toBeGreaterThan(0);
    expect(TREATMENT_STAGES.length).toBe(STAGE_COUNT);

    for (const [index, stage] of TREATMENT_STAGES.entries()) {
      expect(stage.stage).toBe(index + 1);
      expect(stage.label).toBe(`Stage ${index + 1}`);
      expect(stage.upperUrl).toContain("Upper");
      expect(stage.lowerUrl).toContain("Lower");
      expect(stage.upperUrl).toMatch(/\.stl$/i);
      expect(stage.lowerUrl).toMatch(/\.stl$/i);
    }
  });

  it("retrieves a stage by 0-based index", () => {
    expect(stageAt(0)?.stageNumber).toBe(1);
    expect(stageAt(1)?.stageNumber).toBe(2);
    expect(stageAt(-1)).toBeNull();
    expect(stageAt(999)).toBeNull();
  });
});

describe("Model Loader", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearStlBufferCache();
  });

  afterEach(() => {
    clearStlBufferCache();
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetches both upper and lower models in parallel", async () => {
    const mockUpper = new Uint8Array([1, 2, 3]).buffer;
    const mockLower = new Uint8Array([4, 5, 6]).buffer;

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      const buffer = url.toLowerCase().includes("upper")
        ? mockUpper
        : mockLower;
      return Promise.resolve({
        ok: true,
        status: 200,
        arrayBuffer: () => Promise.resolve(buffer),
      } as unknown as Response);
    });

    const result = await loadStageModels(
      "/models/upper.stl",
      "/models/lower.stl",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.models.upperStl).toBe(mockUpper);
      expect(result.models.lowerStl).toBe(mockLower);
    }
  });

  it("returns error outcome when HTTP status is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await loadStageModels(
      "/models/missing-upper.stl",
      "/models/missing-lower.stl",
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("404");
    }
  });

  it("handles fetch cancellation via AbortSignal", async () => {
    const controller = new AbortController();
    globalThis.fetch = vi
      .fn()
      .mockImplementation((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("The operation was aborted");
            err.name = "AbortError";
            reject(err);
          });
        });
      });

    const promise = loadStageModels(
      "/models/upper.stl",
      "/models/lower.stl",
      controller.signal,
    );
    controller.abort();
    const result = await promise;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("Load cancelled");
    }
  });

  it("exposes the shared STLLoader instance", () => {
    expect(stlLoader).toBeDefined();
    expect(typeof stlLoader.parse).toBe("function");
  });
});

describe("Treatment Viewer Application", () => {
  let root: HTMLElement;
  let fakeViewport: FakeViewport;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearStlBufferCache();
    root = document.createElement("div");
    document.body.appendChild(root);
    fakeViewport = new FakeViewport();

    // Mock fetch to succeed immediately with dummy STL buffers
    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(84)),
      } as unknown as Response),
    );
  });

  afterEach(() => {
    clearStlBufferCache();
    root.remove();
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("mounts DOM elements and loads initial stage", async () => {
    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: true,
    });

    expect(root.querySelector(".tv-app")).not.toBeNull();
    expect(root.querySelector(".tv-canvas")).not.toBeNull();
    expect(root.querySelector(".tv-slider")).not.toBeNull();
    // .tv-link-btn (scan viewer link) has been intentionally removed from the header.

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    expect(fakeViewport.gridVisible).toBe(false);
    expect(fakeViewport.layers.length).toBe(2);
    expect(fakeViewport.layers[0]?.id).toBe(UPPER_ARCH_ID);
    expect(fakeViewport.layers[0]?.colour).toBe(UPPER_ARCH_COLOUR);
    expect(fakeViewport.layers[1]?.id).toBe(LOWER_ARCH_ID);
    expect(fakeViewport.layers[1]?.colour).toBe(LOWER_ARCH_COLOUR);

    app.dispose();
  });

  it("navigates to next and previous stages", async () => {
    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: true,
      transitionDurationMs: 0,
    });

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    await app.navigate(1);
    expect(app.getState().currentIndex).toBe(1);

    const stageLabel = root.querySelector(".tv-stage-label");
    expect(stageLabel?.textContent).toContain("Stage 2");

    await app.navigate(0);
    expect(app.getState().currentIndex).toBe(0);
    expect(stageLabel?.textContent).toContain("Stage 1");

    app.dispose();
  });

  it("smoothly transitions between stages with opacity cross-dissolve", async () => {
    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: true,
      transitionDurationMs: 400,
    });

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    // Navigate to stage 2: starts cross-dissolve transition
    await app.navigate(1);
    expect(app.getState().currentIndex).toBe(1);

    // Initial opacity changes recorded
    const zeroOpacities = fakeViewport.opacityChanges.filter(
      (c) => c.opacity === 0,
    );
    expect(zeroOpacities.length).toBeGreaterThanOrEqual(2);

    app.dispose();
  });

  it("supports cases whose first stage starts at Stage 5 without renumbering", async () => {
    const caseStartingAtStage5: CaseManifest = {
      caseId: "case-5",
      patientName: "Patient Five",
      treatmentStages: [
        {
          id: "stage-05",
          stageNumber: 5,
          label: "Stage 5",
          doctorOnly: false,
          upper: { filename: "upper_05.stl", url: "/models/upper_05.stl" },
          lower: { filename: "lower_05.stl", url: "/models/lower_05.stl" },
        },
        {
          id: "stage-06",
          stageNumber: 6,
          label: "Stage 6",
          doctorOnly: false,
          upper: { filename: "upper_06.stl", url: "/models/upper_06.stl" },
          lower: { filename: "lower_06.stl", url: "/models/lower_06.stl" },
        },
      ],
      templateStages: [],
      ambiguities: [],
    };

    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      caseManifest: caseStartingAtStage5,
      autoLoad: true,
    });

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    const stageLabel = root.querySelector(".tv-stage-label");
    // Must preserve "Stage 5" rather than forcibly renumbering to "Stage 1"
    expect(stageLabel?.textContent).toContain("Stage 5");
    expect(stageLabel?.textContent).toContain("1 of 2");

    await app.navigate(1);
    expect(stageLabel?.textContent).toContain("Stage 6");
    expect(stageLabel?.textContent).toContain("2 of 2");

    app.dispose();
  });

  it("excludes doctor-only template from patient slider and handles doctor inspection", async () => {
    const manifestWithTemplate: CaseManifest = {
      caseId: "case-tmpl",
      treatmentStages: [
        {
          id: "stage-01",
          stageNumber: 1,
          label: "Stage 1",
          doctorOnly: false,
          upper: { filename: "upper_01.stl", url: "/models/upper_01.stl" },
          lower: { filename: "lower_01.stl", url: "/models/lower_01.stl" },
        },
      ],
      templateStages: [
        {
          id: "template-01",
          label: "Pre-Op Template",
          doctorOnly: true,
          upper: {
            filename: "upper_template.stl",
            url: "/models/upper_template.stl",
          },
          lower: {
            filename: "lower_template.stl",
            url: "/models/lower_template.stl",
          },
        },
      ],
      ambiguities: [],
    };

    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      caseManifest: manifestWithTemplate,
      autoLoad: true,
    });

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    // Patient slider max must only count patient stages (1), excluding template
    const slider = root.querySelector<HTMLInputElement>(".tv-slider");
    expect(slider?.max).toBe("1");

    // Doctor inspects the template
    await app.inspectTemplate(manifestWithTemplate.templateStages[0]!);
    expect(app.getState().activeTemplateStage?.id).toBe("template-01");

    // Notice banner should be visible
    const templateNotice = root.querySelector(".tv-template-notice");
    expect(templateNotice?.getAttribute("hidden")).toBeNull();

    // Slider should be disabled while viewing template
    expect(slider?.disabled).toBe(true);

    app.dispose();
  });

  it("opens the stage & file selector modal", async () => {
    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: true,
    });

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    app.openStageSelector();

    const modal = document.querySelector(".tv-modal");
    expect(modal).not.toBeNull();
    expect(modal?.textContent).toContain("Case Setup");
    expect(modal?.textContent).toContain("Doctor-Only");
    expect(modal?.textContent).toContain("Patient Treatment Progression");

    const closeBtn = modal?.querySelector<HTMLButtonElement>("button");
    closeBtn?.click();
    expect(document.querySelector(".tv-modal")).toBeNull();

    app.dispose();
  });

  it("supports toggling Upper and Lower arch visibility independently", async () => {
    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: true,
    });

    await vi.waitFor(() => {
      expect(app.getState().currentIndex).toBe(0);
    });

    expect(app.getState().upperVisible).toBe(true);
    expect(app.getState().lowerVisible).toBe(true);

    app.toggleUpper();
    expect(app.getState().upperVisible).toBe(false);
    expect(
      fakeViewport.visibilityChanges.some(
        (c) => c.id === UPPER_ARCH_ID && c.visible === false,
      ),
    ).toBe(true);

    app.toggleLower();
    expect(app.getState().lowerVisible).toBe(false);
    expect(
      fakeViewport.visibilityChanges.some(
        (c) => c.id === LOWER_ARCH_ID && c.visible === false,
      ),
    ).toBe(true);

    await app.navigate(1);
    expect(app.getState().upperVisible).toBe(false);
    expect(app.getState().lowerVisible).toBe(false);

    app.dispose();
  });

  it("controls autoplay playback", () => {
    vi.useFakeTimers();

    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: false,
      autoplayIntervalMs: 1000,
    });

    expect(app.getState().isPlaying).toBe(false);

    app.togglePlay();
    expect(app.getState().isPlaying).toBe(true);

    app.togglePlay();
    expect(app.getState().isPlaying).toBe(false);

    app.dispose();
    vi.useRealTimers();
  });

  it("displays an error notice when a model load fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: false,
    });

    await app.navigate(0);

    const statusEl = root.querySelector(".tv-status");
    expect(statusEl?.textContent).toContain("500");
    expect(statusEl?.classList.contains("tv-status--error")).toBe(true);

    app.dispose();
  });

  it("properly disposes and cleans up the DOM and listeners", () => {
    const app = createTreatmentApp(root, {
      createViewport: () => fakeViewport,
      autoLoad: false,
    });

    expect(root.children.length).toBeGreaterThan(0);
    app.dispose();
    expect(root.children.length).toBe(0);
    expect(fakeViewport.disposed).toBe(true);
  });
});
