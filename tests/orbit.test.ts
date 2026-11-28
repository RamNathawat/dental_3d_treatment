// @vitest-environment happy-dom
import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { turnAbout, turnFor } from "../src/viewer/orbit";

/** A full turn, as a drag is measured in. */
const TWO_PI = Math.PI * 2;

/** How far off the camera's line of sight the centre is, in radians: its place on the screen. */
function bearing(camera: PerspectiveCamera, centre: Vector3): number {
  const looking = camera.getWorldDirection(new Vector3());
  const towardsCentre = centre.clone().sub(camera.position).normalize();

  return Math.acos(Math.min(Math.max(looking.dot(towardsCentre), -1), 1));
}

/** A camera looking at the origin from the front, slightly above, as a load frames it. */
function framedCamera(): PerspectiveCamera {
  const camera = new PerspectiveCamera(45, 1, 0.1, 10_000);
  camera.up.set(0, 0, 1);
  camera.position.set(0, -100, 35);
  camera.lookAt(0, 0, 0);
  return camera;
}

const MIDDLE = new Vector3(0, 0, 0);
/** Off to one side and lower down, as a tooth or a preparation die would be. */
const OFF_TO_ONE_SIDE = new Vector3(12, 0, -4);

describe("how far a drag turns the camera", () => {
  it("is a full turn for a drag across the height of the canvas", () => {
    expect(Math.abs(turnFor({ x: 0, y: 600 }, 600).pitch)).toBeCloseTo(
      TWO_PI,
      9,
    );
    expect(Math.abs(turnFor({ x: 600, y: 0 }, 600).yaw)).toBeCloseTo(TWO_PI, 9);
  });

  it("turns a longer canvas less for the same drag, so the model keeps pace with the pointer", () => {
    expect(Math.abs(turnFor({ x: 100, y: 0 }, 1000).yaw)).toBeLessThan(
      Math.abs(turnFor({ x: 100, y: 0 }, 500).yaw),
    );
  });

  it("turns nowhere at all for a drag that went nowhere", () => {
    const turn = turnFor({ x: 0, y: 0 }, 600);

    expect(Math.abs(turn.yaw)).toBe(0);
    expect(Math.abs(turn.pitch)).toBe(0);
  });

  it("has something to say about a canvas with no height yet", () => {
    expect(Number.isFinite(turnFor({ x: 10, y: 10 }, 0).yaw)).toBe(true);
  });
});

describe("turning about the orbit centre", () => {
  it("leaves the centre exactly where it was on the screen", () => {
    const camera = framedCamera();
    const before = bearing(camera, OFF_TO_ONE_SIDE);

    turnAbout(camera, OFF_TO_ONE_SIDE, { yaw: 0.4, pitch: 0.2 });

    // What the camera turns about does not move across the screen: everything else swings around it,
    // which is what makes it the centre.
    expect(bearing(camera, OFF_TO_ONE_SIDE)).toBeCloseTo(before, 9);
  });

  it("keeps the camera the same distance from it", () => {
    const camera = framedCamera();
    const before = camera.position.distanceTo(OFF_TO_ONE_SIDE);

    turnAbout(camera, OFF_TO_ONE_SIDE, { yaw: 1.1, pitch: -0.3 });

    expect(camera.position.distanceTo(OFF_TO_ONE_SIDE)).toBeCloseTo(before, 9);
  });

  it("turns the camera about the centre rather than about what it looks at", () => {
    const camera = framedCamera();
    const looked = camera.getWorldDirection(new Vector3());

    turnAbout(camera, OFF_TO_ONE_SIDE, { yaw: 0.5, pitch: 0 });

    // The camera looks somewhere else now, by the same amount it turned: it is a rigid turn, not a
    // re-aim at the centre.
    const looking = camera.getWorldDirection(new Vector3());
    expect(looking.angleTo(looked)).toBeGreaterThan(0.4);
  });

  it("takes the camera round the centre the way it was turned", () => {
    const sideways = framedCamera();
    turnAbout(sideways, MIDDLE, { yaw: 0.3, pitch: 0 });
    expect(sideways.position.x).toBeGreaterThan(1);

    // A pitch is the change in how far up, from the centre, the camera stands: a negative one lifts
    // it, which is what dragging downwards does.
    const upwards = framedCamera();
    const before = upwards.position.z;
    turnAbout(upwards, MIDDLE, { yaw: 0, pitch: -0.3 });
    expect(upwards.position.z).toBeGreaterThan(before);
  });

  it("orbits freely 360 degrees over the poles without hitting a gimbal wall", () => {
    const camera = framedCamera();
    const startPos = camera.position.clone();
    const HEIGHT = 600;

    // Rotate 4 x 90 degrees vertically right over the pole and back to start
    for (let i = 0; i < 4; i++) {
      turnAbout(camera, MIDDLE, turnFor({ x: 0, y: HEIGHT / 4 }, HEIGHT));
    }

    expect(camera.position.distanceTo(startPos)).toBeLessThan(1e-4);
    expect(Number.isFinite(camera.position.length())).toBe(true);
  });

  it("does nothing it cannot do, rather than something at random", () => {
    const camera = framedCamera();
    const stood = camera.position.clone();
    // The camera standing on the centre it is asked to turn about.
    camera.position.copy(MIDDLE);

    turnAbout(camera, MIDDLE, { yaw: 0.4, pitch: 0.4 });

    expect(camera.position.toArray()).toEqual(MIDDLE.toArray());
    expect(stood.length()).toBeGreaterThan(0);
  });
});

/**
 * Verifies pointer-aligned motion in every standard view (Front, Back, Left, Right, Top, Bottom):
 * dragging right always moves the front-facing surface right on screen; dragging down moves it down.
 */
describe("pointer-aligned drag direction across all views", () => {
  const HEIGHT = 600;

  it.each([
    { label: "Front", pos: [0, 0, 100] as const, up: [0, 1, 0] as const },
    { label: "Back", pos: [0, 0, -100] as const, up: [0, 1, 0] as const },
    { label: "Left", pos: [-100, 0, 0] as const, up: [0, 1, 0] as const },
    { label: "Right", pos: [100, 0, 0] as const, up: [0, 1, 0] as const },
    { label: "Bottom", pos: [0, -100, 0] as const, up: [0, 0, 1] as const },
    { label: "Top", pos: [0, 100, 0] as const, up: [0, 0, 1] as const },
  ])("moves front surface directly with the pointer from $label view", ({ pos, up }) => {
    const makeCam = () => {
      const c = new PerspectiveCamera(45, 1, 0.1, 10_000);
      c.up.set(up[0], up[1], up[2]);
      c.position.set(pos[0], pos[1], pos[2]);
      c.lookAt(0, 0, 0);
      return c;
    };

    const camR = makeCam();
    const nearSurface = camR.getWorldDirection(new Vector3()).multiplyScalar(-10);
    turnAbout(camR, MIDDLE, turnFor({ x: 80, y: 0 }, HEIGHT));
    const ndcR = nearSurface.clone().project(camR);
    expect(ndcR.x).toBeGreaterThan(0.05);

    const camD = makeCam();
    turnAbout(camD, MIDDLE, turnFor({ x: 0, y: 80 }, HEIGHT));
    const ndcD = nearSurface.clone().project(camD);
    expect(ndcD.y).toBeLessThan(-0.05);
  });
});
