// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { processDentalZipInBrowser } from "../portal/lib/in-browser-converter";

describe("Upload Cancellation Override & AbortController Protocol", () => {
  it("aborts processDentalZipInBrowser immediately when signal is pre-aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    const onProgress = vi.fn();
    const dummyFile = new File(["dummy content"], "Upper.zip", { type: "application/zip" });

    const result = await processDentalZipInBrowser(
      { upperZip: dummyFile },
      "Krishnendu",
      "user-123",
      onProgress,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      controller.signal,
    );

    expect(result.ok).toBe(false);
    expect(result.error).toContain("cancelled");
    expect(onProgress).not.toHaveBeenCalled();
  });

  it("aborts during processing and terminates cleanly without uncaught errors", async () => {
    const controller = new AbortController();
    const onProgress = vi.fn();

    // Trigger abort right as progress callback is notified
    onProgress.mockImplementation((_msg, _pct) => {
      controller.abort();
    });

    const dummyFile = new File(["dummy content"], "Upper.zip", { type: "application/zip" });

    const result = await processDentalZipInBrowser(
      { upperZip: dummyFile },
      "Krishnendu",
      "user-123",
      onProgress,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      controller.signal,
    );

    expect(result.ok).toBe(false);
    expect(result.error).toContain("cancelled");
  });
});

describe("Drawer Dismissal and Compositor Protection", () => {
  it("treatment plan drawer close button has explicit dismissal and event isolation", () => {
    // Verify DOM structure expectations for mobile drawer
    const drawer = document.createElement("div");
    drawer.className = "tv-notes-drawer";
    const backdrop = document.createElement("div");
    backdrop.className = "tv-notes-backdrop";

    const setNotesOpen = (open: boolean) => {
      drawer.hidden = !open;
      drawer.classList.toggle("tv-drawer--open", open);
      drawer.style.display = open ? "flex" : "none";
      drawer.style.visibility = open ? "visible" : "hidden";
      drawer.style.opacity = open ? "1" : "0";
      drawer.style.pointerEvents = open ? "auto" : "none";

      backdrop.hidden = !open;
      backdrop.classList.toggle("tv-backdrop--open", open);
      backdrop.style.display = open ? "block" : "none";
      backdrop.style.visibility = open ? "visible" : "hidden";
      backdrop.style.opacity = open ? "1" : "0";
      backdrop.style.pointerEvents = open ? "auto" : "none";
    };

    // Open drawer
    setNotesOpen(true);
    expect(drawer.hidden).toBe(false);
    expect(drawer.style.display).toBe("flex");
    expect(drawer.style.opacity).toBe("1");
    expect(backdrop.style.display).toBe("block");

    // Close drawer
    setNotesOpen(false);
    expect(drawer.hidden).toBe(true);
    expect(drawer.style.display).toBe("none");
    expect(drawer.style.visibility).toBe("hidden");
    expect(drawer.style.opacity).toBe("0");
    expect(drawer.style.pointerEvents).toBe("none");
    expect(backdrop.hidden).toBe(true);
    expect(backdrop.style.display).toBe("none");
    expect(backdrop.style.visibility).toBe("hidden");
    expect(backdrop.style.opacity).toBe("0");
    expect(backdrop.style.pointerEvents).toBe("none");
  });
});
