/**
 * Biomechanical Exercise State Machine Engine
 * Handles angle computation, state transitions with hysteresis, repetition validation,
 * cadence monitoring, and postural compensation alerts.
 */

import { NormalizedLandmark, FormFeedbackEvent } from '../types';
import { PoseDetectionService, LANDMARK_INDEX } from './poseDetection';

export type MovementPhase = 'READY' | 'ASCENDING' | 'PEAK' | 'DESCENDING';

export interface ExerciseEngineOutput {
  currentAngle: number;
  targetMinAngle: number;
  targetMaxAngle: number;
  movementPhase: MovementPhase;
  phaseProgress: number; // 0 to 100% of current repetition
  repsCount: number;
  feedbackMessage: string;
  feedbackType: 'info' | 'success' | 'warning' | 'correction';
  highlightJointIndices: number[];
  formScoreThisRep: number;
  isPostureValid: boolean;
  landmarksVisible: boolean;
}

export class ExerciseEngine {
  private exerciseId: string;
  private repsCount: number = 0;
  private currentPhase: MovementPhase = 'READY';
  private phaseStartTime: number = 0;
  private repStartTime: number = 0;
  private peakAngleAchieved: number = 0;
  private repScores: number[] = [];
  private lastRepTimestamp: number = 0;
  private side: 'right' | 'left' = 'right';

  // Hysteresis flags
  private hasReachedPeak: boolean = false;
  private minAngleDuringRep: number = 180;
  private maxAngleDuringRep: number = 0;

  constructor(exerciseId: string, preferredSide: 'right' | 'left' = 'right') {
    this.exerciseId = exerciseId;
    this.side = preferredSide;
    this.reset();
  }

  reset(): void {
    this.repsCount = 0;
    this.currentPhase = 'READY';
    this.phaseStartTime = Date.now();
    this.repStartTime = Date.now();
    this.peakAngleAchieved = 0;
    this.repScores = [];
    this.hasReachedPeak = false;
    this.minAngleDuringRep = 180;
    this.maxAngleDuringRep = 0;
  }

  setSide(side: 'right' | 'left'): void {
    this.side = side;
  }

  getRepsCount(): number {
    return this.repsCount;
  }

  getAverageFormScore(): number {
    if (this.repScores.length === 0) return 92;
    const sum = this.repScores.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.repScores.length);
  }

  getMaxRangeOfMotion(): number {
    return this.peakAngleAchieved;
  }

  processPose(landmarks: NormalizedLandmark[]): ExerciseEngineOutput {
    const now = Date.now();

    // Default response
    const defaultOutput: ExerciseEngineOutput = {
      currentAngle: 0,
      targetMinAngle: 0,
      targetMaxAngle: 180,
      movementPhase: this.currentPhase,
      phaseProgress: 0,
      repsCount: this.repsCount,
      feedbackMessage: 'Position yourself in full view of the camera',
      feedbackType: 'info',
      highlightJointIndices: [],
      formScoreThisRep: 100,
      isPostureValid: true,
      landmarksVisible: false
    };

    if (!landmarks || landmarks.length < 33) {
      return defaultOutput;
    }

    // Determine landmarks based on active side
    const isRight = this.side === 'right';
    const shoulderIdx = isRight ? LANDMARK_INDEX.RIGHT_SHOULDER : LANDMARK_INDEX.LEFT_SHOULDER;
    const elbowIdx = isRight ? LANDMARK_INDEX.RIGHT_ELBOW : LANDMARK_INDEX.LEFT_ELBOW;
    const wristIdx = isRight ? LANDMARK_INDEX.RIGHT_WRIST : LANDMARK_INDEX.LEFT_WRIST;
    const hipIdx = isRight ? LANDMARK_INDEX.RIGHT_HIP : LANDMARK_INDEX.LEFT_HIP;
    const kneeIdx = isRight ? LANDMARK_INDEX.RIGHT_KNEE : LANDMARK_INDEX.LEFT_KNEE;
    const ankleIdx = isRight ? LANDMARK_INDEX.RIGHT_ANKLE : LANDMARK_INDEX.LEFT_ANKLE;

    const shoulder = landmarks[shoulderIdx];
    const elbow = landmarks[elbowIdx];
    const wrist = landmarks[wristIdx];
    const hip = landmarks[hipIdx];
    const knee = landmarks[kneeIdx];
    const ankle = landmarks[ankleIdx];

    // Check torso posture
    const torsoLeaningAngle = PoseDetectionService.calculateVerticalInclination(
      shoulder,
      hip
    );
    const isTorsoExcessiveLean = torsoLeaningAngle > 28;

    let currentAngle = 0;
    let targetMin = 45;
    let targetMax = 160;
    let highlightIndices: number[] = [];
    let requiredLandmarks: NormalizedLandmark[] = [];

    // State machine logic per exercise
    switch (this.exerciseId) {
      case 'arm-curls': {
        requiredLandmarks = [shoulder, elbow, wrist];
        highlightIndices = [elbowIdx, shoulderIdx, wristIdx];
        targetMin = 50;
        targetMax = 155;
        currentAngle = PoseDetectionService.calculateJointAngle(shoulder, elbow, wrist);
        break;
      }
      case 'knee-extensions': {
        requiredLandmarks = [hip, knee, ankle];
        highlightIndices = [kneeIdx, hipIdx, ankleIdx];
        targetMin = 90;
        targetMax = 170;
        currentAngle = PoseDetectionService.calculateJointAngle(hip, knee, ankle);
        break;
      }
      case 'squats': {
        requiredLandmarks = [hip, knee, ankle];
        highlightIndices = [kneeIdx, hipIdx, ankleIdx];
        targetMin = 95;
        targetMax = 168;
        currentAngle = PoseDetectionService.calculateJointAngle(hip, knee, ankle);
        break;
      }
      case 'shoulder-raises': {
        requiredLandmarks = [hip, shoulder, elbow];
        highlightIndices = [shoulderIdx, hipIdx, elbowIdx];
        targetMin = 20;
        targetMax = 90;
        currentAngle = PoseDetectionService.calculateJointAngle(hip, shoulder, elbow);
        break;
      }
      case 'shoulder-abduction': {
        requiredLandmarks = [hip, shoulder, wrist];
        highlightIndices = [shoulderIdx, hipIdx, wristIdx];
        targetMin = 20;
        targetMax = 90;
        currentAngle = PoseDetectionService.calculateJointAngle(hip, shoulder, wrist);
        break;
      }
      case 'seated-leg-raises': {
        requiredLandmarks = [shoulder, hip, knee];
        highlightIndices = [hipIdx, shoulderIdx, kneeIdx];
        targetMin = 85;
        targetMax = 118;
        currentAngle = PoseDetectionService.calculateJointAngle(shoulder, hip, knee);
        break;
      }
      default: {
        requiredLandmarks = [shoulder, elbow, wrist];
        highlightIndices = [elbowIdx];
        currentAngle = PoseDetectionService.calculateJointAngle(shoulder, elbow, wrist);
      }
    }

    // Validate visibility of required joints
    const areLandmarksVisible = requiredLandmarks.every(lm => (lm?.visibility ?? 0) > 0.42);
    if (!areLandmarksVisible) {
      return {
        ...defaultOutput,
        feedbackMessage: 'Stand in full view so the target joints are clearly visible',
        feedbackType: 'warning',
        highlightJointIndices: highlightIndices,
        landmarksVisible: false
      };
    }

    // Keep track of min/max angles in this rep
    this.minAngleDuringRep = Math.min(this.minAngleDuringRep, currentAngle);
    this.maxAngleDuringRep = Math.max(this.maxAngleDuringRep, currentAngle);
    this.peakAngleAchieved = Math.max(this.peakAngleAchieved, currentAngle);

    let feedbackMessage = 'Steady motion, good alignment';
    let feedbackType: 'info' | 'success' | 'warning' | 'correction' = 'info';
    let phaseProgress = 0;
    let repScore = 95;

    if (isTorsoExcessiveLean) {
      feedbackMessage = 'Keep your back straight and engage your core';
      feedbackType = 'correction';
      repScore -= 12;
    }

    // --- State machine execution ---
    switch (this.exerciseId) {
      case 'arm-curls': {
        // Start: Extended (angle > 140°)
        // Peak: Curled (angle < 60°)
        // End: Extended (angle > 140°)
        if (this.currentPhase === 'READY') {
          phaseProgress = 0;
          if (currentAngle > 135) {
            feedbackMessage = 'Arm fully extended. Begin curling upward.';
            feedbackType = 'info';
          } else {
            this.currentPhase = 'ASCENDING';
            this.repStartTime = now;
            this.hasReachedPeak = false;
          }
        } else if (this.currentPhase === 'ASCENDING') {
          // Progress from 140 -> 60
          const progressRatio = Math.max(0, Math.min(1, (140 - currentAngle) / (140 - 60)));
          phaseProgress = Math.round(progressRatio * 50);

          if (currentAngle <= 62) {
            this.currentPhase = 'PEAK';
            this.hasReachedPeak = true;
            this.phaseStartTime = now;
            feedbackMessage = 'Peak contraction! Hold for a moment.';
            feedbackType = 'success';
          } else {
            feedbackMessage = 'Curling up smoothly...';
          }
        } else if (this.currentPhase === 'PEAK') {
          phaseProgress = 50;
          feedbackMessage = 'Excellent peak squeeze. Now lower slowly.';
          feedbackType = 'success';
          if (currentAngle > 75) {
            this.currentPhase = 'DESCENDING';
          }
        } else if (this.currentPhase === 'DESCENDING') {
          // Progress from 50% to 100% as angle goes from 75 -> 140
          const returnRatio = Math.max(0, Math.min(1, (currentAngle - 60) / (140 - 60)));
          phaseProgress = Math.round(50 + returnRatio * 50);

          if (currentAngle >= 138 && this.hasReachedPeak) {
            const repDuration = (now - this.repStartTime) / 1000;
            if (repDuration < 1.0) {
              feedbackMessage = 'Move more slowly to protect your joint';
              feedbackType = 'warning';
              repScore -= 15;
            } else {
              feedbackMessage = 'Repetition completed! Clean controlled form.';
              feedbackType = 'success';
            }
            this.repsCount += 1;
            this.repScores.push(Math.max(65, repScore));
            this.currentPhase = 'READY';
            this.hasReachedPeak = false;
            this.minAngleDuringRep = 180;
            this.maxAngleDuringRep = 0;
          } else {
            feedbackMessage = 'Lowering with steady control...';
          }
        }
        break;
      }

      case 'knee-extensions': {
        // Start: Bent (angle < 105°)
        // Peak: Extended (angle > 158°)
        // End: Bent (angle < 105°)
        if (this.currentPhase === 'READY') {
          phaseProgress = 0;
          if (currentAngle < 105) {
            feedbackMessage = 'Knee bent in starting position. Extend leg forward.';
          } else {
            this.currentPhase = 'ASCENDING';
            this.repStartTime = now;
            this.hasReachedPeak = false;
          }
        } else if (this.currentPhase === 'ASCENDING') {
          const ratio = Math.max(0, Math.min(1, (currentAngle - 95) / (165 - 95)));
          phaseProgress = Math.round(ratio * 50);

          if (currentAngle >= 158) {
            this.currentPhase = 'PEAK';
            this.hasReachedPeak = true;
            this.phaseStartTime = now;
            feedbackMessage = 'Full knee extension achieved! Squeeze quadriceps.';
            feedbackType = 'success';
          } else {
            feedbackMessage = 'Extending knee upward...';
          }
        } else if (this.currentPhase === 'PEAK') {
          phaseProgress = 50;
          feedbackMessage = 'Holding extension at peak ROM.';
          feedbackType = 'success';
          if (currentAngle < 145) {
            this.currentPhase = 'DESCENDING';
          }
        } else if (this.currentPhase === 'DESCENDING') {
          const returnRatio = Math.max(0, Math.min(1, (160 - currentAngle) / (160 - 105)));
          phaseProgress = Math.round(50 + returnRatio * 50);

          if (currentAngle <= 105 && this.hasReachedPeak) {
            const repDuration = (now - this.repStartTime) / 1000;
            if (repDuration < 1.2) {
              feedbackMessage = 'Control the eccentric drop; lower more gradually';
              feedbackType = 'warning';
              repScore -= 10;
            } else {
              feedbackMessage = 'Repetition completed! Great knee mobility.';
              feedbackType = 'success';
            }
            this.repsCount += 1;
            this.repScores.push(Math.max(70, repScore));
            this.currentPhase = 'READY';
            this.hasReachedPeak = false;
          } else {
            feedbackMessage = 'Lowering leg smoothly back down...';
          }
        }
        break;
      }

      case 'squats': {
        // Start: Standing (angle > 160°)
        // Peak: Squatted (angle < 112°)
        // End: Standing (angle > 158°)
        if (this.currentPhase === 'READY') {
          phaseProgress = 0;
          if (currentAngle > 155) {
            feedbackMessage = 'Standing tall. Hinge at hips and descend smoothly.';
          } else {
            this.currentPhase = 'ASCENDING'; // Descending into squat
            this.repStartTime = now;
            this.hasReachedPeak = false;
          }
        } else if (this.currentPhase === 'ASCENDING') {
          const ratio = Math.max(0, Math.min(1, (160 - currentAngle) / (160 - 105)));
          phaseProgress = Math.round(ratio * 50);

          if (currentAngle <= 112) {
            this.currentPhase = 'PEAK';
            this.hasReachedPeak = true;
            feedbackMessage = 'Target depth reached! Maintain upright chest.';
            feedbackType = 'success';
          } else {
            feedbackMessage = 'Descending into squat...';
          }
        } else if (this.currentPhase === 'PEAK') {
          phaseProgress = 50;
          feedbackMessage = 'Drive through midfoot and heels to stand.';
          feedbackType = 'success';
          if (currentAngle > 120) {
            this.currentPhase = 'DESCENDING';
          }
        } else if (this.currentPhase === 'DESCENDING') {
          const returnRatio = Math.max(0, Math.min(1, (currentAngle - 110) / (160 - 110)));
          phaseProgress = Math.round(50 + returnRatio * 50);

          if (currentAngle >= 155 && this.hasReachedPeak) {
            feedbackMessage = 'Repetition completed! Excellent lower body drive.';
            feedbackType = 'success';
            this.repsCount += 1;
            this.repScores.push(Math.max(75, repScore));
            this.currentPhase = 'READY';
            this.hasReachedPeak = false;
          } else {
            feedbackMessage = 'Rising smoothly to upright posture...';
          }
        }
        break;
      }

      case 'shoulder-raises':
      case 'shoulder-abduction': {
        // Start: Arm down (angle < 28°)
        // Peak: Arm raised (angle > 82°)
        // End: Arm down (angle < 32°)
        if (this.currentPhase === 'READY') {
          phaseProgress = 0;
          if (currentAngle < 28) {
            feedbackMessage = 'Arm at side. Elevate arm toward shoulder height.';
          } else {
            this.currentPhase = 'ASCENDING';
            this.repStartTime = now;
            this.hasReachedPeak = false;
          }
        } else if (this.currentPhase === 'ASCENDING') {
          const ratio = Math.max(0, Math.min(1, (currentAngle - 25) / (85 - 25)));
          phaseProgress = Math.round(ratio * 50);

          if (currentAngle >= 82) {
            this.currentPhase = 'PEAK';
            this.hasReachedPeak = true;
            feedbackMessage = 'Shoulder height reached! Hold without hiking trap.';
            feedbackType = 'success';
          } else {
            feedbackMessage = 'Lifting smoothly in control...';
          }
        } else if (this.currentPhase === 'PEAK') {
          phaseProgress = 50;
          feedbackMessage = 'Steady shoulder height. Lower gradually.';
          feedbackType = 'success';
          if (currentAngle < 75) {
            this.currentPhase = 'DESCENDING';
          }
        } else if (this.currentPhase === 'DESCENDING') {
          const returnRatio = Math.max(0, Math.min(1, (80 - currentAngle) / (80 - 28)));
          phaseProgress = Math.round(50 + returnRatio * 50);

          if (currentAngle <= 30 && this.hasReachedPeak) {
            feedbackMessage = 'Repetition completed! Symmetrical shoulder movement.';
            feedbackType = 'success';
            this.repsCount += 1;
            this.repScores.push(Math.max(75, repScore));
            this.currentPhase = 'READY';
            this.hasReachedPeak = false;
          } else {
            feedbackMessage = 'Lowering arm back to side...';
          }
        }
        break;
      }

      case 'seated-leg-raises': {
        // Start: resting on seat (angle ~85°)
        // Peak: raised (angle > 110°)
        // End: resting (angle < 90°)
        if (this.currentPhase === 'READY') {
          phaseProgress = 0;
          if (currentAngle < 90) {
            feedbackMessage = 'Leg resting. Lift straight leg off the seat.';
          } else {
            this.currentPhase = 'ASCENDING';
            this.repStartTime = now;
            this.hasReachedPeak = false;
          }
        } else if (this.currentPhase === 'ASCENDING') {
          const ratio = Math.max(0, Math.min(1, (currentAngle - 85) / (115 - 85)));
          phaseProgress = Math.round(ratio * 50);

          if (currentAngle >= 110) {
            this.currentPhase = 'PEAK';
            this.hasReachedPeak = true;
            feedbackMessage = 'Leg elevated! Hold core tight without leaning back.';
            feedbackType = 'success';
          } else {
            feedbackMessage = 'Elevating straight leg...';
          }
        } else if (this.currentPhase === 'PEAK') {
          phaseProgress = 50;
          feedbackMessage = 'Controlled hold. Lower slowly.';
          feedbackType = 'success';
          if (currentAngle < 105) {
            this.currentPhase = 'DESCENDING';
          }
        } else if (this.currentPhase === 'DESCENDING') {
          const returnRatio = Math.max(0, Math.min(1, (110 - currentAngle) / (110 - 88)));
          phaseProgress = Math.round(50 + returnRatio * 50);

          if (currentAngle <= 88 && this.hasReachedPeak) {
            feedbackMessage = 'Repetition completed! Good quadriceps activation.';
            feedbackType = 'success';
            this.repsCount += 1;
            this.repScores.push(Math.max(75, repScore));
            this.currentPhase = 'READY';
            this.hasReachedPeak = false;
          } else {
            feedbackMessage = 'Lowering foot gently...';
          }
        }
        break;
      }
    }

    return {
      currentAngle,
      targetMinAngle: targetMin,
      targetMaxAngle: targetMax,
      movementPhase: this.currentPhase,
      phaseProgress: Math.min(100, Math.max(0, phaseProgress)),
      repsCount: this.repsCount,
      feedbackMessage,
      feedbackType,
      highlightJointIndices: highlightIndices,
      formScoreThisRep: repScore,
      isPostureValid: !isTorsoExcessiveLean,
      landmarksVisible: true
    };
  }
}
