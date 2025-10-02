export const shortestAngleDelta = (fromDeg: number, toDeg: number) => ((toDeg - fromDeg + 540) % 360) - 180;
