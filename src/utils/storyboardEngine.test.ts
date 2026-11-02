import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDurationMetrics,
  generatePlotFromTitle,
  buildUnifiedPrompt,
  generateStoryboardScenes,
  buildFullExportText,
  buildStoryboardCSV,
  INITIAL_CHARACTERS,
  INITIAL_PROJECT_CONFIG,
} from './storyboardEngine';

test('calculateDurationMetrics computes accurate frame and episode counts across 1-30 mins', () => {
  const m3 = calculateDurationMetrics(3, 4);
  assert.equal(m3.minutes, 3);
  assert.equal(m3.totalScenes, 12);
  assert.equal(m3.episodes, 2);
  assert.equal(m3.secondsPerScene, 15);

  const m30 = calculateDurationMetrics(30, 6);
  assert.equal(m30.minutes, 30);
  assert.equal(m30.totalScenes, 180);
  assert.equal(m30.episodes, 15);
});

test('generatePlotFromTitle embeds title, genre, duration, and character names', () => {
  const plot = generatePlotFromTitle(
    'Pewaris Rahasia Gedung Kembar',
    'Balas Dendam & Pengkhianatan',
    10,
    INITIAL_CHARACTERS
  );
  assert.ok(plot.includes('Pewaris Rahasia Gedung Kembar'));
  assert.ok(plot.includes('10 menit'));
  assert.ok(plot.includes('Arka Wijaya'));
  assert.ok(plot.includes('Nadia Larasati'));
});

test('buildUnifiedPrompt merges character lock, camera POV, setting, action, and lip-sync dialogue', () => {
  const unified = buildUnifiedPrompt({
    sceneNumber: 1,
    episode: 1,
    ratio: '9:16',
    style: 'Realistis 8K',
    pov: 'Third-Person',
    camera: 'Extreme Close-Up',
    location: 'Ballroom Utama',
    speakerChar: INITIAL_CHARACTERS[0],
    listenerChar: INITIAL_CHARACTERS[1],
    action: 'Arka berdiri tenang.',
    dialogue: '"Aku pemilik gedung ini."',
  });

  assert.ok(unified.includes('[SCENE 1 - EPISODE 1 | 9:16 | Realistis 8K]'));
  assert.ok(unified.includes(INITIAL_CHARACTERS[0].appearance));
  assert.ok(unified.includes('DIALOGUE (Lip-Sync / Spoken in Indonesian by Arka Wijaya'));
  assert.ok(unified.includes('"Aku pemilik gedung ini."'));
});

test('generateStoryboardScenes creates exact number of frames and exports cleanly', () => {
  const config = { ...INITIAL_PROJECT_CONFIG, title: 'Cinta di Balik Hujan', durationMinutes: 2, sceneDensity: 4 };
  const scenes = generateStoryboardScenes(config, INITIAL_CHARACTERS);
  assert.equal(scenes.length, 8);
  assert.equal(scenes[0].sceneNumber, 1);
  assert.equal(scenes[7].sceneNumber, 8);

  const txt = buildFullExportText(config, INITIAL_CHARACTERS, scenes);
  assert.ok(txt.includes('CINTA DI BALIK HUJAN'));
  assert.ok(txt.includes('FRAME #8'));

  const csv = buildStoryboardCSV(scenes);
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 9); // 1 header + 8 rows
});
