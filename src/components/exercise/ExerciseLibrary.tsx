/**
 * Exercise Library: Comprehensive catalog with clinical filters, target joints, and session launcher
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  Activity, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Sliders, 
  Compass,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { EXERCISE_DEFINITIONS } from '../../services/exerciseLibrary';
import { ExerciseDefinition, BodyRegion } from '../../types';

interface ExerciseLibraryProps {
  onStartSession: (exerciseId: string) => void;
  selectedExerciseId?: string;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  onStartSession
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalExercise, setActiveModalExercise] = useState<ExerciseDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'All Exercises' },
    { id: 'shoulders', label: 'Shoulders & Scapula' },
    { id: 'arms', label: 'Arms & Elbows' },
    { id: 'knees', label: 'Knees & Patella' },
    { id: 'legs', label: 'Hips & Legs' },
  ];

  const filteredExercises = EXERCISE_DEFINITIONS.filter(ex => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <span>Clinical Protocols</span>
            <span aria-hidden="true">·</span>
            <span>Computer Vision Tracked</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Physical Therapy Exercise Library
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Each protocol uses real-time kinematic angle tracking and velocity monitoring. Select an exercise to preview clinical cautions or begin a live monitored session.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, joints, muscles..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Mandatory Therapist Notice Banner */}
      <div className="p-4 bg-teal-50 border border-teal-200/90 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 leading-relaxed">
          <p className="font-bold mb-0.5">Clinical Authorization Requirement</p>
          Prescribed exercises, repetitions, and target range-of-motion angles must be evaluated and approved by your licensed Physical Therapist (PT, DPT) or attending physician. Do not exceed prescribed limits without clinician approval.
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 p-1 bg-slate-100 rounded-xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{exercise.targetRegion}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {exercise.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {exercise.description}
              </p>

              {/* Biomechanical Specs */}
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tracked Joint:</span>
                  <span className="font-semibold text-slate-900">{exercise.primaryJoint}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Target Range of Motion:</span>
                  <span className="font-mono font-semibold text-teal-700">{exercise.targetAngleMin}° – {exercise.targetAngleMax}°</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Standard Prescription:</span>
                  <span className="font-medium text-slate-800">{exercise.defaultSets} sets × {exercise.defaultReps} reps</span>
                </div>
              </div>

              {/* Muscles Targeted */}
              <div className="text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Target Muscles: </span>
                <span>{exercise.targetMuscles.join(' · ')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveModalExercise(exercise)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                View Instructions
              </button>

              <button
                onClick={() => onStartSession(exercise.id)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Activity className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No exercises found</h3>
          <p className="text-xs text-slate-500">
            No exercises match your search query "{searchQuery}". Try searching for shoulders, knees, or arm curls.
          </p>
        </div>
      )}

      {/* Detailed Exercise Modal */}
      {activeModalExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeModalExercise.name}</h3>
                <p className="text-xs text-slate-500">{activeModalExercise.targetRegion}</p>
              </div>
              <button
                onClick={() => setActiveModalExercise(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Biomechanical Summary Banner */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-center">
                <div>
                  <p className="text-[10px] text-teal-800 uppercase font-semibold">Primary Joint</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{activeModalExercise.primaryJoint}</p>
                </div>
                <div>
                  <p className="text-[10px] text-teal-800 uppercase font-semibold">Target ROM</p>
                  <p className="text-xs font-mono font-bold text-teal-700 mt-0.5">{activeModalExercise.targetAngleMin}° – {activeModalExercise.targetAngleMax}°</p>
                </div>
                <div>
                  <p className="text-[10px] text-teal-800 uppercase font-semibold">Rep Prescription</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{activeModalExercise.defaultSets} sets × {activeModalExercise.defaultReps} reps</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Step-by-Step Instructions</h4>
                <ol className="space-y-2.5 text-xs text-slate-700">
                  {activeModalExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Clinical Cautions */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Clinical Cautions & Form Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950/90">
                  {activeModalExercise.clinicalCautions.map((caution, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Targeted Muscles */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Anatomical Muscle Groups</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalExercise.targetMuscles.map((muscle, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalExercise(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-200/60"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = activeModalExercise.id;
                  setActiveModalExercise(null);
                  onStartSession(id);
                }}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Live Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
