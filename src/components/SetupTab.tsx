import React from 'react';
import {
  Zap,
  UserPlus,
  FileUp,
  Trash2,
  Upload,
  RefreshCw,
  RotateCcw,
  Users,
  Video,
} from 'lucide-react';
import type { AspectRatioOption, Character, ProjectConfig } from '../types/microdrama';
import { calculateDurationMetrics } from '../utils/storyboardEngine';

interface SetupTabProps {
  config: ProjectConfig;
  characters: Character[];
  onUpdateConfig: <K extends keyof ProjectConfig>(field: K, value: ProjectConfig[K]) => void;
  onAutoIdea: () => void;
  onAddCharacter: () => void;
  onRemoveCharacter: (index: number) => void;
  onUpdateCharacter: <K extends keyof Character>(index: number, field: K, value: Character[K]) => void;
  onUploadCharacterSheet: (index: number, file: File) => void;
  onRegenerateCharacterImage: (index: number) => void;
  onImportCharactersJson: (file: File) => void;
}

export const SetupTab: React.FC<SetupTabProps> = ({
  config,
  characters,
  onUpdateConfig,
  onAutoIdea,
  onAddCharacter,
  onRemoveCharacter,
  onUpdateCharacter,
  onUploadCharacterSheet,
  onRegenerateCharacterImage,
  onImportCharactersJson,
}) => {
  const metrics = calculateDurationMetrics(config.durationMinutes, config.sceneDensity);

  return (
    <section className="space-y-6" aria-label="Setup dan Cerita">
      {/* Detail Proyek Film Card */}
      <div className="studio-surface rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-800/80">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <Video className="w-5 h-5 shrink-0" />
            <span>Detail Proyek Film</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Masukkan Judul Apa Saja · Auto Script · Visual Konsisten
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Judul Microdrama */}
          <div className="md:col-span-8">
            <label
              htmlFor="film-title"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Judul Microdrama <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="film-title"
                type="text"
                value={config.title}
                onChange={(e) => onUpdateConfig('title', e.target.value)}
                placeholder="Ketik judul apa saja (contoh: Dendam Sang Pewaris, Rahasia Kamar 404...)"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              />
              <button
                type="button"
                onClick={onAutoIdea}
                title="Buat Premis & Sinopsis Otomatis dari Judul"
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Auto-Ide</span>
              </button>
            </div>
          </div>

          {/* Genre */}
          <div className="md:col-span-4">
            <label
              htmlFor="film-genre"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Genre Microdrama
            </label>
            <select
              id="film-genre"
              value={config.genre}
              onChange={(e) => onUpdateConfig('genre', e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="Drama Romansa & CEO Menyamar">Drama Romansa & CEO Menyamar</option>
              <option value="Balas Dendam & Pengkhianatan Keluarga">Balas Dendam & Pengkhianatan</option>
              <option value="Thriller Misteri & Plot Twist">Thriller Misteri & Plot Twist</option>
              <option value="Fantasi Time-Travel / Reinkarnasi">Fantasi Time-Travel / Reinkarnasi</option>
              <option value="Horor Urban & Supranatural">Horor Urban & Supranatural</option>
              <option value="Komedi Romantis Kantor">Komedi Romantis Kantor</option>
              <option value="Action & Mafia Underworld">Action & Mafia Underworld</option>
            </select>
          </div>

          {/* Durasi Microdrama (1 - 30 Menit) */}
          <div className="md:col-span-6 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="film-duration"
                className="text-xs font-semibold text-slate-300"
              >
                Durasi Microdrama (1 – 30 Menit)
              </label>
              <span
                data-testid="duration-summary"
                className="text-emerald-400 font-bold text-xs font-mono tabular-nums"
              >
                {metrics.minutes} Menit · {metrics.totalScenes} Frame Adegan · {metrics.episodes} Episode
              </span>
            </div>
            <input
              id="film-duration"
              type="range"
              min={1}
              max={30}
              value={config.durationMinutes}
              onChange={(e) => onUpdateConfig('durationMinutes', parseInt(e.target.value, 10) || 1)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums mt-1">
              <span>1 Menit (Short/Reels)</span>
              <span>10 Menit</span>
              <span>20 Menit</span>
              <span>30 Menit (Full Micro-Series)</span>
            </div>
          </div>

          {/* Mode Pacing & Jumlah Frame */}
          <div className="md:col-span-6 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <label
              htmlFor="scene-density"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Mode Pacing & Jumlah Frame
            </label>
            <select
              id="scene-density"
              value={config.sceneDensity}
              onChange={(e) => onUpdateConfig('sceneDensity', parseInt(e.target.value, 10) || 4)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value={4}>Standar Microdrama (4 Key Frame / Menit — Cepat & Fokus)</option>
              <option value={6}>Sinematik Detail (6 Key Frame / Menit — Fast Pacing)</option>
              <option value={2}>Ringkas / Overview (2 Key Frame / Menit — Ringan)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Untuk durasi panjang (10–30 menit), Anda dapat memfilter per Episode/Babak di Master Board.
            </p>
          </div>

          {/* Rasio Layar */}
          <div className="md:col-span-4">
            <label
              htmlFor="film-ratio"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Rasio Layar
            </label>
            <select
              id="film-ratio"
              value={config.ratio}
              onChange={(e) => onUpdateConfig('ratio', e.target.value as AspectRatioOption)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm"
            >
              <option value="9:16">9:16 Vertikal (TikTok / Reels / ShortMax / ReelShort)</option>
              <option value="16:9">16:9 Widescreen Sinematik (YouTube / TV)</option>
              <option value="1:1">1:1 Square Feed</option>
            </select>
          </div>

          {/* Gaya Visual */}
          <div className="md:col-span-4">
            <label
              htmlFor="film-style"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Gaya Visual (Art Style)
            </label>
            <select
              id="film-style"
              value={config.style}
              onChange={(e) => onUpdateConfig('style', e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm"
            >
              <option value="Ultra-realistic K-Drama / C-Drama cinematic lighting, 8k photorealistic, Arri Alexa">
                Realistis Sinematik (K-Drama / C-Drama 8K)
              </option>
              <option value="Indonesian modern cinema aesthetic, dramatic warm lighting, photorealistic 35mm lens">
                Sinema Modern Indonesia (Photorealistic)
              </option>
              <option value="High-end Webtoon Manhwa anime style, vibrant dramatic shading, detailed eyes">
                Manhwa / Webtoon High-Detail
              </option>
              <option value="3D Pixar / Unreal Engine 5 cinematic render, subsurface scattering, soft studio lighting">
                3D Animation (Unreal Engine 5 / Pixar Style)
              </option>
              <option value="Dark moody neo-noir thriller cinematography, high contrast, anamorphic lens flare">
                Dark Neo-Noir / Thriller
              </option>
            </select>
          </div>

          {/* Mode Kamera & POV */}
          <div className="md:col-span-4">
            <label
              htmlFor="film-pov"
              className="block text-xs font-semibold text-slate-300 mb-2"
            >
              Mode Kamera & POV
            </label>
            <select
              id="film-pov"
              value={config.pov}
              onChange={(e) => onUpdateConfig('pov', e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm"
            >
              <option value="Dynamic Third-Person Cinematic (Close-up emosional & Over-the-shoulder)">
                Third-Person Dinamis (Fokus Ekspresi & Dialog)
              </option>
              <option value="First-Person POV Immersive Camera (Sudut pandang mata karakter utama)">
                First-Person POV (Imersif Sudut Pandang Tokoh)
              </option>
              <option value="Intense Dramatic Zoom & Dutch Angle (Gaya sinetron/microdrama viral)">
                Dramatic Viral Microdrama (Intense Close-Up)
              </option>
            </select>
          </div>

          {/* Sinopsis / Plot Cerita */}
          <div className="md:col-span-12">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="film-plot"
                className="text-xs font-semibold text-slate-300"
              >
                Premis / Sinopsis Cerita (Kosongkan jika ingin dibuat otomatis dari Judul)
              </label>
              <button
                type="button"
                onClick={onAutoIdea}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Buat Sinopsis Otomatis dari Judul</span>
              </button>
            </div>
            <textarea
              id="film-plot"
              rows={3}
              value={config.plot}
              onChange={(e) => onUpdateConfig('plot', e.target.value)}
              placeholder="Ceritakan garis besar konflik, atau biarkan sistem mengembangkannya secara otomatis dari judul..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Character Sheet Manager */}
      <div className="studio-surface rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Users className="w-5 h-5 shrink-0" />
              <span>Character Sheet & Konsistensi Visual</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit deskripsi fisik dan pakaian agar terkunci di setiap prompt frame, atau{' '}
              <strong className="text-slate-200">upload gambar Character Sheet sendiri</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onAddCharacter}
              className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Karakter</span>
            </button>
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors">
              <FileUp className="w-4 h-4 text-emerald-400" />
              <span>Import JSON Karakter</span>
              <input
                type="file"
                accept=".json"
                aria-label="Import JSON Karakter"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImportCharactersJson(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {characters.map((char, idx) => (
            <div
              key={char.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3"
            >
              <div>
                {/* Character Image Preview & Upload Controls */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-56 mb-3 flex items-center justify-center">
                  <img
                    src={char.imageUrl}
                    alt={`Character Sheet ${char.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/75 text-[11px] font-semibold text-emerald-300">
                    {char.isCustomUpload ? 'Custom Sheet Uploaded' : 'Studio Character Sheet'}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveCharacter(idx)}
                    aria-label={`Hapus karakter ${char.name}`}
                    title={`Hapus karakter ${char.name}`}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-rose-950/85 hover:bg-rose-600 text-rose-200 text-xs flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex gap-2 justify-center">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow whitespace-nowrap shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Sheet Sendiri</span>
                      <input
                        type="file"
                        accept="image/*"
                        aria-label={`Upload gambar Character Sheet untuk ${char.name}`}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onUploadCharacterSheet(idx, file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onRegenerateCharacterImage(idx)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/95 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 border border-slate-600 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Render AI</span>
                    </button>
                  </div>
                </div>

                {/* Editable Character Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label
                      htmlFor={`char-name-${idx}`}
                      className="text-[11px] font-semibold text-slate-400 block mb-1"
                    >
                      Nama Karakter
                    </label>
                    <input
                      id={`char-name-${idx}`}
                      type="text"
                      value={char.name}
                      onChange={(e) => onUpdateCharacter(idx, 'name', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`char-role-${idx}`}
                      className="text-[11px] font-semibold text-slate-400 block mb-1"
                    >
                      Peran dalam Cerita
                    </label>
                    <input
                      id={`char-role-${idx}`}
                      type="text"
                      value={char.role}
                      onChange={(e) => onUpdateCharacter(idx, 'role', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`char-appearance-${idx}`}
                      className="text-[11px] font-semibold text-slate-400 block mb-1"
                    >
                      Prompt Lock Fisik & Wajah (Menyatu ke Semua Adegan)
                    </label>
                    <textarea
                      id={`char-appearance-${idx}`}
                      rows={2}
                      value={char.appearance}
                      onChange={(e) => onUpdateCharacter(idx, 'appearance', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <label
                        htmlFor={`char-outfit-${idx}`}
                        className="text-[11px] font-semibold text-slate-400 block mb-1"
                      >
                        Pakaian Khas
                      </label>
                      <input
                        id={`char-outfit-${idx}`}
                        type="text"
                        value={char.outfit}
                        onChange={(e) => onUpdateCharacter(idx, 'outfit', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`char-voice-${idx}`}
                        className="text-[11px] font-semibold text-slate-400 block mb-1"
                      >
                        Karakter Suara / TTS
                      </label>
                      <input
                        id={`char-voice-${idx}`}
                        type="text"
                        value={char.voiceStyle}
                        onChange={(e) => onUpdateCharacter(idx, 'voiceStyle', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
