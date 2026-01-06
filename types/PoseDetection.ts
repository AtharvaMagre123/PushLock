export type PoseLandmark = {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  };
  
  export type PoseFrame = {
    hasPerson: boolean;
    landmarks: PoseLandmark[];
    timestampMs: number;
  };
  