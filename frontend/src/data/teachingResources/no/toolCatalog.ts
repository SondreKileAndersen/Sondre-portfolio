import type { TeachingResourceTool } from '../../../types/teachingResource'

export const teachingTools = {
  figma: {
    id: 'figma',
    name: 'Figma',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Figma-logo.svg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Figma-logo.svg',
  },
  illustrator: {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Adobe_Illustrator_CC_icon.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Adobe_Illustrator_CC_icon.svg',
  },
  photoshop: {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Adobe_Photoshop_CC_2026_icon.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Adobe_Photoshop_CC_2026_icon.svg',
  },
  indesign: {
    id: 'indesign',
    name: 'Adobe InDesign',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Adobe_Indesign_CC_2026_icon.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Adobe_Indesign_CC_2026_icon.svg',
  },
  premierePro: {
    id: 'premiere-pro',
    name: 'Adobe Premiere Pro',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Adobe_Premiere_Pro_CC_2026_icon.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Adobe_Premiere_Pro_CC_2026_icon.svg',
  },
  afterEffects: {
    id: 'after-effects',
    name: 'Adobe After Effects',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Adobe_After_Effects_CC_icon.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Adobe_After_Effects_CC_icon.svg',
  },
  powerPoint: {
    id: 'microsoft-powerpoint',
    name: 'Microsoft PowerPoint',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/PowerPoint_Logo_2025.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:PowerPoint_Logo_2025.svg',
  },
  commandPrompt: {
    id: 'command-prompt',
    name: 'Command Prompt',
    logoSrc:
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Iconol_terminal_Windows.svg',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Iconol_terminal_Windows.svg',
  },
} satisfies Record<string, TeachingResourceTool>
