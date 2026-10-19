/**
 * Therapist Dashboard & Clinical Oversight Portal
 * Triage patient adherence, review computer-vision telemetry, update exercise prescriptions, and send feedback.
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Sliders, 
  MessageSquare, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import { PatientSummary, ExerciseSession, UserProfile } from '../../types';
import { EXERCISE_DEFINITIONS } from '../../services/exerciseLibrary';

interface TherapistDashboardProps {
  patients: PatientSummary[];
  sessions: ExerciseSession[];
  currentUser: UserProfile;
  onUpdatePrescription: (patientId: string, assigned: PatientSummary['assignedExercises']) => void;
  onSaveFeedbackToSession?: (sessionId: string, feedback: string) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({
  patients,
  sessions,
  currentUser,
  onUpdatePrescription,
  onSaveFeedbackToSession
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'patient-sarah-101');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditingPrescription, setIsEditingPrescription] = useState<boolean>(false);
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [showFeedbackSentToast, setShowFeedbackSentToast] = useState<boolean>(false);

  // Active patient object
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Prescription editing local state
  const [editingAssigned, setEditingAssigned] = useState(activePatient?.assignedExercises || []);

  const handleSelectPatient = (p: PatientSummary) => {
    setSelectedPatientId(p.id);
    setEditingAssigned(p.assignedExercises);
    setIsEditingPrescription(false);
  };

  const filteredPatients = patients.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sessions for this patient
  const patientSessions = sessions.filter(s => s.patientId === selectedPatientId);

  const handleSavePrescription = () => {
    onUpdatePrescription(selectedPatientId, editingAssigned);
    setIsEditingPrescription(false);
  };

  const handleSendFeedback = () => {
    if (!feedbackNote.trim()) return;
    if (patientSessions.length > 0 && onSaveFeedbackToSession) {
      onSaveFeedbackToSession(patientSessions[0].id, feedbackNote);
    }
    setFeedbackNote('');
    setShowFeedbackSentToast(true);
    setTimeout(() => setShowFeedbackSentToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Clinician Overview Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <span>Clinical Rehabilitation Command</span>
            <span aria-hidden="true">·</span>
            <span>Dr. Michael Chen, PT, DPT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Therapist Oversight Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review patient range of motion trends, verify home adherence telemetry, and modify clinical protocols.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            <span className="text-slate-500">Active Caseload: </span>
            <strong className="text-slate-900">{patients.length} Patients</strong>
          </div>
        </div>
      </div>

      {/* Main Split View: Left Patient List, Right Patient Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Caseload Triage (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Patient Caseload</h3>
              <span className="text-xs text-slate-500">{filteredPatients.length} shown</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, condition..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'On Track', label: 'On Track' },
                { id: 'Needs Review', label: 'Needs Review' },
                { id: 'Milestone Reached', label: 'Milestone' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    statusFilter === tab.id ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Patient Cards */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatientId;
                return (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${patient.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{patient.name}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{patient.condition}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        patient.status === 'On Track'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : patient.status === 'Needs Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {patient.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Adherence: <strong className="text-slate-800">{patient.adherenceRate}%</strong></span>
                      <span>Last: {patient.lastSessionDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Patient Clinical Drilldown (8 cols) */}
        {activePatient && (
          <div className="lg:col-span-8 space-y-6">
            {/* Patient Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${activePatient.avatarColor} text-white flex items-center justify-center font-extrabold text-xl shadow-xs`}>
                  {activePatient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{activePatient.name}</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {activePatient.injurySide} Limb
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activePatient.condition} · Surgery Date: {activePatient.surgeryDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditingPrescription(!isEditingPrescription)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Modify Prescription</span>
                </button>
              </div>
            </div>

            {/* Clinical Telemetry Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <p className="text-[11px] text-slate-500">Adherence Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{activePatient.adherenceRate}%</span>
                  <span className="text-xs font-semibold text-emerald-600">Compliant</span>
                </div>
                <p className="text-[10px] text-slate-400">Total verified sessions: {activePatient.totalSessions}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <p className="text-[11px] text-slate-500">Most Recent Active ROM</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-teal-700">{activePatient.recentRom}°</span>
                  <span className="text-xs text-slate-500">/ Goal {activePatient.targetRom}°</span>
                </div>
                <p className="text-[10px] text-teal-600 font-medium">92% of target milestone</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <p className="text-[11px] text-slate-500">Clinical Status</p>
                <span className="text-lg font-bold text-slate-900">{activePatient.status}</span>
                <p className="text-[10px] text-slate-400">Updated today via computer vision</p>
              </div>
            </div>

            {/* Prescription Management Panel (Expanded or Collapsed) */}
            {isEditingPrescription ? (
              <div className="bg-white p-6 rounded-2xl border border-teal-300 shadow-sm space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    Modify Exercise Prescription for {activePatient.name}
                  </h3>
                  <button
                    onClick={() => setIsEditingPrescription(false)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {editingAssigned.map((assignment, idx) => (
                    <div key={assignment.exerciseId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-xs">
                      <div className="sm:col-span-1 font-bold text-slate-900">
                        {assignment.exerciseName}
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Target Reps</label>
                        <input
                          type="number"
                          min={4}
                          max={30}
                          value={assignment.targetReps}
                          onChange={(e) => {
                            const updated = [...editingAssigned];
                            updated[idx].targetReps = Number(e.target.value);
                            setEditingAssigned(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Target Sets</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={assignment.targetSets}
                          onChange={(e) => {
                            const updated = [...editingAssigned];
                            updated[idx].targetSets = Number(e.target.value);
                            setEditingAssigned(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Freq / Week</label>
                        <input
                          type="number"
                          min={1}
                          max={7}
                          value={assignment.frequencyPerWeek}
                          onChange={(e) => {
                            const updated = [...editingAssigned];
                            updated[idx].frequencyPerWeek = Number(e.target.value);
                            setEditingAssigned(updated);
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsEditingPrescription(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePrescription}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Save Prescriptions
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Current Assigned Protocol</h3>
                  <button
                    onClick={() => setIsEditingPrescription(true)}
                    className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
                  >
                    Edit Prescription
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activePatient.assignedExercises.map((ex) => (
                    <div key={ex.exerciseId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <p className="font-bold text-slate-900">{ex.exerciseName}</p>
                      <p className="text-slate-600">{ex.targetSets} sets × {ex.targetReps} reps</p>
                      <p className="text-[11px] text-teal-700 font-medium">{ex.frequencyPerWeek} days / week</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Clinician Feedback Note to Patient */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                Send Clinical Guidance Note to {activePatient.name}
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="e.g. Excellent terminal extension on your last set. Ensure you do not arch your lower back on rep 6."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSendFeedback}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

              {showFeedbackSentToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clinical note successfully transmitted to patient's dashboard!</span>
                </div>
              )}
            </div>

            {/* Recent Sessions Recorded for this Patient */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Recorded Sessions for {activePatient.name}</h3>

              <div className="divide-y divide-slate-100 text-xs">
                {patientSessions.map((session) => (
                  <div key={session.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{session.exerciseName}</p>
                      <p className="text-slate-500 text-[11px]">
                        {new Date(session.startTime).toLocaleDateString()} · {Math.round(session.durationSeconds / 60)} min · {session.repsCompleted} reps
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-mono font-bold text-teal-700">{session.maxRangeOfMotion}° Peak ROM</p>
                        <p className="text-[11px] text-emerald-600">{session.averageFormScore}% Form Score</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
