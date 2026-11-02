import React from 'react';
import {
  Plus,
  Images,
  Upload,
  RefreshCw,
  Volume2,
  Copy,
} from 'lucide-react';
import type { AspectRatioOption, StoryboardScene } from '../types/microdrama';

interface MasterBoardTabProps {
  scenes: StoryboardScene[];
  ratio: AspectRatioOption;
  selectedEpisode: string;
  onSelectEpisode: (ep: string) => void;
  onAddCustomScene: () => void;
  onRegenerateAllImages: () => void;
  onUpdateSceneField: (
    sceneIndex: number,
    field: 'location' | 'camera' | 'dialogue' | 'action',
    value: string
  ) => void;
  onUpdateUnifiedPrompt: (sceneIndex: number, value: string) => void;
  onUploadCustomFrame: (sceneIndex: number, file: File) => void;
  onRegenerateSceneImage: (sceneIndex: number) => void;
  onSpeakDialogue: (sceneIndex: number) => void;
  onCopyText: (text: string) => void;
}

export const MasterBoardTab: React.FC<MasterBoardTabProps> = ({
  scenes,
  ratio,
  selectedEpisode,
  onSelectEpisode,
  onAddCustomScene,
  onRegenerateAllImages,
  onUpdateSceneField,
  onUpdateUnifiedPrompt,
  onUploadCustomFrame,
  onRegenerateSceneImage,
  onSpeakDialogue,
  onCopyText,
}) => {
  const maxEp = Math.max(...scenes.map((s) => s.episode), 1);
  const filteredScenes =
    selectedEpisode === 'all'
      ? scenes
      : scenes.filter((s) => String(s.episode) === String(selectedEpisode));

  const aspectClass =
    ratio === '9:16'
      ? 'aspect-[9/16] max-h-[420px]'
      : ratio === '16:9'
        ? 'aspect-video w-full'
        : 'aspect-square max-h-[380px]';

  return (
    <section className="space-y-6" aria-label="Master Storyboard">
      {/* Filter & Summary Bar */}
      <div className="studio-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            data-testid="board-summary-count"
            className="text-emerald-400 font-bold text-xs font-mono tabular-nums"
          >
            Total: {scenes.length} Adegan · {maxEp} Episode
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ·
          </span>
          <label htmlFor="episode-filter" className="sr-only">
            Filter Episode
          </label>
          <select
            id="episode-filter"
            value={selectedEpisode}
            onChange={(e) => onSelectEpisode(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Tampilkan Semua Episode ({scenes.length} Frame)</option>
            {Array.from({ length: maxEp }, (_, idx) => {
              const ep = idx + 1;
              const count = scenes.filter((s) => s.episode === ep).length;
              return (
                <option key={ep} value={String(ep)}>
                  Episode {ep} ({count} Frame Adegan)
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddCustomScene}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Tambah Frame Adegan</span>
          </button>
          <button
            type="button"
            onClick={onRegenerateAllImages}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            <Images className="w-4 h-4" />
            <span>Render Ulang Semua Gambar</span>
          </button>
        </div>
      </div>

      {/* Storyboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScenes.map((scene) => {
          const realIdx = scenes.findIndex((s) => s.sceneNumber === scene.sceneNumber);
          return (
            <article
              key={scene.sceneNumber}
              className="studio-surface rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Top Scene Bar */}
                <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                    <span className="text-emerald-400 font-extrabold">
                      FRAME #{scene.sceneNumber}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-semibold text-slate-300">
                      Ep {scene.episode} · {scene.timecode}
                    </span>
                  </div>
                  <span className="text-xs text-amber-300 font-medium truncate">
                    {scene.phase}
                  </span>
                </div>

                {/* Frame Visual Preview + Upload/Regenerate */}
                <div className="relative bg-slate-950 flex items-center justify-center border-b border-slate-800 p-3">
                  <img
                    src={scene.imageUrl}
                    alt={`Storyboard Frame ${scene.sceneNumber}`}
                    referrerPolicy="no-referrer"
                    className={`${aspectClass} rounded-xl object-cover mx-auto shadow-lg`}
                    loading="lazy"
                  />
                  <div className="absolute bottom-5 right-5 flex gap-1.5">
                    <label
                      title="Upload Gambar Frame Sendiri"
                      className="cursor-pointer px-3 py-1.5 rounded-lg bg-black/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 whitespace-nowrap shrink-0 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Frame</span>
                      <input
                        type="file"
                        accept="image/*"
                        aria-label={`Upload gambar untuk Frame ${scene.sceneNumber}`}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onUploadCustomFrame(realIdx, file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onRegenerateSceneImage(realIdx)}
                      title="Render Ulang Gambar Frame Ini"
                      className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Render Ulang</span>
                    </button>
                  </div>
                </div>

                {/* Editable Action, Dialogue & Unified Prompt */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80">
                      <label
                        htmlFor={`scene-loc-${scene.sceneNumber}`}
                        className="text-slate-400 block text-[11px] font-semibold"
                      >
                        Lokasi / Setting
                      </label>
                      <input
                        id={`scene-loc-${scene.sceneNumber}`}
                        type="text"
                        value={scene.location}
                        onChange={(e) => onUpdateSceneField(realIdx, 'location', e.target.value)}
                        className="w-full bg-transparent text-slate-200 font-medium focus:outline-none mt-0.5"
                      />
                    </div>
                    <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80">
                      <label
                        htmlFor={`scene-cam-${scene.sceneNumber}`}
                        className="text-slate-400 block text-[11px] font-semibold"
                      >
                        Kamera & Angle
                      </label>
                      <input
                        id={`scene-cam-${scene.sceneNumber}`}
                        type="text"
                        value={scene.camera}
                        onChange={(e) => onUpdateSceneField(realIdx, 'camera', e.target.value)}
                        className="w-full bg-transparent text-emerald-300 font-medium focus:outline-none mt-0.5"
                      />
                    </div>
                  </div>

                  {/* Dialog Box */}
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor={`scene-dlg-${scene.sceneNumber}`}
                        className="text-xs font-bold text-emerald-400"
                      >
                        Dialog ({scene.speaker})
                      </label>
                      <button
                        type="button"
                        onClick={() => onSpeakDialogue(realIdx)}
                        className="text-xs text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Putar TTS</span>
                      </button>
                    </div>
                    <textarea
                      id={`scene-dlg-${scene.sceneNumber}`}
                      rows={2}
                      value={scene.dialogue}
                      onChange={(e) => onUpdateSceneField(realIdx, 'dialogue', e.target.value)}
                      className="w-full bg-transparent text-white font-semibold text-xs focus:outline-none"
                    />
                  </div>

                  {/* Unified Prompt (Visual + Character + Dialogue Combined) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor={`unified-prompt-${scene.sceneNumber}`}
                        className="text-xs font-semibold text-slate-300"
                      >
                        Prompt Terpadu (Visual + Karakter + Dialog Menyatu)
                      </label>
                      <button
                        type="button"
                        onClick={() => onCopyText(scene.unifiedPrompt)}
                        className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt Frame #{scene.sceneNumber}</span>
                      </button>
                    </div>
                    <textarea
                      id={`unified-prompt-${scene.sceneNumber}`}
                      rows={4}
                      value={scene.unifiedPrompt}
                      onChange={(e) => onUpdateUnifiedPrompt(realIdx, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
