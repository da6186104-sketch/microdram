/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Wand2,
  LayoutGrid,
  Clapperboard,
  Image as ImageIcon,
  Box,
  Rocket,
  Loader2,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import type { Character, PosterArt, ProjectConfig, StoryboardScene } from './types/microdrama';
import {
  INITIAL_CHARACTERS,
  INITIAL_PROJECT_CONFIG,
  STUDIO_ASSETS,
  buildFullExportText,
  buildStoryboardCSV,
  buildUnifiedPrompt,
  calculateDurationMetrics,
  createSvgSceneCardDataUrl,
  formatTimecode,
  generatePlotFromTitle,
  generatePosterData,
  generateStoryboardScenes,
} from './utils/storyboardEngine';
import { SetupTab } from './components/SetupTab';
import { MasterBoardTab } from './components/MasterBoardTab';
import { ShotPromptTtsTab } from './components/ShotPromptTtsTab';
import { PostersArtTab } from './components/PostersArtTab';
import { ExportPackageTab } from './components/ExportPackageTab';

type TabId = 1 | 2 | 3 | 4 | 5;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(1);
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [config, setConfig] = useState<ProjectConfig>(() => ({
    ...INITIAL_PROJECT_CONFIG,
    plot: generatePlotFromTitle(
      INITIAL_PROJECT_CONFIG.title,
      INITIAL_PROJECT_CONFIG.genre,
      INITIAL_PROJECT_CONFIG.durationMinutes,
      INITIAL_CHARACTERS
    ),
  }));

  const [scenes, setScenes] = useState<StoryboardScene[]>(() =>
    generateStoryboardScenes(
      {
        ...INITIAL_PROJECT_CONFIG,
        plot: generatePlotFromTitle(
          INITIAL_PROJECT_CONFIG.title,
          INITIAL_PROJECT_CONFIG.genre,
          INITIAL_PROJECT_CONFIG.durationMinutes,
          INITIAL_CHARACTERS
        ),
      },
      INITIAL_CHARACTERS
    )
  );

  const [selectedEpisode, setSelectedEpisode] = useState<string>('all');
  const [posterSeed, setPosterSeed] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const posters = useMemo(() => {
    const base = generatePosterData(config, characters);
    if (posterSeed > 0) {
      return {
        ...base,
        verticalPrompt: `${base.verticalPrompt} (Variation #${posterSeed})`,
        horizontalPrompt: `${base.horizontalPrompt} (Variation #${posterSeed})`,
      };
    }
    return base;
  }, [config, characters, posterSeed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleUpdateConfig = <K extends keyof ProjectConfig>(
    field: K,
    value: ProjectConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAutoIdea = async () => {
    const localPlot = generatePlotFromTitle(
      config.title,
      config.genre,
      config.durationMinutes,
      characters
    );
    setConfig((prev) => ({ ...prev, plot: localPlot }));
    showToast('Sinopsis otomatis disesuaikan dengan judul!');

    try {
      const response = await fetch('/api/generate-plot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.title,
          genre: config.genre,
          durationMinutes: config.durationMinutes,
          characters,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.plot && !data.fallback) {
          setConfig((prev) => ({ ...prev, plot: data.plot }));
        }
      }
    } catch {
      // Deterministic plot already applied
    }
  };

  const handleAddCharacter = () => {
    const newIndex = characters.length + 1;
    const pool = [STUDIO_ASSETS.charArka, STUDIO_ASSETS.charNadia, STUDIO_ASSETS.charReno];
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: `Tokoh Baru ${newIndex}`,
      role: 'Karakter Pendukung',
      appearance:
        '26yo Indonesian character, expressive face, wearing stylish modern attire, cinematic lighting',
      outfit: 'Smart casual modern',
      voiceStyle: 'Natural ekspresif',
      imageUrl: pool[newIndex % pool.length],
      isCustomUpload: false,
    };
    setCharacters((prev) => [...prev, newChar]);
    showToast('Karakter baru ditambahkan! Silakan edit atau upload Character Sheet.');
  };

  const handleRemoveCharacter = (index: number) => {
    if (characters.length <= 1) {
      showToast('Minimal harus ada 1 karakter dalam proyek!');
      return;
    }
    setCharacters((prev) => prev.filter((_, i) => i !== index));
    showToast('Karakter dihapus dari daftar.');
  };

  const handleUpdateCharacter = <K extends keyof Character>(
    index: number,
    field: K,
    value: Character[K]
  ) => {
    setCharacters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleUploadCharacterSheet = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setCharacters((prev) =>
          prev.map((c, i) =>
            i === index ? { ...c, imageUrl: result, isCustomUpload: true } : c
          )
        );
        showToast(`Character Sheet "${characters[index]?.name}" berhasil di-upload!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRegenerateCharacterImage = (index: number) => {
    const char = characters[index];
    if (!char) return;
    const svgAvatar = createSvgSceneCardDataUrl({
      sceneNumber: index + 1,
      episode: 1,
      phase: char.role,
      speaker: char.name,
      camera: 'Character Sheet Turnaround (Front & Profile)',
      location: char.outfit,
      dialogue: char.appearance,
      ratio: '1:1',
      seed: Math.floor(Math.random() * 100),
    });
    setCharacters((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, imageUrl: svgAvatar, isCustomUpload: false } : c
      )
    );
    showToast(`Merender ulang Character Sheet ${char.name}...`);
  };

  const handleImportCharactersJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.characters)
            ? parsed.characters
            : null;
        if (importedList && importedList.length > 0) {
          setCharacters(importedList);
          showToast('Character Sheet berhasil diimpor!');
        } else {
          showToast('File JSON tidak berisi array karakter.');
        }
      } catch {
        showToast('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateMasterStoryboard = async () => {
    const activePlot =
      config.plot.trim() ||
      generatePlotFromTitle(config.title, config.genre, config.durationMinutes, characters);

    const updatedConfig = { ...config, plot: activePlot };
    setConfig(updatedConfig);

    // Immediately compute deterministic storyboard & switch to Master Board
    const localScenes = generateStoryboardScenes(updatedConfig, characters);
    setScenes(localScenes);
    setSelectedEpisode('all');
    setActiveTab(2);
    showToast(
      `Master Storyboard "${updatedConfig.title}" (${updatedConfig.durationMinutes} Menit / ${localScenes.length} Adegan) siap!`
    );

    setIsGenerating(true);
    try {
      const metrics = calculateDurationMetrics(
        updatedConfig.durationMinutes,
        updatedConfig.sceneDensity
      );
      const response = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: updatedConfig,
          characters,
          totalScenes: metrics.totalScenes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.scenes) && data.scenes.length > 0 && !data.fallback) {
          const merged: StoryboardScene[] = data.scenes.map(
            (s: Partial<StoryboardScene>, idx: number) => {
              const startSec = idx * metrics.secondsPerScene;
              const endSec = (idx + 1) * metrics.secondsPerScene;
              const fallbackScene = localScenes[idx % localScenes.length];
              return {
                sceneNumber: idx + 1,
                episode: s.episode || Math.floor(idx / 6) + 1,
                phase: s.phase || fallbackScene.phase,
                timecode: `${formatTimecode(startSec)} - ${formatTimecode(endSec)}`,
                location: s.location || fallbackScene.location,
                camera: s.camera || fallbackScene.camera,
                speaker: s.speaker || fallbackScene.speaker,
                voiceStyle: s.voiceStyle || fallbackScene.voiceStyle,
                action: s.action || fallbackScene.action,
                dialogue: s.dialogue || fallbackScene.dialogue,
                unifiedPrompt: s.unifiedPrompt || fallbackScene.unifiedPrompt,
                imageUrl: fallbackScene.imageUrl,
              };
            }
          );
          setScenes(merged);
        }
      }
    } catch {
      // Local deterministic scenes remain active
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateSceneField = (
    sceneIndex: number,
    field: 'location' | 'camera' | 'dialogue' | 'action',
    value: string
  ) => {
    setScenes((prev) =>
      prev.map((scene, idx) => {
        if (idx !== sceneIndex) return scene;
        const updated = { ...scene, [field]: value };
        const speakerChar =
          characters.find((c) => c.name === updated.speaker) ||
          characters[0] || {
            name: updated.speaker,
            appearance: 'Lead Indonesian character',
            outfit: 'Signature outfit',
            voiceStyle: updated.voiceStyle,
          };

        updated.unifiedPrompt = buildUnifiedPrompt({
          sceneNumber: updated.sceneNumber,
          episode: updated.episode,
          ratio: config.ratio,
          style: config.style,
          pov: config.pov,
          camera: updated.camera,
          location: updated.location,
          speakerChar,
          action: updated.action,
          dialogue: updated.dialogue,
        });
        return updated;
      })
    );
  };

  const handleUpdateUnifiedPrompt = (sceneIndex: number, value: string) => {
    setScenes((prev) =>
      prev.map((scene, idx) =>
        idx === sceneIndex ? { ...scene, unifiedPrompt: value } : scene
      )
    );
  };

  const handleUploadCustomFrame = (sceneIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setScenes((prev) =>
          prev.map((scene, idx) =>
            idx === sceneIndex
              ? { ...scene, imageUrl: result, isCustomFrame: true }
              : scene
          )
        );
        showToast(
          `Gambar kustom untuk Frame #${scenes[sceneIndex]?.sceneNumber} berhasil dipasang!`
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRegenerateSceneImage = (sceneIndex: number) => {
    setScenes((prev) =>
      prev.map((scene, idx) => {
        if (idx !== sceneIndex) return scene;
        const nextUrl = createSvgSceneCardDataUrl({
          sceneNumber: scene.sceneNumber,
          episode: scene.episode,
          phase: scene.phase,
          speaker: scene.speaker,
          camera: scene.camera,
          location: scene.location,
          dialogue: scene.dialogue,
          ratio: config.ratio,
          seed: Math.floor(Math.random() * 100) + 1,
        });
        return { ...scene, imageUrl: nextUrl };
      })
    );
    showToast(`Gambar Frame #${scenes[sceneIndex]?.sceneNumber} dirender ulang!`);
  };

  const handleRegenerateAllImages = () => {
    setScenes((prev) =>
      prev.map((scene, idx) => ({
        ...scene,
        imageUrl: createSvgSceneCardDataUrl({
          sceneNumber: scene.sceneNumber,
          episode: scene.episode,
          phase: scene.phase,
          speaker: scene.speaker,
          camera: scene.camera,
          location: scene.location,
          dialogue: scene.dialogue,
          ratio: config.ratio,
          seed: idx + Math.floor(Math.random() * 50),
        }),
      }))
    );
    showToast('Seluruh gambar storyboard berhasil dirender ulang!');
  };

  const handleAddCustomScene = () => {
    const nextNum = scenes.length + 1;
    const c1 = characters[0] || {
      name: 'Karakter Utama',
      appearance: 'Lead Indonesian character',
      outfit: 'Signature modern attire',
      voiceStyle: 'Tegas',
    };
    const episode = Math.ceil(nextNum / 6);
    const action = `${c1.name} memberikan pernyataan penentu.`;
    const dialogue = `"Ini belum berakhir, semuanya baru saja dimulai!"`;
    const location = 'Ruangan Utama Dramatis';
    const camera = 'Close-Up Shot Emosional';

    const unifiedPrompt = buildUnifiedPrompt({
      sceneNumber: nextNum,
      episode,
      ratio: config.ratio,
      style: config.style,
      pov: config.pov,
      camera,
      location,
      speakerChar: c1,
      action,
      dialogue,
    });

    const newScene: StoryboardScene = {
      sceneNumber: nextNum,
      episode,
      phase: 'Adegan Tambahan',
      timecode: 'Custom',
      location,
      camera,
      speaker: c1.name,
      voiceStyle: c1.voiceStyle,
      action,
      dialogue,
      unifiedPrompt,
      imageUrl: createSvgSceneCardDataUrl({
        sceneNumber: nextNum,
        episode,
        phase: 'Adegan Tambahan',
        speaker: c1.name,
        camera,
        location,
        dialogue,
        ratio: config.ratio,
      }),
    };

    setScenes((prev) => [...prev, newScene]);
    showToast(`Frame #${nextNum} berhasil ditambahkan!`);
  };

  const handleSpeakDialogue = (sceneIndex: number) => {
    const scene = scenes[sceneIndex];
    if (!scene) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = scene.dialogue.replace(/"/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast(`Memutar dialog Frame #${scene.sceneNumber} (${scene.speaker})...`);
    } else {
      showToast(`Simulasi TTS Frame #${scene.sceneNumber}: ${scene.dialogue}`);
    }
  };

  const handleStopTts = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      showToast('Pemutaran suara dihentikan.');
    }
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Berhasil disalin ke clipboard!');
    } catch {
      showToast('Teks siap disalin.');
    }
  };

  const handleCopyAllPrompts = () => {
    const allPrompts = scenes.map((s) => s.unifiedPrompt).join('\n\n');
    handleCopyText(allPrompts);
  };

  const handleRegeneratePosters = () => {
    setPosterSeed((prev) => prev + 1);
    showToast('Prompt dan key art poster berhasil diperbarui!');
  };

  const exportPreviewText = useMemo(
    () => buildFullExportText(config, characters, scenes),
    [config, characters, scenes]
  );

  const downloadBlob = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`File ${filename} berhasil diunduh!`);
  };

  const handleExportTxt = () => {
    downloadBlob(
      exportPreviewText,
      `Microdrama_${config.title.replace(/\s+/g, '_')}.txt`,
      'text/plain;charset=utf-8'
    );
  };

  const handleExportCsv = () => {
    const csv = buildStoryboardCSV(scenes);
    downloadBlob(
      csv,
      `Storyboard_${config.title.replace(/\s+/g, '_')}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const handleExportJson = () => {
    const payload = {
      ...config,
      characters,
      storyboardScenes: scenes,
    };
    downloadBlob(
      JSON.stringify(payload, null, 2),
      `Project_${config.title.replace(/\s+/g, '_')}.json`,
      'application/json'
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 1, label: '1. Setup & Cerita', icon: <Wand2 className="w-4 h-4 shrink-0" /> },
    { id: 2, label: '2. Master Board', icon: <LayoutGrid className="w-4 h-4 shrink-0" /> },
    { id: 3, label: '3. Shot Prompt & TTS', icon: <Clapperboard className="w-4 h-4 shrink-0" /> },
    { id: 4, label: '4. Posters & Art', icon: <ImageIcon className="w-4 h-4 shrink-0" /> },
    { id: 5, label: '5. Export Package', icon: <Box className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* TOP NAVIGATION & HEADER */}
      <header className="max-w-6xl mx-auto pt-6 px-4 no-print">
        {/* 5 Step Navigation Box */}
        <nav
          aria-label="Langkah Produksi Microdrama"
          className="studio-surface rounded-2xl p-3.5 shadow-2xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    tab.id === 5 ? 'col-span-2 sm:col-span-1' : ''
                  } flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 border border-emerald-500/45 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Hero Banner & Primary CTA */}
        <div className="mt-6 pb-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
              <SlidersHorizontal className="w-7 h-7 text-emerald-400 shrink-0" />
              <span>Parameter Film & Karakter</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Atur judul, durasi (1–30 menit), rasio, gaya visual, mode POV, konsistensi karakter, dan plot cerita.
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleGenerateMasterStoryboard}
              className="emerald-cta text-white font-bold px-6 py-3.5 rounded-full shadow-lg shadow-emerald-950/50 flex items-center gap-2.5 text-sm sm:text-base transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Rocket className="w-5 h-5" />
              )}
              <span>Generate Master Storyboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        {activeTab === 1 && (
          <SetupTab
            config={config}
            characters={characters}
            onUpdateConfig={handleUpdateConfig}
            onAutoIdea={handleAutoIdea}
            onAddCharacter={handleAddCharacter}
            onRemoveCharacter={handleRemoveCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onUploadCharacterSheet={handleUploadCharacterSheet}
            onRegenerateCharacterImage={handleRegenerateCharacterImage}
            onImportCharactersJson={handleImportCharactersJson}
          />
        )}

        {activeTab === 2 && (
          <MasterBoardTab
            scenes={scenes}
            ratio={config.ratio}
            selectedEpisode={selectedEpisode}
            onSelectEpisode={setSelectedEpisode}
            onAddCustomScene={handleAddCustomScene}
            onRegenerateAllImages={handleRegenerateAllImages}
            onUpdateSceneField={handleUpdateSceneField}
            onUpdateUnifiedPrompt={handleUpdateUnifiedPrompt}
            onUploadCustomFrame={handleUploadCustomFrame}
            onRegenerateSceneImage={handleRegenerateSceneImage}
            onSpeakDialogue={handleSpeakDialogue}
            onCopyText={handleCopyText}
          />
        )}

        {activeTab === 3 && (
          <ShotPromptTtsTab
            scenes={scenes}
            onCopyAllPrompts={handleCopyAllPrompts}
            onStopTts={handleStopTts}
            onSpeakDialogue={handleSpeakDialogue}
            onCopyText={handleCopyText}
          />
        )}

        {activeTab === 4 && (
          <PostersArtTab
            config={config}
            posters={posters}
            onRegeneratePosters={handleRegeneratePosters}
            onCopyText={handleCopyText}
          />
        )}

        {activeTab === 5 && (
          <ExportPackageTab
            exportPreviewText={exportPreviewText}
            onExportTxt={handleExportTxt}
            onExportCsv={handleExportCsv}
            onExportJson={handleExportJson}
            onPrintPdf={handlePrintPdf}
          />
        )}
      </main>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-bold z-50 flex items-center gap-2 no-print"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
