export interface Character {
  id: string;
  name: string;
  role: string;
  appearance: string;
  outfit: string;
  voiceStyle: string;
  imageUrl: string;
  isCustomUpload: boolean;
}

export type AspectRatioOption = '9:16' | '16:9' | '1:1';

export interface ProjectConfig {
  title: string;
  genre: string;
  durationMinutes: number;
  sceneDensity: number;
  ratio: AspectRatioOption;
  style: string;
  pov: string;
  plot: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  episode: number;
  phase: string;
  timecode: string;
  location: string;
  camera: string;
  speaker: string;
  voiceStyle: string;
  action: string;
  dialogue: string;
  unifiedPrompt: string;
  imageUrl: string;
  isCustomFrame?: boolean;
}

export interface PosterArt {
  verticalPrompt: string;
  horizontalPrompt: string;
  verticalImageUrl: string;
  horizontalImageUrl: string;
}
