/**
 * Exercise Library: Biomechanical definitions and clinical metadata
 */

import { ExerciseDefinition } from '../types';

export const EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  {
    id: 'arm-curls',
    name: 'Biceps Arm Curls',
    category: 'arms',
    difficulty: 'Beginner',
    targetRegion: 'Upper Extremity / Biceps Brachii',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearm Flexors'],
    description: 'Elbow flexion exercise to restore upper arm strength, functional elbow mobility, and distal tendon conditioning.',
    instructions: [
      'Stand or sit tall with feet shoulder-width apart and your elbow tucked close to your ribcage.',
      'Begin with your arm fully extended downwards (elbow angle around 155° - 170°).',
      'Smoothly flex your elbow, raising the forearm toward the shoulder until reaching peak flexion (< 55°).',
      'Pause briefly for peak contraction, then lower slowly back to full extension under control.'
    ],
    clinicalCautions: [
      'Do not swing your torso or use momentum to raise the arm.',
      'Keep your upper arm stationary against your torso; do not flare the elbow outward.',
      'Stop if you feel sharp pain at the anterior shoulder or medial elbow epicondyle.'
    ],
    defaultReps: 10,
    defaultSets: 3,
    targetAngleMin: 45,
    targetAngleMax: 160,
    primaryJoint: 'Right/Left Elbow',
    secondaryJoint: 'Shoulder stability',
    repPhaseStartAngle: 155, // extended
    repPhasePeakAngle: 55,   // curled
    iconName: 'Dumbbell'
  },
  {
    id: 'knee-extensions',
    name: 'Seated Knee Extensions',
    category: 'knees',
    difficulty: 'Beginner',
    targetRegion: 'Lower Extremity / Quadriceps & Patellar Tendon',
    targetMuscles: ['Quadriceps Femoris (Rectus Femoris, Vastus Medialis, Vastus Lateralis)'],
    description: 'Open-chain terminal knee extension to reactivate vastus medialis, restore active extension ROM, and reinforce patellofemoral tracking.',
    instructions: [
      'Sit comfortably upright in a sturdy chair with your back supported and thighs flat on the seat.',
      'Begin with the knee bent at approximately 90° in resting position.',
      'Slowly extend the target leg straight out in front of you until parallel to the floor (angle > 165°).',
      'Hold the contraction at terminal extension for 1-2 seconds, then slowly lower to resting position.'
    ],
    clinicalCautions: [
      'Avoid slumping backwards during extension; maintain lumbar stability.',
      'Do not hyperextend or snap the knee violently into lock-out.',
      'Consult your physical therapist if recovering from recent patellar graft reconstruction.'
    ],
    defaultReps: 12,
    defaultSets: 3,
    targetAngleMin: 90,
    targetAngleMax: 175,
    primaryJoint: 'Target Knee (Hip-Knee-Ankle)',
    secondaryJoint: 'Hip flexion angle',
    repPhaseStartAngle: 95,  // bent
    repPhasePeakAngle: 168, // extended
    iconName: 'Activity'
  },
  {
    id: 'shoulder-raises',
    name: 'Anterior Shoulder Raises',
    category: 'shoulders',
    difficulty: 'Intermediate',
    targetRegion: 'Shoulder Complex / Anterior Deltoid & Rotator Cuff',
    targetMuscles: ['Anterior Deltoid', 'Supraspinatus', 'Serratus Anterior'],
    description: 'Controlled sagittal plane elevation to rebuild anterior shoulder flexion and scapulohumeral rhythm.',
    instructions: [
      'Stand upright with feet planted hip-width apart and shoulder blades gently retracted.',
      'Start with your arms resting at your sides (humeral angle < 25°).',
      'Elevate your arm forward in a smooth arc until your hand is level with your shoulder (85° - 95°).',
      'Hold for 1 count without shrugging the trapezius, then descend with steady cadence.'
    ],
    clinicalCautions: [
      'Avoid hiking or shrugging your shoulder toward your ear during elevation.',
      'Do not arch your lower back (maintain core engagement).',
      'Stop elevation immediately if impingement pinches in the subacromial space.'
    ],
    defaultReps: 10,
    defaultSets: 3,
    targetAngleMin: 15,
    targetAngleMax: 95,
    primaryJoint: 'Glenohumeral Joint (Torso-Shoulder-Elbow)',
    secondaryJoint: 'Spine vertical alignment',
    repPhaseStartAngle: 25, // resting down
    repPhasePeakAngle: 88,  // parallel to floor
    iconName: 'ArrowUpCircle'
  },
  {
    id: 'shoulder-abduction',
    name: 'Standing Shoulder Abduction',
    category: 'shoulders',
    difficulty: 'Intermediate',
    targetRegion: 'Lateral Deltoid & Scapular Stabilizers',
    targetMuscles: ['Lateral Deltoid', 'Supraspinatus', 'Lower Trapezius'],
    description: 'Coronal plane arm elevation to expand active lateral range of motion and rotator cuff stabilization.',
    instructions: [
      'Stand facing the camera with your arms resting naturally at your sides.',
      'Keeping your elbow slightly relaxed (not locked rigid), raise your arm out to the side.',
      'Lift smoothly up to shoulder height (approximately 90° abduction) in the scapular plane.',
      'Slowly lower back to your side over a count of 2-3 seconds.'
    ],
    clinicalCautions: [
      'Avoid tilting your torso sideways to compensate for restricted elevation.',
      'Maintain palms angled slightly forward to prevent internal subacromial impingement.',
      'Never force movement through sharp acute resistance.'
    ],
    defaultReps: 10,
    defaultSets: 3,
    targetAngleMin: 20,
    targetAngleMax: 95,
    primaryJoint: 'Shoulder Abduction (Hip-Shoulder-Wrist)',
    secondaryJoint: 'Lateral spinal deviation',
    repPhaseStartAngle: 25, // arms down
    repPhasePeakAngle: 88,  // arms 90 deg out
    iconName: 'Maximize2'
  },
  {
    id: 'squats',
    name: 'Supported Functional Squats',
    category: 'legs',
    difficulty: 'Intermediate',
    targetRegion: 'Bilateral Lower Chain & Core',
    targetMuscles: ['Gluteus Maximus', 'Quadriceps Femoris', 'Hamstrings', 'Erector Spinae'],
    description: 'Closed-chain functional compound movement restoring knee flexion, hip hinge dynamics, and bilateral symmetrical weight distribution.',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward (5°-10°).',
      'Initiate the movement by sending your hips back as if sitting into an ergonomic chair.',
      'Descend until knees reach approximately 90°-100° flexion, keeping chest proud and spine neutral.',
      'Drive through your heels to return smoothly to an upright standing posture.'
    ],
    clinicalCautions: [
      'Ensure your knees track over your toes; avoid knee valgus (knees caving inward).',
      'Keep your weight balanced through midfoot and heel, not rocking onto toes.',
      'Maintain neutral lumbar curve without excessive forward trunk lean.'
    ],
    defaultReps: 8,
    defaultSets: 3,
    targetAngleMin: 85,
    targetAngleMax: 175,
    primaryJoint: 'Knee Flexion (Hip-Knee-Ankle)',
    secondaryJoint: 'Hip Hinge Angle',
    repPhaseStartAngle: 165, // standing
    repPhasePeakAngle: 95,   // deep squat
    iconName: 'Compass'
  },
  {
    id: 'seated-leg-raises',
    name: 'Seated Straight Leg Raises',
    category: 'legs',
    difficulty: 'Beginner',
    targetRegion: 'Hip Flexor Complex & Distal Quadriceps',
    targetMuscles: ['Iliopsoas', 'Rectus Femoris', 'Pectineus', 'Transverse Abdominis'],
    description: 'Post-operative hip flexor and core stability exercise minimizing compressive joint shear while activating anterior compartment muscles.',
    instructions: [
      'Sit tall with knees initially bent at 90° and hands resting lightly on the sides of the chair.',
      'Extend one leg straight out, then gently lift the entire straight leg 4 to 8 inches off the seat.',
      'Hold the elevated position for 1-2 seconds with abdominal bracing engaged.',
      'Slowly descend back down without dropping the leg suddenly.'
    ],
    clinicalCautions: [
      'Do not lean backward or rock the pelvis to hoist the leg.',
      'Keep the foot dorsiflexed (toes pointing toward the ceiling).',
      'Maintain steady breathing without holding breath (Valsalva maneuver).'
    ],
    defaultReps: 10,
    defaultSets: 3,
    targetAngleMin: 80,
    targetAngleMax: 125,
    primaryJoint: 'Hip Flexion Angle (Torso-Hip-Knee)',
    secondaryJoint: 'Knee extension lock',
    repPhaseStartAngle: 85, // resting on seat
    repPhasePeakAngle: 115, // elevated
    iconName: 'MoveUp'
  }
];

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISE_DEFINITIONS.find(ex => ex.id === id);
}
