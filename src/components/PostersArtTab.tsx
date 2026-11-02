import React from 'react';
import { Palette, Sparkles, Copy } from 'lucide-react';
import type { PosterArt, ProjectConfig } from '../types/microdrama';

interface PostersArtTabProps {
  config: ProjectConfig;
  posters: PosterArt;
  onRegeneratePosters: () => void;
  onCopyText: (text: string) => void;
}

export const PostersArtTab: React.FC<PostersArtTabProps> = ({
  config,
  posters,
  onRegeneratePosters,
  onCopyText,
}) => {
  return (
    <section className="space-y-6" aria-label="Posters dan Key Art">
      <div className="studio-surface rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Palette className="w-5 h-5 shrink-0" />
              <span>Poster Resmi & Key Art Microdrama</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Poster utama 9:16 untuk sampul aplikasi microdrama (ReelShort / ShortMax / TikTok Series) & Banner 16:9.
            </p>
          </div>
          <button
            type="button"
            onClick={onRegeneratePosters}
            className="px-4 py-2.5 rounded-xl emerald-cta text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Ulang Poster</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vertical 9:16 Poster */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">
                Poster Vertikal 9:16 (Cover Aplikasi Microdrama)
              </span>
              <div className="relative aspect-[9/16] max-h-[460px] mx-auto rounded-xl overflow-hidden shadow-xl border border-slate-800">
                <img
                  src={posters.verticalImageUrl}
                  alt={`Poster Vertikal ${config.title}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-center">
                  <p className="text-[11px] font-medium text-emerald-300 tracking-wide">
                    {config.genre}
                  </p>
                  <h3 className="text-lg font-extrabold text-white mt-0.5 leading-snug">
                    {config.title}
                  </h3>
                </div>
              </div>
              <label htmlFor="vertical-poster-prompt" className="sr-only">
                Prompt Poster Vertikal 9:16
              </label>
              <textarea
                id="vertical-poster-prompt"
                rows={3}
                readOnly
                value={posters.verticalPrompt}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300"
              />
            </div>
            <button
              type="button"
              onClick={() => onCopyText(posters.verticalPrompt)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Prompt Poster 9:16</span>
            </button>
          </div>

          {/* Horizontal 16:9 Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">
                Key Art Banner 16:9 (Thumbnail YouTube / Landscape)
              </span>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-xl border border-slate-800">
                <img
                  src={posters.horizontalImageUrl}
                  alt={`Banner Landscape ${config.title}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                  <p className="text-[11px] font-medium text-emerald-300">
                    {config.genre} · {config.durationMinutes} Menit
                  </p>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {config.title}
                  </h3>
                </div>
              </div>
              <label htmlFor="horizontal-poster-prompt" className="sr-only">
                Prompt Banner 16:9
              </label>
              <textarea
                id="horizontal-poster-prompt"
                rows={3}
                readOnly
                value={posters.horizontalPrompt}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300"
              />
            </div>
            <button
              type="button"
              onClick={() => onCopyText(posters.horizontalPrompt)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Prompt Banner 16:9</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
