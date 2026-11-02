import React from 'react';
import { Mic, Copy, Square, Play } from 'lucide-react';
import type { StoryboardScene } from '../types/microdrama';

interface ShotPromptTtsTabProps {
  scenes: StoryboardScene[];
  onCopyAllPrompts: () => void;
  onStopTts: () => void;
  onSpeakDialogue: (sceneIndex: number) => void;
  onCopyText: (text: string) => void;
}

export const ShotPromptTtsTab: React.FC<ShotPromptTtsTabProps> = ({
  scenes,
  onCopyAllPrompts,
  onStopTts,
  onSpeakDialogue,
  onCopyText,
}) => {
  return (
    <section className="space-y-6" aria-label="Shot Prompt dan TTS">
      <div className="studio-surface rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Mic className="w-5 h-5 shrink-0" />
              <span>Prompt Terpadu (Visual + Dialog) & Simulasi Voice Over (TTS)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Setiap prompt sudah menyatukan{' '}
              <strong className="text-slate-200">
                Character Sheet Lock + Sudut Kamera + Visual Adegan + Dialog Lip-Sync
              </strong>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCopyAllPrompts}
              className="px-4 py-2.5 rounded-xl emerald-cta text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Semua Prompt + Dialog</span>
            </button>
            <button
              type="button"
              onClick={onStopTts}
              className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop Suara</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {scenes.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums">
                  <span className="text-emerald-400 font-bold">
                    Frame #{scene.sceneNumber} ({scene.timecode})
                  </span>
                  <span className="text-slate-600" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-sans font-bold text-white">{scene.speaker}</span>
                  <span className="text-slate-600" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-sans text-slate-400">Nada: {scene.voiceStyle}</span>
                </div>
                <p className="text-sm font-semibold text-emerald-300">{scene.dialogue}</p>
                <p className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {scene.unifiedPrompt}
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onSpeakDialogue(idx)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Voice TTS #{scene.sceneNumber}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCopyText(scene.unifiedPrompt)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt #{scene.sceneNumber}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
