import { Quaternion, Vector3, type Camera } from "three";

/** A full turn, which is what a drag across the height of the canvas is. */
const TWO_PI = Math.PI * 2;

/** How far a drag turns the camera. */
export interface OrbitTurn {
  /** About the camera's local vertical axis: what a sideways drag does. */
  readonly yaw: number;
  /** About the camera's local horizontal axis: what dragging up and down does. */
  readonly pitch: number;
}

/**
 * How far a drag turns the camera.
 */
export function turnFor(
  drag: { readonly x: number; readonly y: number },
  height: number,
): OrbitTurn {
  const rate = TWO_PI / Math.max(height, 1);

  return { yaw: -rate * drag.x, pitch: -rate * drag.y };
}

/**
 * Turns the camera freely in 360 degrees about `centre` in screen/camera space:
 * sideways drags rotate around the camera's current local up axis, vertical drags
 * rotate around the camera's current local right axis — eliminating polar gimbal lock
 * and fixed-axis skewering across Front, Top, Bottom, and upside-down views.
 */
export function turnAbout(
  camera: Camera,
  centre: Vector3,
  turn: OrbitTurn,
): void {
  const offset = camera.position.clone().sub(centre);
  if (offset.lengthSq() === 0) return;

  camera.updateMatrixWorld();
  const camRight = new Vector3(1, 0, 0)
    .applyQuaternion(camera.quaternion)
    .normalize();
  const camUp = new Vector3(0, 1, 0)
    .applyQuaternion(camera.quaternion)
    .normalize();

  const qPitch = new Quaternion().setFromAxisAngle(camRight, turn.pitch);
  const qYaw = new Quaternion().setFromAxisAngle(camUp, turn.yaw);
  const q = qYaw.multiply(qPitch);

  offset.applyQuaternion(q);
  camera.position.copy(centre).add(offset);
  camera.quaternion.premultiply(q).normalize();
  camera.up.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
  camera.updateMatrixWorld();
}
