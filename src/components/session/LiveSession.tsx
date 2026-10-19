/**
 * Live Rehabilitation Session Cockpit
 * Computer Vision Real-Time Pose Tracking, Biomechanical State Machine,
 * Repetition Counting, Joint Goniometry, and Audio-Visual Feedback.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  FlipHorizontal, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  HelpCircle,
  Eye,
  Sliders,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { ExerciseDefinition, UserProfile, ExerciseSession, FormFeedbackEvent, RepetitionRecord } from '../../types';
import { getExerciseById, EXERCISE_DEFINITIONS } from '../../services/exerciseLibrary';
import { poseService, PoseDetectionService } from '../../services/poseDetection';
import { ExerciseEngine, MovementPhase } from '../../services/exerciseEngine';
import { audioFeedback } from '../../services/audioFeedback';
import { PoseSimulator } from '../../services/poseSimulator';

interface LiveSessionProps {
  exerciseId: string;
  currentUser: UserProfile;
  onCompleteSession: (session: ExerciseSession) => void;
  onCancel: () => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({
  exerciseId,
  currentUser,
  onCompleteSession,
  onCancel
}) => {
  const exercise: ExerciseDefinition = getExerciseById(exerciseId) || EXERCISE_DEFINITIONS[0];

  // Video and Canvas Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Engine & Simulator Refs
  const engineRef = useRef<ExerciseEngine>(new ExerciseEngine(exercise.id, currentUser.injuredSide === 'left' ? 'left' : 'right'));
  const simulatorRef = useRef<PoseSimulator>(new PoseSimulator(exercise.id));

  // Session State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMediaPipeReady, setIsMediaPipeReady] = useState<boolean>(false);
  const [mediaPipeError, setMediaPipeError] = useState<string | null>(null);

  // Options & Modes
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [mirrorVideo, setMirrorVideo] = useState<boolean>(true);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeSide, setActiveSide] = useState<'right' | 'left'>(
    currentUser.injuredSide === 'left' ? 'left' : 'right'
  );

  // Live Biomechanical Telemetry
  const [repsCompleted, setRepsCompleted] = useState<number>(0);
  const [targetReps, setTargetReps] = useState<number>(exercise.defaultReps);
  const [currentAngle, setCurrentAngle] = useState<number>(exercise.targetAngleMin);
  const [movementPhase, setMovementPhase] = useState<MovementPhase>('READY');
  const [phaseProgress, setPhaseProgress] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Align yourself in camera view');
  const [feedbackType, setFeedbackType] = useState<'info' | 'success' | 'warning' | 'correction'>('info');
  const [isPostureValid, setIsPostureValid] = useState<boolean>(true);
  const [landmarksVisible, setLandmarksVisible] = useState<boolean>(false);

  // Timer & Session Logs
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const sessionStartTimeRef = useRef<string>(new Date().toISOString());
  const feedbackLogsRef = useRef<FormFeedbackEvent[]>([]);
  const repetitionRecordsRef = useRef<RepetitionRecord[]>([]);
  const prevRepsRef = useRef<number>(0);

  // Initialize engine when activeSide changes
  useEffect(() => {
    engineRef.current.setSide(activeSide);
  }, [activeSide]);

  // Handle Mute state
  useEffect(() => {
    audioFeedback.setMuted(isMuted);
  }, [isMuted]);

  // Session Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCameraActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraActive, isPaused]);

  // Stop camera tracks cleanly
  const stopCameraTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraTracks();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [stopCameraTracks]);

  // Initialize MediaPipe PoseLandmarker
  useEffect(() => {
    let isMounted = true;
    poseService
      .initialize()
      .then((landmarker) => {
        if (!isMounted) return;
        if (landmarker) {
          setIsMediaPipeReady(true);
        } else {
          const err = poseService.getInitError() || 'Failed to initialize pose detection engine.';
          setMediaPipeError(err);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setMediaPipeError(err.message || 'Error loading pose vision task.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setIsLoadingCamera(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setIsPaused(false);
      setIsLoadingCamera(false);
      setIsSimulationMode(false);
    } catch (err: unknown) {
      console.warn('Camera stream request failed:', err);
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser address bar.'
          : 'Could not connect to webcam. You can switch to Simulation Mode to test all tracking features.';
      setCameraError(msg);
      setIsLoadingCamera(false);
      stopCameraTracks();
    }
  };

  // Start Simulation Mode
  const startSimulator = () => {
    stopCameraTracks();
    setCameraError(null);
    setIsCameraActive(true);
    setIsPaused(false);
    setIsSimulationMode(true);
    simulatorRef.current.setExercise(exercise.id);
  };

  // Main Detection Loop (Webcam or Simulator)
  useEffect(() => {
    if (!isCameraActive || isPaused) return;

    let lastVideoTime = -1;

    const processFrame = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const canvasWidth = canvas.width || 640;
          const canvasHeight = canvas.height || 480;

          // Clear canvas
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);

          let landmarksToAnalyze = null;

          if (isSimulationMode) {
            // Draw synthetic dark background for simulator view
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Subtle medical grid
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvasWidth; x += 40) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvasHeight);
              ctx.stroke();
            }
            for (let y = 0; y < canvasHeight; y += 40) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvasWidth, y);
              ctx.stroke();
            }

            landmarksToAnalyze = simulatorRef.current.generateLandmarks();
          } else if (video && video.readyState >= 2 && isMediaPipeReady) {
            // Live Webcam frame processing
            const nowMs = performance.now();
            if (video.currentTime !== lastVideoTime) {
              lastVideoTime = video.currentTime;
              const result = poseService.detectForVideo(video, nowMs);
              if (result && result.landmarks && result.landmarks.length > 0) {
                landmarksToAnalyze = result.landmarks[0];
              }
            }
          }

          // Process through Biomechanical State Machine
          if (landmarksToAnalyze) {
            const engineOutput = engineRef.current.processPose(landmarksToAnalyze);

            setCurrentAngle(engineOutput.currentAngle);
            setMovementPhase(engineOutput.movementPhase);
            setPhaseProgress(engineOutput.phaseProgress);
            setRepsCompleted(engineOutput.repsCount);
            setFeedbackMessage(engineOutput.feedbackMessage);
            setFeedbackType(engineOutput.feedbackType);
            setIsPostureValid(engineOutput.isPostureValid);
            setLandmarksVisible(engineOutput.landmarksVisible);

            // Trigger Repetition Audio Chime & Record
            if (engineOutput.repsCount > prevRepsRef.current) {
              prevRepsRef.current = engineOutput.repsCount;
              audioFeedback.playRepSuccess();

              const repRecord: RepetitionRecord = {
                repNumber: engineOutput.repsCount,
                durationSeconds: 3.8,
                peakAngle: engineOutput.currentAngle,
                formScore: engineOutput.formScoreThisRep,
                feedbackNote: engineOutput.feedbackMessage
              };
              repetitionRecordsRef.current.push(repRecord);

              // Add feedback event
              feedbackLogsRef.current.push({
                id: `fb-${Date.now()}`,
                timestamp: elapsedSeconds * 1000,
                message: `Rep ${engineOutput.repsCount} completed! (${engineOutput.currentAngle}°)`,
                type: 'success'
              });

              // Check if set target reached
              if (engineOutput.repsCount >= targetReps) {
                audioFeedback.playSetComplete();
              }
            }

            // Draw Skeleton on Canvas
            if (showSkeleton) {
              PoseDetectionService.renderSkeleton(
                ctx,
                landmarksToAnalyze,
                canvasWidth,
                canvasHeight,
                engineOutput.highlightJointIndices,
                `${engineOutput.currentAngle}°`
              );
            }
          } else {
            // No landmarks currently visible
            setLandmarksVisible(false);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isCameraActive, isPaused, isSimulationMode, isMediaPipeReady, showSkeleton, targetReps, elapsedSeconds]);

  // Handle End Session & Review
  const handleEndSession = () => {
    stopCameraTracks();

    const avgForm = engineRef.current.getAverageFormScore();
    const maxRom = engineRef.current.getMaxRangeOfMotion() || exercise.targetAngleMax;

    const completedSession: ExerciseSession = {
      id: `sess-${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      startTime: sessionStartTimeRef.current,
      endTime: new Date().toISOString(),
      durationSeconds: Math.max(1, elapsedSeconds),
      repsCompleted,
      targetReps,
      setsCompleted: repsCompleted >= targetReps ? 1 : 0,
      targetSets: 1,
      averageFormScore: avgForm,
      maxRangeOfMotion: maxRom,
      targetRangeOfMotion: exercise.targetAngleMax,
      status: repsCompleted >= targetReps ? 'completed' : repsCompleted > 0 ? 'partial' : 'abandoned',
      feedbackLogs: feedbackLogsRef.current,
      repetitionRecords: repetitionRecordsRef.current,
      notes: isSimulationMode ? 'Session completed using synthetic biomechanical testing mode.' : undefined
    };

    onCompleteSession(completedSession);
  };

  // Format Timer mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopCameraTracks();
              onCancel();
            }}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Exit Session"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <span>Live Biomechanical Session</span>
              <span aria-hidden="true">·</span>
              <span>{exercise.targetRegion}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{exercise.name}</h1>
          </div>
        </div>

        {/* Top Controls: Sound, Mirror, Side Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Limb Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSide('right')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeSide === 'right' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Right Side
            </button>
            <button
              onClick={() => setActiveSide('left')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeSide === 'left' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Left Side
            </button>
          </div>

          <button
            onClick={() => setMirrorVideo(!mirrorVideo)}
            className={`p-2 rounded-lg border transition-colors ${
              mirrorVideo ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Mirror Webcam Preview"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`p-2 rounded-lg border transition-colors ${
              showSkeleton ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Toggle Skeleton Overlay"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Viewport & HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Camera Video + Overlay Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg flex items-center justify-center">
            {/* Native Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${
                mirrorVideo ? '-scale-x-100' : ''
              } ${!isCameraActive || isSimulationMode ? 'hidden' : 'block'}`}
            />

            {/* Canvas Overlay for Pose Landmarks & HUD */}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
                mirrorVideo && !isSimulationMode ? '-scale-x-100' : ''
              }`}
            />

            {/* Offline / Pre-Start State Overlay */}
            {!isCameraActive && (
              <div className="relative z-20 max-w-md p-6 text-center space-y-4 text-white">
                <div className="w-14 h-14 rounded-2xl bg-teal-600/30 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Ready to Begin Exercise</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Grant camera access to enable real-time joint angle detection. Video is computed locally and never uploaded.
                  </p>
                </div>

                {cameraError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 text-left flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <button
                    onClick={startCamera}
                    disabled={isLoadingCamera}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isLoadingCamera ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span>{isLoadingCamera ? 'Connecting Camera...' : 'Start Live Camera'}</span>
                  </button>

                  <button
                    onClick={startSimulator}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Sliders className="w-4 h-4 text-teal-400" />
                    <span>Run Motion Simulator (Demo)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Camera Overlaid HUD Heads-Up Display */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-xs">
                    <span className={`w-2 h-2 rounded-full ${isSimulationMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                    <span className="font-mono font-medium">
                      {isSimulationMode ? 'MOTION SIMULATOR' : 'LIVE WEBCAM'}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono">{formatTime(elapsedSeconds)}</span>
                  </div>

                  {/* Target Joint Badge */}
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-teal-500/50 text-white text-xs font-mono">
                    <span className="text-slate-400">Tracking: </span>
                    <span className="text-teal-400 font-semibold">{exercise.primaryJoint} ({activeSide})</span>
                  </div>
                </div>

                {/* Real-time Posture & Form Banner */}
                <div className="self-center w-full max-w-md">
                  <div
                    className={`px-4 py-2 rounded-xl backdrop-blur-md border text-center shadow-lg transition-all text-xs font-medium ${
                      feedbackType === 'success'
                        ? 'bg-emerald-950/85 border-emerald-500/60 text-emerald-200'
                        : feedbackType === 'warning'
                        ? 'bg-amber-950/85 border-amber-500/60 text-amber-200'
                        : feedbackType === 'correction'
                        ? 'bg-rose-950/85 border-rose-500/60 text-rose-200'
                        : 'bg-slate-900/85 border-slate-700 text-slate-200'
                    }`}
                  >
                    {feedbackMessage}
                  </div>
                </div>

                {/* HUD Bottom Bar: Movement Phase & Angle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-white">
                    <span className="text-slate-400">Phase:</span>
                    <span className="font-bold text-teal-400 uppercase tracking-wider">{movementPhase}</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-white font-mono">
                    <span className="text-slate-400">Measured: </span>
                    <span className="text-lg font-bold text-teal-300">{currentAngle}°</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Live Controls Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isCameraActive && (
                <>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? 'Resume' : 'Pause Session'}</span>
                  </button>

                  <button
                    onClick={handleEndSession}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop & Review Session</span>
                  </button>
                </>
              )}

              {!isCameraActive && (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Camera</span>
                </button>
              )}
            </div>

            {/* Pain / Discomfort Safety Halt */}
            <button
              onClick={() => {
                if (window.confirm('Do you feel discomfort or acute pain? This will safely stop your session and log the feedback for your therapist.')) {
                  handleEndSession();
                }
              }}
              className="text-xs text-rose-700 hover:text-rose-800 font-semibold flex items-center gap-1.5 p-1"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Pain or Discomfort? Halt Session</span>
            </button>
          </div>
        </div>

        {/* Right Column: Telemetry Gauge, Rep Counter & Instructions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Big Rep Counter & Progress Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Repetitions</span>
              <span className="text-xs font-semibold text-teal-700">Set 1 of 1</span>
            </div>

            <div className="flex items-baseline justify-center gap-2 py-2">
              <span className="text-6xl font-black text-slate-900 font-mono tracking-tight">
                {repsCompleted}
              </span>
              <span className="text-2xl font-bold text-slate-400 font-mono">
                / {targetReps}
              </span>
            </div>

            {/* Rep Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Set Completion</span>
                <span className="font-semibold text-teal-700">
                  {Math.round((repsCompleted / targetReps) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (repsCompleted / targetReps) * 100)}%` }}
                />
              </div>
            </div>

            {/* Current Rep Trajectory Progress Bar */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Current Rep Trajectory:</span>
                <span className="font-mono font-bold text-teal-800">{phaseProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-1.5 rounded-full transition-all duration-150"
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Joint Angle Goniometer Visualizer */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Goniometry</span>
              <span className="text-xs font-mono text-slate-400">Target: {exercise.targetAngleMin}° – {exercise.targetAngleMax}°</span>
            </div>

            {/* Biomechanical Radial Indicator */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2">
              <p className="text-[11px] text-slate-500">Tracked Vertex Angle</p>
              <div className="text-4xl font-black text-slate-900 font-mono tracking-tight text-teal-700">
                {currentAngle}°
              </div>
              <p className="text-[11px] text-slate-500">
                {currentAngle >= exercise.targetAngleMin && currentAngle <= exercise.targetAngleMax
                  ? '✓ Inside therapeutic target arc'
                  : 'Preparing for inflection target'}
              </p>
            </div>
          </div>

          {/* Exercise Form Quick Cues */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Form Checklist</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {exercise.instructions.slice(0, 3).map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
