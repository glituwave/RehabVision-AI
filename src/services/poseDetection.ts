/**
 * Pose Detection and Biomechanical Mathematics Service
 * Integrates MediaPipe Tasks Vision PoseLandmarker with robust fallback and canvas rendering.
 */

import { FilesetResolver, PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { NormalizedLandmark } from '../types';

export const POSE_CONNECTIONS: [number, number][] = [
  // Torso
  [11, 12], // Left shoulder - Right shoulder
  [11, 23], // Left shoulder - Left hip
  [12, 24], // Right shoulder - Right hip
  [23, 24], // Left hip - Right hip
  // Left arm
  [11, 13], // Left shoulder - Left elbow
  [13, 15], // Left elbow - Left wrist
  // Right arm
  [12, 14], // Right shoulder - Right elbow
  [14, 16], // Right elbow - Right wrist
  // Left leg
  [23, 25], // Left hip - Left knee
  [25, 27], // Left knee - Left ankle
  // Right leg
  [24, 26], // Right hip - Right knee
  [26, 28], // Right knee - Right ankle
  // Head
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 7],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10]
];

export const LANDMARK_INDEX = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32
} as const;

export class PoseDetectionService {
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitializing: boolean = false;
  private initError: string | null = null;

  async initialize(): Promise<PoseLandmarker | null> {
    if (this.poseLandmarker) return this.poseLandmarker;
    if (this.isInitializing) {
      // Wait for completion
      while (this.isInitializing) {
        await new Promise(r => setTimeout(r, 100));
      }
      return this.poseLandmarker;
    }

    this.isInitializing = true;
    this.initError = null;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.isInitializing = false;
      return this.poseLandmarker;
    } catch (err: unknown) {
      console.warn('Failed to load MediaPipe Pose Landmarker with GPU delegate, trying CPU fallback:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numPoses: 1
        });
        this.isInitializing = false;
        return this.poseLandmarker;
      } catch (cpuErr: unknown) {
        const message = cpuErr instanceof Error ? cpuErr.message : String(cpuErr);
        this.initError = message;
        this.isInitializing = false;
        console.error('Failed to initialize PoseLandmarker even on CPU:', cpuErr);
        return null;
      }
    }
  }

  getInitError(): string | null {
    return this.initError;
  }

  detectForVideo(videoElement: HTMLVideoElement, timestampMs: number): PoseLandmarkerResult | null {
    if (!this.poseLandmarker) return null;
    try {
      if (videoElement.readyState >= 2) {
        return this.poseLandmarker.detectForVideo(videoElement, timestampMs);
      }
    } catch (err) {
      console.error('Error during detectForVideo:', err);
    }
    return null;
  }

  /**
   * Calculates angle at vertex point B between line BA and line BC.
   * Returns degrees in [0, 180].
   */
  static calculateJointAngle(
    a: NormalizedLandmark,
    b: NormalizedLandmark,
    c: NormalizedLandmark
  ): number {
    const vBAx = a.x - b.x;
    const vBAy = a.y - b.y;
    const vBCx = c.x - b.x;
    const vBCy = c.y - b.y;

    const dotProduct = vBAx * vBCx + vBAy * vBCy;
    const magnitudeBA = Math.sqrt(vBAx * vBAx + vBAy * vBAy);
    const magnitudeBC = Math.sqrt(vBCx * vBCx + vBCy * vBCy);

    if (magnitudeBA === 0 || magnitudeBC === 0) return 0;

    const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magnitudeBA * magnitudeBC)));
    const angleRad = Math.acos(cosTheta);
    return Math.round((angleRad * 180) / Math.PI);
  }

  /**
   * Calculates vertical angle of a vector from horizontal or vertical axis (e.g. torso inclination)
   */
  static calculateVerticalInclination(top: NormalizedLandmark, bottom: NormalizedLandmark): number {
    const dx = top.x - bottom.x;
    const dy = top.y - bottom.y; // In screen space, y increases downwards
    const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
    return Math.round((angleRad * 180) / Math.PI); // 0° is perfectly vertical, >20° means leaning
  }

  /**
   * Draws modern healthcare-grade skeleton and confidence visualizer onto canvas
   */
  static renderSkeleton(
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    canvasWidth: number,
    canvasHeight: number,
    highlightJointIndices: number[] = [],
    highlightAngleText?: string
  ): void {
    ctx.save();

    // 1. Draw connections
    POSE_CONNECTIONS.forEach(([startIndex, endIndex]) => {
      const p1 = landmarks[startIndex];
      const p2 = landmarks[endIndex];

      if (!p1 || !p2) return;
      const vis1 = p1.visibility ?? 1;
      const vis2 = p2.visibility ?? 1;
      if (vis1 < 0.35 || vis2 < 0.35) return;

      const x1 = p1.x * canvasWidth;
      const y1 = p1.y * canvasHeight;
      const x2 = p2.x * canvasWidth;
      const y2 = p2.y * canvasHeight;

      // Check if this segment connects to a highlighted joint
      const isTargetSegment =
        highlightJointIndices.includes(startIndex) || highlightJointIndices.includes(endIndex);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      if (isTargetSegment) {
        ctx.strokeStyle = '#0d9488'; // Vibrant medical teal
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(13, 148, 136, 0.6)';
        ctx.shadowBlur = 8;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
      }

      ctx.lineCap = 'round';
      ctx.stroke();
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // 2. Draw landmark points
    landmarks.forEach((landmark, index) => {
      const vis = landmark.visibility ?? 1;
      if (vis < 0.35) return;

      const x = landmark.x * canvasWidth;
      const y = landmark.y * canvasHeight;
      const isTarget = highlightJointIndices.includes(index);

      // Outer ring for highlighted target joint
      if (isTarget) {
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(13, 148, 136, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = '#14b8a6';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      } else {
        // Standard joint
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = vis > 0.7 ? '#10b981' : '#f59e0b'; // Emerald if high confidence, amber if medium
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // 3. Draw angle callout badge near primary joint vertex if provided
    if (highlightAngleText && highlightJointIndices.length > 0) {
      const vertexIndex = highlightJointIndices[0];
      const vertex = landmarks[vertexIndex];
      if (vertex && (vertex.visibility ?? 1) > 0.4) {
        const x = vertex.x * canvasWidth;
        const y = vertex.y * canvasHeight;

        const badgeX = Math.min(canvasWidth - 70, Math.max(70, x + 24));
        const badgeY = Math.min(canvasHeight - 30, Math.max(30, y - 10));

        // Pill background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        const textWidth = ctx.measureText(highlightAngleText).width;
        const padX = 10;
        const padY = 6;
        const rectW = Math.max(64, textWidth + padX * 2);
        const rectH = 26;

        ctx.beginPath();
        ctx.roundRect(badgeX - rectW / 2, badgeY - rectH / 2, rectW, rectH, 6);
        ctx.fill();
        ctx.strokeStyle = '#14b8a6';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(highlightAngleText, badgeX, badgeY);
      }
    }

    ctx.restore();
  }
}

export const poseService = new PoseDetectionService();
