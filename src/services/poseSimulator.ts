/**
 * Biomechanical Pose Simulator
 * Generates synthetic kinematic 33-point landmarks for demonstration & testing
 * when physical webcams are unavailable or blocked in sandboxed environments.
 */

import { NormalizedLandmark } from '../types';

export class PoseSimulator {
  private startTime: number = Date.now();
  private exerciseId: string;

  constructor(exerciseId: string) {
    this.exerciseId = exerciseId;
    this.startTime = Date.now();
  }

  setExercise(exerciseId: string): void {
    this.exerciseId = exerciseId;
    this.startTime = Date.now();
  }

  generateLandmarks(): NormalizedLandmark[] {
    const elapsedSeconds = (Date.now() - this.startTime) / 1000;
    // Cycle period: ~3.8 seconds per repetition
    const cycle = (elapsedSeconds % 3.8) / 3.8;
    // Smooth sine easing: 0 at start -> 1 at midpoint -> 0 at end
    const progress = (1 - Math.cos(cycle * 2 * Math.PI)) / 2;

    // Create 33 landmarks with standard baseline posture
    const landmarks: NormalizedLandmark[] = Array.from({ length: 33 }, () => ({
      x: 0.5,
      y: 0.5,
      z: 0,
      visibility: 0.95
    }));

    // Baseline anatomy in normalized screen coordinates [0, 1]
    // Center is 0.5
    // Head
    landmarks[0] = { x: 0.50, y: 0.15, visibility: 0.99 }; // Nose
    landmarks[1] = { x: 0.51, y: 0.14, visibility: 0.99 };
    landmarks[2] = { x: 0.52, y: 0.14, visibility: 0.99 };
    landmarks[3] = { x: 0.53, y: 0.14, visibility: 0.99 };
    landmarks[4] = { x: 0.49, y: 0.14, visibility: 0.99 };
    landmarks[5] = { x: 0.48, y: 0.14, visibility: 0.99 };
    landmarks[6] = { x: 0.47, y: 0.14, visibility: 0.99 };
    landmarks[7] = { x: 0.55, y: 0.15, visibility: 0.95 };
    landmarks[8] = { x: 0.45, y: 0.15, visibility: 0.95 };
    landmarks[9] = { x: 0.51, y: 0.18, visibility: 0.95 };
    landmarks[10] = { x: 0.49, y: 0.18, visibility: 0.95 };

    // Shoulders
    landmarks[11] = { x: 0.42, y: 0.28, visibility: 0.98 }; // Left shoulder
    landmarks[12] = { x: 0.58, y: 0.28, visibility: 0.98 }; // Right shoulder

    // Hips
    landmarks[23] = { x: 0.44, y: 0.55, visibility: 0.98 }; // Left hip
    landmarks[24] = { x: 0.56, y: 0.55, visibility: 0.98 }; // Right hip

    // Default neutral arms
    landmarks[13] = { x: 0.40, y: 0.42, visibility: 0.95 }; // Left elbow
    landmarks[15] = { x: 0.39, y: 0.56, visibility: 0.95 }; // Left wrist

    landmarks[14] = { x: 0.60, y: 0.42, visibility: 0.95 }; // Right elbow
    landmarks[16] = { x: 0.61, y: 0.56, visibility: 0.95 }; // Right wrist

    // Default neutral legs
    landmarks[25] = { x: 0.44, y: 0.72, visibility: 0.95 }; // Left knee
    landmarks[27] = { x: 0.44, y: 0.90, visibility: 0.95 }; // Left ankle

    landmarks[26] = { x: 0.56, y: 0.72, visibility: 0.95 }; // Right knee
    landmarks[28] = { x: 0.56, y: 0.90, visibility: 0.95 }; // Right ankle

    // Exercise-specific dynamic trajectory alterations
    switch (this.exerciseId) {
      case 'arm-curls': {
        // Right elbow remains stationary at (0.60, 0.42)
        // Right wrist flexes up towards right shoulder
        const startWristX = 0.61;
        const startWristY = 0.56;
        const peakWristX = 0.59;
        const peakWristY = 0.31;

        landmarks[16] = {
          x: startWristX + (peakWristX - startWristX) * progress,
          y: startWristY + (peakWristY - startWristY) * progress,
          visibility: 0.98
        };
        break;
      }

      case 'knee-extensions': {
        // Seated posture: hips around y = 0.60, knees around y = 0.70
        landmarks[23].y = 0.60;
        landmarks[24].y = 0.60;
        landmarks[25] = { x: 0.44, y: 0.70, visibility: 0.95 };
        landmarks[27] = { x: 0.44, y: 0.88, visibility: 0.95 };

        // Right leg extends out horizontally
        landmarks[26] = { x: 0.56, y: 0.70, visibility: 0.98 }; // Right knee pivot
        const restAnkleX = 0.56;
        const restAnkleY = 0.88;
        const extAnkleX = 0.72;
        const extAnkleY = 0.71;

        landmarks[28] = {
          x: restAnkleX + (extAnkleX - restAnkleX) * progress,
          y: restAnkleY + (extAnkleY - restAnkleY) * progress,
          visibility: 0.98
        };
        break;
      }

      case 'squats': {
        // Hips descend from 0.55 down to 0.68
        const hipDrop = 0.13 * progress;
        landmarks[23].y = 0.55 + hipDrop;
        landmarks[24].y = 0.55 + hipDrop;

        // Knees bend outward/forward slightly
        landmarks[25] = { x: 0.42, y: 0.72 + hipDrop * 0.5, visibility: 0.98 };
        landmarks[26] = { x: 0.58, y: 0.72 + hipDrop * 0.5, visibility: 0.98 };

        // Shoulders also descend with torso inclination
        landmarks[11].y = 0.28 + hipDrop;
        landmarks[12].y = 0.28 + hipDrop;
        landmarks[0].y = 0.15 + hipDrop;
        break;
      }

      case 'shoulder-raises': {
        // Right arm lifts forward/upward in sagittal/frontal plane
        const restWristY = 0.56;
        const peakWristY = 0.28; // Shoulder level
        const restWristX = 0.61;
        const peakWristX = 0.62;

        const restElbowY = 0.42;
        const peakElbowY = 0.28;

        landmarks[14] = {
          x: 0.60,
          y: restElbowY + (peakElbowY - restElbowY) * progress,
          visibility: 0.98
        };
        landmarks[16] = {
          x: restWristX + (peakWristX - restWristX) * progress,
          y: restWristY + (peakWristY - restWristY) * progress,
          visibility: 0.98
        };
        break;
      }

      case 'shoulder-abduction': {
        // Right arm sweeps outwards laterally from side (0.61, 0.56) to (0.78, 0.28)
        const restX = 0.61;
        const restY = 0.56;
        const peakX = 0.78;
        const peakY = 0.28;

        const restElbowX = 0.60;
        const restElbowY = 0.42;
        const peakElbowX = 0.69;
        const peakElbowY = 0.28;

        landmarks[14] = {
          x: restElbowX + (peakElbowX - restElbowX) * progress,
          y: restElbowY + (peakElbowY - restElbowY) * progress,
          visibility: 0.98
        };
        landmarks[16] = {
          x: restX + (peakX - restX) * progress,
          y: restY + (peakY - restY) * progress,
          visibility: 0.98
        };
        break;
      }

      case 'seated-leg-raises': {
        // Seated base
        landmarks[23].y = 0.60;
        landmarks[24].y = 0.60;
        landmarks[25] = { x: 0.44, y: 0.70, visibility: 0.95 };
        landmarks[27] = { x: 0.44, y: 0.88, visibility: 0.95 };

        // Right straight leg elevates from 0.70/0.88 up towards 0.62/0.60
        const kneeLift = 0.08 * progress;
        const ankleLift = 0.16 * progress;

        landmarks[26] = { x: 0.60, y: 0.70 - kneeLift, visibility: 0.98 };
        landmarks[28] = { x: 0.72, y: 0.76 - ankleLift, visibility: 0.98 };
        break;
      }
    }

    return landmarks;
  }
}
