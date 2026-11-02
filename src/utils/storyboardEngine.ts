import type { AspectRatioOption, Character, ProjectConfig, StoryboardScene, PosterArt } from '../types/microdrama';

export const STUDIO_ASSETS = {
  charArka: '/src/assets/images/char_arka_ceo_1793640187214.jpg',
  charNadia: '/src/assets/images/char_nadia_lead_1793640188232.jpg',
  charReno: '/src/assets/images/char_reno_antagonist_1793640189346.jpg',
  posterVertical: '/src/assets/images/poster_vertical_cover_1793640191196.jpg',
  sceneLobby: '/src/assets/images/scene_chandelier_lobby_1793640191530.jpg',
};

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char-1',
    name: 'Arka Wijaya',
    role: 'Protagonis Pria (CEO Menyamar)',
    appearance:
      'Handsome 28yo Indonesian man, sharp jawline, neat comma hair, wearing a simple courier jacket over a luxury wristwatch, calm and charismatic gaze',
    outfit: 'Jaket kurir gelap di awal, setelan jas hitam tailored mewah di klimaks',
    voiceStyle: 'Bariton tenang, berwibawa',
    imageUrl: STUDIO_ASSETS.charArka,
    isCustomUpload: false,
  },
  {
    id: 'char-2',
    name: 'Nadia Larasati',
    role: 'Protagonis Wanita',
    appearance:
      'Beautiful 25yo Indonesian woman, expressive doe eyes, shoulder-length dark wavy hair, wearing elegant modest office attire, warm yet resilient expression',
    outfit: 'Blazer krem rapi & kemeja putih elegan',
    voiceStyle: 'Lembut, tegas, emosional',
    imageUrl: STUDIO_ASSETS.charNadia,
    isCustomUpload: false,
  },
  {
    id: 'char-3',
    name: 'Reno Pratama',
    role: 'Antagonis (Mantan Tunangan Sombong)',
    appearance:
      'Arrogant 29yo wealthy man, slicked-back hair, wearing flashy maroon designer suit, smirk expression',
    outfit: 'Jas maroon mencolok dengan dasi sutra',
    voiceStyle: 'Sinis, meremehkan, lantang',
    imageUrl: STUDIO_ASSETS.charReno,
    isCustomUpload: false,
  },
];

export const INITIAL_PROJECT_CONFIG: ProjectConfig = {
  title: 'Suami Miliarder yang Menyamar Jadi Kurir',
  genre: 'Drama Romansa & CEO Menyamar',
  durationMinutes: 3,
  sceneDensity: 4,
  ratio: '9:16',
  style: 'Ultra-realistic K-Drama / C-Drama cinematic lighting, 8k photorealistic, Arri Alexa',
  pov: 'Dynamic Third-Person Cinematic (Close-up emosional & Over-the-shoulder)',
  plot: '',
};

export function formatTimecode(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (safeSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function calculateDurationMetrics(durationMinutes: number, sceneDensity: number): {
  minutes: number;
  density: number;
  totalScenes: number;
  episodes: number;
  secondsPerScene: number;
} {
  const minutes = Math.min(30, Math.max(1, Math.round(durationMinutes || 1)));
  const density = [2, 4, 6].includes(sceneDensity) ? sceneDensity : 4;
  const totalScenes = minutes * density;
  const episodes = Math.max(1, Math.ceil(minutes / 2));
  const secondsPerScene = Math.max(5, Math.round((minutes * 60) / totalScenes));

  return {
    minutes,
    density,
    totalScenes,
    episodes,
    secondsPerScene,
  };
}

export function generatePlotFromTitle(
  title: string,
  genre: string,
  durationMinutes: number,
  characters: Character[]
): string {
  const cleanTitle = title.trim() || 'Rahasia Takdir Cinta';
  const c1 = characters[0]?.name || 'Arka';
  const c2 = characters[1]?.name || 'Nadia';
  const c3 = characters[2]?.name || 'Reno';

  return `Dalam microdrama "${cleanTitle}" (${genre}, durasi ${durationMinutes} menit), ${c2} dipermalukan di depan umum oleh ${c3} yang memandang rendah statusnya. Tanpa seorang pun tahu, ${c1} yang selama ini tampak sederhana ternyata memegang kekuasaan tertinggi yang mampu membalikkan nasib mereka dalam sekejap. Konflik memuncak saat identitas asli terungkap di acara besar, membungkam semua orang yang pernah menghina mereka.`;
}

export function buildUnifiedPrompt(params: {
  sceneNumber: number;
  episode: number;
  ratio: AspectRatioOption;
  style: string;
  pov: string;
  camera: string;
  location: string;
  speakerChar: Pick<Character, 'name' | 'appearance' | 'outfit' | 'voiceStyle'>;
  listenerChar?: Pick<Character, 'name' | 'appearance' | 'outfit'>;
  action: string;
  dialogue: string;
}): string {
  const {
    sceneNumber,
    episode,
    ratio,
    style,
    pov,
    camera,
    location,
    speakerChar,
    listenerChar,
    action,
    dialogue,
  } = params;

  const listenerSegment = listenerChar
    ? ` 2) ${listenerChar.name} (${listenerChar.appearance}, wearing ${listenerChar.outfit}) reacting emotionally.`
    : '';

  return (
    `[SCENE ${sceneNumber} - EPISODE ${episode} | ${ratio} | ${style}] ` +
    `CAMERA & POV: ${pov}, ${camera}. ` +
    `SETTING: ${location}. ` +
    `CHARACTERS IN FRAME: 1) ${speakerChar.name} (${speakerChar.appearance}, wearing ${speakerChar.outfit}) speaking with intense expression;${listenerSegment} ` +
    `ACTION: ${action} ` +
    `DIALOGUE (Lip-Sync / Spoken in Indonesian by ${speakerChar.name}, voice tone: ${speakerChar.voiceStyle}): ${dialogue}`
  );
}

export function createSvgSceneCardDataUrl(params: {
  sceneNumber: number;
  episode: number;
  phase: string;
  speaker: string;
  camera: string;
  location: string;
  dialogue: string;
  ratio: AspectRatioOption;
  seed?: number;
}): string {
  const width = params.ratio === '9:16' ? 540 : params.ratio === '16:9' ? 960 : 720;
  const height = params.ratio === '9:16' ? 960 : params.ratio === '16:9' ? 540 : 720;
  const palettes = [
    ['#091526', '#0f2942', '#10b981'],
    ['#1a1025', '#2d1b4e', '#f59e0b'],
    ['#0f172a', '#1e293b', '#38bdf8'],
    ['#1f1218', '#3b1826', '#fb7185'],
    ['#0c1f1c', '#133832', '#34d399'],
    ['#18181b', '#27272a', '#a78bfa'],
  ];
  const idx = ((params.sceneNumber - 1) + (params.seed || 0)) % palettes.length;
  const [bgStart, bgEnd, accent] = palettes[idx];

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const safePhase = escapeXml(params.phase.slice(0, 42));
  const safeCamera = escapeXml(params.camera.slice(0, 52));
  const safeLocation = escapeXml(params.location.slice(0, 55));
  const safeSpeaker = escapeXml(params.speaker.slice(0, 32));
  const safeDialogue = escapeXml(params.dialogue.replace(/^"+|"+$/g, '').slice(0, 74));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgStart}" />
        <stop offset="100%" stop-color="${bgEnd}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="55%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.24" />
        <stop offset="100%" stop-color="${bgStart}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <rect width="100%" height="100%" fill="url(#glow)" />
    <g stroke="rgba(255,255,255,0.07)" stroke-width="1">
      <line x1="${width * 0.33}" y1="0" x2="${width * 0.33}" y2="${height}" />
      <line x1="${width * 0.66}" y1="0" x2="${width * 0.66}" y2="${height}" />
      <line x1="0" y1="${height * 0.33}" x2="${width}" y2="${height * 0.33}" />
      <line x1="0" y1="${height * 0.66}" x2="${width}" y2="${height * 0.66}" />
    </g>
    <circle cx="${width * 0.5}" cy="${height * 0.38}" r="${Math.min(width, height) * 0.14}" fill="rgba(255,255,255,0.05)" stroke="${accent}" stroke-width="2" />
    <path d="M ${width * 0.34} ${height * 0.62} Q ${width * 0.5} ${height * 0.48} ${width * 0.66} ${height * 0.62}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.65" />
    <rect x="28" y="28" width="${width - 56}" height="46" rx="10" fill="rgba(11,17,30,0.76)" stroke="rgba(255,255,255,0.12)" />
    <text x="46" y="57" fill="${accent}" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="800">FRAME #${params.sceneNumber} · EP ${params.episode}</text>
    <text x="${width - 46}" y="57" text-anchor="end" fill="#e2e8f0" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="600">${safePhase}</text>
    <rect x="28" y="${height - 175}" width="${width - 56}" height="145" rx="14" fill="rgba(11,17,30,0.86)" stroke="rgba(255,255,255,0.12)" />
    <text x="48" y="${height - 140}" fill="#94a3b8" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600">${safeCamera}</text>
    <text x="48" y="${height - 114}" fill="#cbd5e1" font-family="Plus Jakarta Sans, sans-serif" font-size="14">${safeLocation}</text>
    <text x="48" y="${height - 80}" fill="${accent}" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700">${safeSpeaker}:</text>
    <text x="48" y="${height - 54}" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="600">"${safeDialogue}..."</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateStoryboardScenes(
  config: ProjectConfig,
  characters: Character[]
): StoryboardScene[] {
  const title = config.title.trim() || 'Microdrama Tanpa Judul';
  const { totalScenes, secondsPerScene } = calculateDurationMetrics(
    config.durationMinutes,
    config.sceneDensity
  );

  const c1: Character = characters[0] || {
    id: 'fallback-1',
    name: 'Tokoh Utama',
    role: 'Protagonis',
    appearance: 'Lead character, expressive eyes',
    outfit: 'Signature modern attire',
    voiceStyle: 'Tegas, berwibawa',
    imageUrl: STUDIO_ASSETS.charArka,
    isCustomUpload: false,
  };
  const c2: Character = characters[1] || c1;
  const c3: Character = characters[2] || c2;

  const cameraAngles = [
    'Extreme Close-Up (ECU) pada mata dan ekspresi wajah',
    'Medium Two-Shot menghadap dua karakter yang berhadapan tegang',
    'Low-Angle Hero Shot menonjolkan aura dominan karakter',
    'Over-The-Shoulder (OTS) Shot saat dialog konfrontasi',
    'Dramatic Wide Establishing Shot dengan pencahayaan kontras',
    'Tracking Close-Up mengikuti langkah kaki menuju ruangan utama',
  ];

  const locations = [
    `Lobby gedung mewah dengan lampu kristal megah berkaitan dengan "${title}"`,
    'Teras kafe malam hari di bawah rintik hujan dramatis',
    'Ruang VIP eksklusif dengan jendela kaca menghadap lampu kota Jakarta',
    'Koridor utama perusahaan tempat semua orang menyaksikan konfrontasi',
    'Kediaman megah bergaya klasik modern dengan pencahayaan hangat',
    'Pintu masuk ballroom pesta besar tempat rahasia terungkap',
  ];

  const narrativeBeats = [
    {
      phase: 'Hook Pembuka (3 Detik Pertama)',
      speaker: c3,
      listener: c2,
      action: `${c3.name} menatap sinis dan menjatuhkan dokumen di hadapan ${c2.name} di tengah keramaian.`,
      dialogue: `"Jangan mimpi bisa berdiri sejajar denganku! Dalam cerita '${title}' ini, orang sepertimu tidak punya tempat di sini!"`,
    },
    {
      phase: 'Tekanan & Konflik Emosional',
      speaker: c2,
      listener: c3,
      action: `${c2.name} mengepalkan tangan, menahan emosi namun menatap lurus tanpa gentar ke arah ${c3.name}.`,
      dialogue: `"Kau bisa menghinaku hari ini, ${c3.name}, tapi kebenaran tidak akan selamanya bisa kau sembunyikan!"`,
    },
    {
      phase: 'Kemunculan Misterius / Turning Point',
      speaker: c1,
      listener: c2,
      action: `${c1.name} melangkah masuk dengan tenang, berdiri tepat di samping ${c2.name} dan memasang tatapan tajam.`,
      dialogue: `"Siapa pun yang berani menyentuhnya, berarti berhadapan langsung denganku."`,
    },
    {
      phase: 'Ejekan Antagonis Sebelum Twist',
      speaker: c3,
      listener: c1,
      action: `${c3.name} tertawa meremehkan sambil menunjuk pakaian ${c1.name} di depan semua tamu.`,
      dialogue: `"Hahaha! Hanya orang biasa seperti dia yang kau andalkan untuk melawan kekuasaanku?!"`,
    },
    {
      phase: 'Bukti & Pengungkapan Identitas',
      speaker: c1,
      listener: c3,
      action: `${c1.name} mengeluarkan kartu akses tertinggi dan bukti rahasia, membuat seluruh ruangan terdiam kaget.`,
      dialogue: `"Buka matamu baik-baik. Seluruh proyek dan posisi yang kau banggakan itu berada di bawah tanda tanganku."`,
    },
    {
      phase: 'Klimaks & Cliffhanger Emosional',
      speaker: c2,
      listener: c1,
      action: `${c3.name} pucat pasi tak percaya, sementara ${c2.name} menoleh ke arah ${c1.name} dengan mata berkaca-kaca.`,
      dialogue: `"Jadi selama ini... kau yang selalu melindungiku dari balik layar, ${c1.name}?"`,
    },
  ];

  const visualPool = [
    STUDIO_ASSETS.posterVertical,
    STUDIO_ASSETS.sceneLobby,
    STUDIO_ASSETS.charArka,
    STUDIO_ASSETS.charNadia,
    STUDIO_ASSETS.charReno,
  ];

  const scenes: StoryboardScene[] = [];

  for (let i = 0; i < totalScenes; i++) {
    const sceneNum = i + 1;
    const episodeNum = Math.floor(i / 6) + 1;
    const beat = narrativeBeats[i % narrativeBeats.length];
    const angle = cameraAngles[i % cameraAngles.length];
    const loc = locations[i % locations.length];

    const startSec = i * secondsPerScene;
    const endSec = (i + 1) * secondsPerScene;
    const timecode = `${formatTimecode(startSec)} - ${formatTimecode(endSec)}`;

    const speakerChar = beat.speaker;
    const listenerChar = beat.listener;

    const unifiedPrompt = buildUnifiedPrompt({
      sceneNumber: sceneNum,
      episode: episodeNum,
      ratio: config.ratio,
      style: config.style,
      pov: config.pov,
      camera: angle,
      location: loc,
      speakerChar,
      listenerChar,
      action: beat.action,
      dialogue: beat.dialogue,
    });

    const imageUrl =
      i < visualPool.length
        ? visualPool[i]
        : speakerChar.isCustomUpload
          ? speakerChar.imageUrl
          : createSvgSceneCardDataUrl({
              sceneNumber: sceneNum,
              episode: episodeNum,
              phase: beat.phase,
              speaker: speakerChar.name,
              camera: angle,
              location: loc,
              dialogue: beat.dialogue,
              ratio: config.ratio,
            });

    scenes.push({
      sceneNumber: sceneNum,
      episode: episodeNum,
      phase: beat.phase,
      timecode,
      location: loc,
      camera: angle,
      speaker: speakerChar.name,
      voiceStyle: speakerChar.voiceStyle,
      action: beat.action,
      dialogue: beat.dialogue,
      unifiedPrompt,
      imageUrl,
    });
  }

  return scenes;
}

export function generatePosterData(
  config: ProjectConfig,
  characters: Character[]
): PosterArt {
  const title = config.title.trim() || 'Microdrama';
  const style = config.style;
  const c1 = characters[0]?.appearance || 'lead male character';
  const c2 = characters[1]?.appearance || 'lead female character';

  const verticalPrompt = `Official vertical movie poster for microdrama titled "${title}", featuring ${c1} and ${c2} in dramatic embrace and tension, luxury city background, ${style}, cinematic typography layout, 8k masterpiece`;
  const horizontalPrompt = `Widescreen 16:9 Netflix & ReelShort banner key art for "${title}", ${c1} facing ${c2} with dramatic lighting, high emotional stakes, ${style}`;

  return {
    verticalPrompt,
    horizontalPrompt,
    verticalImageUrl: STUDIO_ASSETS.posterVertical,
    horizontalImageUrl: STUDIO_ASSETS.sceneLobby,
  };
}

export function buildFullExportText(
  config: ProjectConfig,
  characters: Character[],
  scenes: StoryboardScene[]
): string {
  const plot =
    config.plot.trim() ||
    generatePlotFromTitle(config.title, config.genre, config.durationMinutes, characters);

  let out = `============================================================\n`;
  out += `DOKUMEN PRODUKSI MICRODRAMA: ${config.title.toUpperCase()}\n`;
  out += `Genre: ${config.genre} | Durasi: ${config.durationMinutes} Menit | Rasio: ${config.ratio}\n`;
  out += `============================================================\n\n`;
  out += `SINOPSIS:\n${plot}\n\n`;
  out += `--- DAFTAR CHARACTER SHEET ---\n`;
  characters.forEach((c, i) => {
    out += `${i + 1}. ${c.name} (${c.role})\n   Visual Lock: ${c.appearance}\n   Outfit: ${c.outfit} | Suara: ${c.voiceStyle}\n\n`;
  });
  out += `--- MASTER STORYBOARD & PROMPT TERPADU (VISUAL + DIALOG) ---\n\n`;
  scenes.forEach((s) => {
    out += `[FRAME #${s.sceneNumber} | EPISODE ${s.episode} | ${s.timecode}] (${s.phase})\n`;
    out += `Lokasi : ${s.location}\n`;
    out += `Kamera : ${s.camera}\n`;
    out += `Aksi   : ${s.action}\n`;
    out += `Dialog : ${s.speaker}: ${s.dialogue}\n`;
    out += `PROMPT TERPADU:\n${s.unifiedPrompt}\n`;
    out += `------------------------------------------------------------\n`;
  });
  return out;
}

export function buildStoryboardCSV(scenes: StoryboardScene[]): string {
  let csv =
    'Frame,Episode,Timecode,Tahap,Lokasi,Kamera,Pembicara,Dialog,Prompt_Terpadu_Visual_Dialog\n';
  scenes.forEach((s) => {
    const row = [
      s.sceneNumber,
      s.episode,
      `"${s.timecode}"`,
      `"${s.phase.replace(/"/g, '""')}"`,
      `"${s.location.replace(/"/g, '""')}"`,
      `"${s.camera.replace(/"/g, '""')}"`,
      `"${s.speaker.replace(/"/g, '""')}"`,
      `"${s.dialogue.replace(/"/g, '""')}"`,
      `"${s.unifiedPrompt.replace(/"/g, '""')}"`,
    ];
    csv += row.join(',') + '\n';
  });
  return csv;
}
