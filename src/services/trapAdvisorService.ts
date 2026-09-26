// ============================================================
// AgriNex AI — Pest Trap Advisor Service
// ============================================================
// Helps farmers who do not know which pest trap to install.
// Recommends an appropriate trap category based on:
// - Crop
// - Location & Weather Risk
// - Previous Pest Observations (Optional)
// ============================================================

import type { Crop, TrapType } from '../types';

export interface TrapRecommendation {
  trapType: TrapType;
  crop: Crop;
  primaryPest: string;
  targetPests: string[];
  whyReason: string;
  simpleGuidance: string[];
  installationTip: string;
}

export function recommendPestTrap(
  crop: Crop,
  locationDistrict?: string,
  observedPest?: string
): TrapRecommendation {
  const pestLower = (observedPest || '').toLowerCase();

  // If farmer specifically saw caterpillars / borers / moths
  if (
    pestLower.includes('caterpillar') ||
    pestLower.includes('borer') ||
    pestLower.includes('armyworm') ||
    pestLower.includes('moth')
  ) {
    return {
      trapType: 'Pheromone Trap',
      crop,
      primaryPest: crop === 'Maize' ? 'Fall Armyworm' : crop === 'Tomato' ? 'Fruit Borer' : 'Borer Moth',
      targetPests: ['Fruit Borer', 'Fall Armyworm', 'Cutworm Moths'],
      whyReason: 'Useful for detecting adult male moths before caterpillars hatch and cause bore damage in fruit or stems.',
      simpleGuidance: [
        'Erect 4 to 5 traps per acre at crop canopy level.',
        'Check lure catches every 3 to 4 days.',
        'Change lure capsule every 21 days for sustained attractancy.',
      ],
      installationTip: 'Hang the trap 1 foot above the top canopy of the crop so wind can carry the pheromone scent evenly.',
    };
  }

  // If thrips is noticed or crop is Cotton with dry warm weather
  if (pestLower.includes('thrip') || (crop === 'Cotton' && !observedPest)) {
    return {
      trapType: 'Blue Sticky Trap',
      crop,
      primaryPest: 'Thrips',
      targetPests: ['Thrips', 'Flower Thrips'],
      whyReason: 'Useful for monitoring thrips and delicate flower-visiting pests attracted specifically to blue wavelength light.',
      simpleGuidance: [
        'Install 8 to 10 blue sheets per acre.',
        'Position sticky sheets at flower canopy height.',
        'Replace traps once 70% of adhesive is covered with dust or insects.',
      ],
      installationTip: 'Place traps near blossoming flower clusters where thrips congregate.',
    };
  }

  // If nocturnal beetles or general night-flying insects
  if (pestLower.includes('beetle') || pestLower.includes('light') || pestLower.includes('night')) {
    return {
      trapType: 'Light Trap',
      crop,
      primaryPest: 'Stem Borer & Nocturnal Beetles',
      targetPests: ['Stem Borer Adults', 'Night Moths', 'Chafers'],
      whyReason: 'Useful for sampling nocturnal insect flight activity across the farm.',
      simpleGuidance: [
        'Operate for 2 to 3 hours after dusk (7 PM to 10 PM).',
        'Keep water basin with a few drops of kerosene or detergent below the light source.',
      ],
      installationTip: 'Install 1 light trap at the center of the field plot away from domestic streetlights.',
    };
  }

  // Default recommendation for Tomato, Potato, Soybean, Cotton (Sucking Pests)
  return {
    trapType: 'Yellow Sticky Trap',
    crop,
    primaryPest: 'Whitefly & Aphids',
    targetPests: ['Whitefly', 'Aphids', 'Leafminer', 'Fungus Gnats'],
    whyReason: 'Useful for monitoring certain flying/soft-bodied pests like Whitefly and Aphids before they transmit plant viruses.',
    simpleGuidance: [
      'Install 8 to 10 yellow cards per acre spaced 10 meters apart.',
      'Fasten cards securely to bamboo sticks at crop canopy height.',
      'Check cards twice a week to monitor pest population trends.',
    ],
    installationTip: 'Place yellow cards at the prevailing windward border of your field to intercept incoming flying pests early.',
  };
}

export default {
  recommendPestTrap,
};
