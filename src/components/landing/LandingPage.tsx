/**
 * Landing Page: Modern Healthcare SaaS presentation of RehabVision AI
 */

import React from 'react';
import { 
  Activity, 
  Eye, 
  TrendingUp, 
  ShieldCheck, 
  Video, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sliders, 
  Users, 
  Stethoscope, 
  HeartHandshake, 
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { EXERCISE_DEFINITIONS } from '../../services/exerciseLibrary';

interface LandingPageProps {
  onStartRehabilitation: () => void;
  onExploreFeatures: () => void;
  onOpenTherapistPortal: () => void;
  onSelectExercise: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRehabilitation,
  onExploreFeatures,
  onOpenTherapistPortal,
  onSelectExercise
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-teal-50/20 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Next-Generation Physical Therapy Tele-Rehab</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500">Real-Time Biomechanics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Computer Vision Assisted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
                  Smart Rehabilitation
                </span>
                <br />
                & Posture Monitoring
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Empower your at-home recovery with real-time 33-point body pose tracking, joint angle goniometry, automated repetition validation, and direct therapist progress synchronization — all running securely inside your browser.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onStartRehabilitation}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Rehabilitation Session</span>
                </button>

                <button
                  onClick={onExploreFeatures}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center gap-2"
                >
                  <span>Explore Exercise Catalog</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={onOpenTherapistPortal}
                  className="px-4 py-3.5 text-teal-800 hover:text-teal-900 font-semibold text-sm flex items-center gap-1.5 hover:underline"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Clinician Portal</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Client-Side Video Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Video Storage or Streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>Biomechanical Goniometry</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Biomechanical Cockpit Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-800 text-white overflow-hidden">
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-mono text-emerald-400 font-medium">LIVE KINEMATICS</span>
                  </div>
                  <span className="font-mono text-slate-400">MediaPipe Vision · 60 FPS</span>
                </div>

                {/* Simulated Pose Mockup Graphic */}
                <div className="relative my-4 aspect-[4/3] rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800/80 overflow-hidden">
                  {/* Subtle Grid */}
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px)',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* SVG Anatomical Silhouette with Skeleton Overlay */}
                  <svg className="w-full h-full p-4" viewBox="0 0 200 200">
                    {/* Head */}
                    <circle cx="100" cy="30" r="12" fill="none" stroke="#14b8a6" strokeWidth="2.5" />
                    {/* Spine */}
                    <line x1="100" y1="42" x2="100" y2="105" stroke="#14b8a6" strokeWidth="3" />
                    {/* Shoulders */}
                    <line x1="72" y1="56" x2="128" y2="56" stroke="#14b8a6" strokeWidth="3" />
                    {/* Left arm */}
                    <line x1="72" y1="56" x2="58" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="58" y1="85" x2="52" y2="114" stroke="#38bdf8" strokeWidth="2.5" />
                    {/* Right arm flexing (target) */}
                    <line x1="128" y1="56" x2="142" y2="85" stroke="#10b981" strokeWidth="3" />
                    <line x1="142" y1="85" x2="134" y2="58" stroke="#10b981" strokeWidth="3" />
                    {/* Angle arc at elbow */}
                    <path d="M 138 78 A 12 12 0 0 1 146 88" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
                    {/* Pelvis */}
                    <line x1="82" y1="105" x2="118" y2="105" stroke="#14b8a6" strokeWidth="3" />
                    {/* Legs */}
                    <line x1="82" y1="105" x2="80" y2="148" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="80" y1="148" x2="78" y2="188" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="118" y1="105" x2="122" y2="148" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="122" y1="148" x2="124" y2="188" stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Joint dots */}
                    {[[72,56], [128,56], [58,85], [142,85], [52,114], [134,58], [82,105], [118,105], [80,148], [122,148], [78,188], [124,188]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="3.5" fill="#ffffff" stroke="#0d9488" strokeWidth="1.5" />
                    ))}
                    {/* Highlighted active joint */}
                    <circle cx="142" cy="85" r="7" fill="none" stroke="#10b981" strokeWidth="2" className="animate-ping" />
                  </svg>

                  {/* Overlaid Joint Metric Floating Tag */}
                  <div className="absolute top-4 right-4 bg-slate-900/90 border border-teal-500/50 rounded-lg px-2.5 py-1.5 text-right backdrop-blur-sm">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Elbow Flexion</p>
                    <p className="text-base font-mono font-bold text-teal-400">48° <span className="text-[10px] text-emerald-400 font-normal">/ Peak ROM</span></p>
                  </div>

                  {/* Realtime Feedback Banner */}
                  <div className="absolute bottom-3 inset-x-3 bg-emerald-950/80 border border-emerald-500/40 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-200 font-medium">Repetition 8 completed! Hold form.</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">96% Form</span>
                  </div>
                </div>

                {/* HUD Footer Telemetry */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-[10px] text-slate-400 uppercase">Reps Done</p>
                    <p className="text-lg font-bold text-white font-mono">8 / 10</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-[10px] text-slate-400 uppercase">Tempo / Rep</p>
                    <p className="text-lg font-bold text-white font-mono">3.8s</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <p className="text-[10px] text-slate-400 uppercase">Trunk Lean</p>
                    <p className="text-lg font-bold text-emerald-400 font-mono">2° (Stable)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Biomechanical Intelligence Pipeline</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">How RehabVision AI Analyzes Every Rep</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              From continuous browser camera input to stateful repetition counting and therapist reports. Zero proprietary hardware required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Browser Camera Input',
                desc: 'Captures standard 720p/1080p RGB video directly via the MediaDevices API. No proprietary sensors, wearables, or attachments.',
                icon: Video
              },
              {
                step: '02',
                title: '33-Point Pose Tracking',
                desc: 'MediaPipe detects sub-millimeter anatomical landmarks across shoulders, elbows, hips, knees, and ankles at 60 frames per second.',
                icon: Eye
              },
              {
                step: '03',
                title: 'Joint Goniometry & States',
                desc: 'Computes real-time vector angles, monitors joint velocity, and enforces hysteresis state machines to validate true completion.',
                icon: Sliders
              },
              {
                step: '04',
                title: 'Clinical Sync & Reports',
                desc: 'Summarizes session ROM progression, compensation warnings, and adherence curves directly for your physical therapist.',
                icon: FileText
              }
            ].map((step, idx) => (
              <div key={idx} className="relative p-6 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-300">{step.step}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Exercise Catalog Showcase */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Therapeutic Movement Library</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Prescribed Rehabilitation Exercises</h3>
              <p className="text-slate-600 text-sm mt-2 max-w-xl">
                Every exercise is equipped with individualized joint vertex trackers, angle thresholds, and postural compensation alerts.
              </p>
            </div>
            <button
              onClick={onExploreFeatures}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>View All 6 Exercises</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXERCISE_DEFINITIONS.map((exercise) => (
              <div 
                key={exercise.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {exercise.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{exercise.targetRegion}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {exercise.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {exercise.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Primary Joint:</span>
                      <span className="font-semibold text-slate-900">{exercise.primaryJoint}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Target ROM:</span>
                      <span className="font-semibold text-teal-700 font-mono">{exercise.targetAngleMin}° – {exercise.targetAngleMax}°</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Prescription:</span>
                      <span className="font-medium text-slate-700">{exercise.defaultSets} sets × {exercise.defaultReps} reps</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Therapist Approved</span>
                  <button
                    onClick={() => onSelectExercise(exercise.id)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <span>Practice Exercise</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-teal-50/50 border border-teal-200/80 rounded-xl text-center text-xs text-teal-900">
            <strong>Clinical Notice:</strong> Prescribed exercises, repetitions, and target range-of-motion limits must be reviewed and authorized by a licensed Physical Therapist (PT, DPT) or Orthopedic Surgeon.
          </div>
        </div>
      </section>

      {/* Dual Value Proposition: For Patients & For Clinicians */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Comprehensive Tele-Rehabilitation</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built for Both Patients and Clinicians</h3>
            <p className="text-slate-600 text-sm">
              Closing the adherence gap between clinical appointments and home-based physical therapy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Benefits */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-50/40 via-white to-slate-50 border border-teal-200/80 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">For Patients at Home</h4>
                  <p className="text-xs text-slate-500">Confidence, safety, and measurable recovery</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                {[
                  'Instant visual and auditory cues when your form deviates or back arches',
                  'Clear repetition verification so you never under-perform or over-strain',
                  'Progressive range of motion charts proving your joint angle milestones',
                  'No wearable sensors to charge or attach — simply open your laptop camera',
                  'Automated streak tracking and compliance reminders'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={onStartRehabilitation}
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800 transition-colors"
                >
                  Start Patient Session
                </button>
              </div>
            </div>

            {/* Clinician Benefits */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-sky-50/40 via-white to-slate-50 border border-sky-200/80 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">For Physical Therapists</h4>
                  <p className="text-xs text-slate-500">Objective data, remote compliance, and clinical triage</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                {[
                  'Objective goniometric ROM logs replacing unreliable patient memory',
                  'Automated risk triage flags patients struggling with adherence or form',
                  'Flexible prescription management: adjust target angles, sets, and cadence remotely',
                  'Detailed session telemetry reports ready for clinical documentation and chart review',
                  'HIPAA-conscious local computing model respecting patient privacy'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={onOpenTherapistPortal}
                  className="px-4 py-2 bg-sky-800 text-white rounded-lg text-xs font-semibold hover:bg-sky-900 transition-colors"
                >
                  Open Clinician Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Medical Advisory Banner */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safety, Consent & Clinical Responsibility</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">Important Medical & Privacy Disclaimer</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl mx-auto">
            RehabVision AI is an assistive technology platform intended solely to support exercise compliance and visual feedback during physical therapy. It does not provide medical diagnosis, surgical evaluations, or replace the hands-on care of a licensed healthcare provider. If you experience acute pain, dizziness, or abnormal resistance during any exercise, stop immediately and contact your doctor or physical therapist.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">RehabVision AI</span>
            <span className="text-slate-600">·</span>
            <span>Version 2.4.0-Production</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onStartRehabilitation} className="hover:text-white transition-colors">Start Session</button>
            <button onClick={onExploreFeatures} className="hover:text-white transition-colors">Exercises</button>
            <button onClick={onOpenTherapistPortal} className="hover:text-white transition-colors">Therapist Portal</button>
            <a href="#how-it-works" className="hover:text-white transition-colors">Architecture</a>
          </div>

          <p className="text-slate-500 text-center md:text-right">
            © 2026 RehabVision AI Platform. On-Device Computer Vision.
          </p>
        </div>
      </footer>
    </div>
  );
};
