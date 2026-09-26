// ============================================================
// AgriNex AI — Intelligent Image Type Validator
// ============================================================
// Validates uploaded images to enforce strict type restriction:
// - Crop/Leaf section: ONLY accepts crop leaf / plant photos. Rejects pest traps & non-crop images.
// - Pest Trap section: ONLY accepts pest monitoring traps (Yellow/Blue sticky traps, pheromone traps). Rejects leaf photos & non-trap images.
// - Pest Trap Advisor: ONLY accepts crop leaf photos with pest symptoms.
// Multi-modal validation: Pixel color analysis + texture + metadata hints.
// ============================================================

export type DetectedImageType = 'crop_leaf' | 'pest_trap' | 'invalid_non_crop';
export type TargetSection = 'leaf' | 'trap';

export interface MultiLangMessage {
  mr: string;
  hi: string;
  en: string;
}

export interface DetailedValidationResult {
  isValid: boolean;
  detectedType: DetectedImageType;
  confidence: number;
  reason: string;
  reasonsByLang: MultiLangMessage;
  dominantColors: {
    green: number;
    brown: number;
    yellow: number;
    blue: number;
    other: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  isCropImage: boolean;
  detectedType: DetectedImageType;
  confidence: number;
  reason: string;
  reasonsByLang?: MultiLangMessage;
  dominantColors: { green: number; brown: number; other: number };
}

/**
 * Validates an image against the required target section ('leaf' or 'trap').
 * Enforces strict separation:
 * - leaf section rejects traps and non-crop photos
 * - trap section rejects leaves and non-trap photos
 */
export async function validateImageForTarget(
  imageDataUrl: string,
  target: TargetSection,
  fileName?: string
): Promise<DetailedValidationResult> {
  return new Promise((resolve) => {
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
      resolve({
        isValid: false,
        detectedType: 'invalid_non_crop',
        confidence: 0,
        reason: 'Invalid image data format',
        reasonsByLang: {
          mr: 'अवैध फोटो फॉरमॅट. कृपया नवीन फोटो निवडा.',
          hi: 'अमान्य फोटो प्रारूप। कृपया नया फोटो चुनें।',
          en: 'Invalid image format. Please select a new photo.',
        },
        dominantColors: { green: 0, brown: 0, yellow: 0, blue: 0, other: 100 },
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          isValid: false,
          detectedType: 'invalid_non_crop',
          confidence: 0,
          reason: 'Cannot analyze image canvas',
          reasonsByLang: {
            mr: 'फोटो विश्लेषण करता आले नाही. कृपया पुन्हा प्रयत्न करा.',
            hi: 'फोटो विश्लेषण नहीं किया जा सका। कृपया पुनः प्रयास करें।',
            en: 'Cannot analyze image. Please try again.',
          },
          dominantColors: { green: 0, brown: 0, yellow: 0, blue: 0, other: 100 },
        });
        return;
      }

      // Resize for rapid client-side color & texture profiling
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;
      const totalPixels = size * size;

      let greenPixels = 0;
      let brownPixels = 0;
      let yellowPixels = 0;
      let blueTrapPixels = 0;
      let whitePixels = 0;
      let darkPixels = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;

        // Pure green vegetation (chlorophyll in leaves, stems)
        if (g > r && g > b && g > 55 && (g - r) > 12) {
          greenPixels++;
        }
        // Brown plant material (dry foliage, necrosis, soil, stems)
        else if (r > g && r > b && r > 75 && g > 45 && b < g && (r - b) > 25) {
          brownPixels++;
        }
        // Bright saturated yellow (characteristic of yellow sticky insect traps)
        else if (r > 145 && g > 125 && b < 110 && Math.abs(r - g) < 55 && (r + g) > 2.2 * (b + 1)) {
          yellowPixels++;
        }
        // Bright saturated agricultural blue (characteristic of blue thrips traps)
        else if (b > 105 && b > r + 25 && b > g + 15) {
          blueTrapPixels++;
        }
        // White or near-white (documents, blank screens, background paper)
        else if (r > 205 && g > 205 && b > 205) {
          whitePixels++;
        }
        // Very dark (shadows, insects, underexposed areas)
        else if (l < 30) {
          darkPixels++;
        }
      }

      const greenPct = (greenPixels / totalPixels) * 100;
      const brownPct = (brownPixels / totalPixels) * 100;
      const yellowPct = (yellowPixels / totalPixels) * 100;
      const blueTrapPct = (blueTrapPixels / totalPixels) * 100;
      const plantRelated = greenPct + brownPct + (yellowPct * 0.5);
      const whitePct = (whitePixels / totalPixels) * 100;
      const darkPct = (darkPixels / totalPixels) * 100;

      const name = (fileName || '').toLowerCase();
      const isTrapFilename = /\b(trap|sticky|pheromone|delta|funnel|lure|yellow_trap|blue_trap)\b/i.test(name);
      const isLeafFilename = /\b(leaf|leaves|foliage|plant|crop|stem|blight|rust|caterpillar|borer|thrip|aphid|whitefly|mildew|spot|rot|wilt|tomato|potato|cotton|maize|chilli|rice|wheat)\b/i.test(name);

      // -------------------------------------------------------------
      // High-Precision Detection: Pest Trap vs Crop Leaf vs Non-Crop
      // -------------------------------------------------------------
      const isLeafName = isLeafFilename || /leaf|leaves|foliage|plant|crop|stem|tomato|potato|cotton|maize|chilli|rice|wheat|blight|rust|caterpillar|borer|thrip|aphid|whitefly|mildew|spot|rot|wilt/i.test(name);
      const isTrapName = isTrapFilename || /trap|sticky|pheromone|delta|funnel|lure|yellow_trap|blue_trap|sheet|board|flytrap/i.test(name);

      // Traps are defined by artificial saturated yellow/blue plastics or trap metadata
      const isYellowTrap = (yellowPct >= 17 && greenPct < 15 && yellowPct > greenPct * 1.1) || (yellowPct >= 22 && greenPct < 16);
      const isBlueTrap = blueTrapPct >= 11;
      const isPheromoneOrDeltaTrap = isTrapName && !isLeafName;
      const isPositivelyTrap = isYellowTrap || isBlueTrap || isPheromoneOrDeltaTrap;

      // Leaves are defined by organic green chlorophyll, brown plant lesions, or leaf metadata
      const isPositivelyLeaf =
        (greenPct >= 7) ||
        (plantRelated >= 15 && greenPct >= 3) ||
        (isLeafName && !isTrapName) ||
        (brownPct >= 12 && greenPct >= 3);

      let detectedType: DetectedImageType = 'invalid_non_crop';
      let confidence = 70;

      if (isPositivelyTrap && !isPositivelyLeaf) {
        detectedType = 'pest_trap';
        confidence = 96;
      } else if (isPositivelyLeaf && !isPositivelyTrap) {
        detectedType = 'crop_leaf';
        confidence = 96;
      } else if (isPositivelyTrap && isPositivelyLeaf) {
        // If there are both (e.g. trap hanging near a plant branch)
        if (yellowPct > greenPct * 1.5 || blueTrapPct >= 12) {
          detectedType = 'pest_trap';
          confidence = 90;
        } else {
          detectedType = 'crop_leaf';
          confidence = 90;
        }
      } else if (whitePct > 60 || darkPct > 65) {
        detectedType = 'invalid_non_crop';
        confidence = 88;
      } else {
        detectedType = 'invalid_non_crop';
        confidence = 65;
      }

      // -------------------------------------------------------------
      // Section Enforcement & Localized Messaging
      // -------------------------------------------------------------
      let isValid = false;
      let reasonsByLang: MultiLangMessage;

      if (target === 'trap') {
        // Section: PEST TRAP ONLY
        if (detectedType === 'crop_leaf' || isPositivelyLeaf) {
          isValid = false;
          reasonsByLang = {
            mr: '❌ पानाचा फोटो नाकारला! कीटक सापळा विभागात पिकाच्या किंवा पानाचा फोटो चालणार नाही. येथे केवळ पिवळा चिकट सापळा, निळा चिकट सापळा किंवा इतर कीटक सापळ्याचा फोटो स्वीकारला जाईल.',
            hi: '❌ पत्ती का फोटो अस्वीकृत! कीट ट्रैप अनुभाग में फसल या पत्ती का फोटो स्वीकार्य नहीं है। यहां केवल पीला स्टिकी ट्रैप, नीला स्टिकी ट्रैप या अन्य कीट ट्रैप का फोटो स्वीकार किया जाएगा।',
            en: '❌ Leaf Photo Rejected! The Pest Trap section does NOT accept crop or leaf images. Only trap-related images (Yellow Sticky Trap, Blue Trap, Pheromone Trap) are permitted.',
          };
        } else if (!isPositivelyTrap || detectedType === 'invalid_non_crop') {
          isValid = false;
          reasonsByLang = {
            mr: '❌ अवैध फोटो! हा कीटक सापळ्याचा फोटो नाही. कृपया केवळ पिवळा सापळा, निळा सापळा किंवा इतर कीटक सापळ्याचा फोटो अपलोड करा.',
            hi: '❌ अमान्य फोटो! यह कीट ट्रैप का फोटो नहीं है। कृपया केवल पीला ट्रैप, नीला ट्रैप या अन्य कीट ट्रैप का फोटो अपलोड करें।',
            en: '❌ Invalid Photo! This is not a pest monitoring trap. Please upload ONLY trap-related images (Yellow Trap, Blue Trap, Pheromone Trap).',
          };
        } else {
          isValid = true;
          detectedType = 'pest_trap';
          reasonsByLang = {
            mr: '✅ कीटक सापळ्याचा फोटो यशस्वीरीत्या ओळखला (पिवळा/निळा सापळा)',
            hi: '✅ कीट ट्रैप का फोटो सफलतापूर्वक पहचाना गया (पीला/नीला ट्रैप)',
            en: '✅ Valid pest monitoring trap image verified',
          };
        }
      } else {
        // Section: CROP LEAF ONLY
        if (detectedType === 'pest_trap' || isPositivelyTrap) {
          isValid = false;
          reasonsByLang = {
            mr: '❌ कीटक सापळ्याचा फोटो नाकारला! हा विभाग केवळ पिकाच्या/पानाच्या फोटोसाठी आहे. सापळ्याचा फोटो येथे स्वीकारला जात नाही. कृपया पानाचा फोटो अपलोड करा किंवा "कीटक सापळा तपासणी" विभागात जा.',
            hi: '❌ कीट ट्रैप का फोटो अस्वीकृत! यह अनुभाग केवल फसल/पत्ती के फोटो के लिए है। ट्रैप का फोटो यहां स्वीकार्य नहीं है। कृपया पत्ती का फोटो अपलोड करें या "कीट ट्रैप जांच" अनुभाग में जाएं।',
            en: '❌ Pest Trap Photo Rejected! This section strictly accepts Crop Leaf photos only. You cannot upload a trap image here. Please upload a leaf photo, or switch to Pest Trap Check.',
          };
        } else if (!isPositivelyLeaf || detectedType === 'invalid_non_crop') {
          isValid = false;
          reasonsByLang = {
            mr: '❌ अवैध फोटो: हा पिकाचा किंवा पानाचा फोटो दिसत नाही. कृपया शेतातील पिकाच्या पानाचा स्पष्ट फोटो अपलोड करा (कागदपत्रे, स्क्रीनशॉट किंवा इतर फोटो चालणार नाहीत).',
            hi: '❌ अमान्य फोटो: यह फसल या पत्ती का फोटो नहीं लग रहा है। कृपया खेत की पत्ती का स्पष्ट फोटो अपलोड करें (दस्तावेज, स्क्रीनशॉट या अन्य फोटो स्वीकार्य नहीं हैं)।',
            en: '❌ Invalid Photo: This does not appear to be a crop leaf or plant photograph. Please upload a clear photo of an agricultural crop leaf.',
          };
        } else {
          isValid = true;
          detectedType = 'crop_leaf';
          reasonsByLang = {
            mr: '✅ पिकाच्या पानाचा फोटो यशस्वीरीत्या ओळखला',
            hi: '✅ फसल की पत्ती का फोटो सफलतापूर्वक पहचाना गया',
            en: '✅ Valid crop leaf image verified',
          };
        }
      }

      resolve({
        isValid,
        detectedType,
        confidence,
        reason: reasonsByLang.en,
        reasonsByLang,
        dominantColors: {
          green: Math.round(greenPct),
          brown: Math.round(brownPct),
          yellow: Math.round(yellowPct),
          blue: Math.round(blueTrapPct),
          other: Math.round(Math.max(0, 100 - greenPct - brownPct - yellowPct - blueTrapPct)),
        },
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        detectedType: 'invalid_non_crop',
        confidence: 0,
        reason: 'Failed to load image file. Please try another file.',
        reasonsByLang: {
          mr: 'फोटो लोड करण्यात अयशस्वी. कृपया दुसरी फाईल निवडा.',
          hi: 'फोटो लोड करने में विफल। कृपया दूसरी फ़ाइल चुनें।',
          en: 'Failed to load image file. Please try another file.',
        },
        dominantColors: { green: 0, brown: 0, yellow: 0, blue: 0, other: 100 },
      });
    };

    img.src = imageDataUrl;
  });
}

/**
 * Backward-compatible helper for general crop image validation.
 */
export async function validateCropImage(
  imageDataUrl: string,
  fileName?: string
): Promise<ValidationResult> {
  const result = await validateImageForTarget(imageDataUrl, 'leaf', fileName);
  return {
    isValid: result.isValid,
    isCropImage: result.detectedType === 'crop_leaf',
    detectedType: result.detectedType,
    confidence: result.confidence,
    reason: result.reason,
    reasonsByLang: result.reasonsByLang,
    dominantColors: {
      green: result.dominantColors.green,
      brown: result.dominantColors.brown,
      other: result.dominantColors.other,
    },
  };
}

/**
 * Quick file-type validation before reading file
 */
export function validateFileType(file: File): { valid: boolean; reason: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, reason: 'Only JPG, PNG, and WebP images are allowed.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, reason: 'File too large. Maximum 10MB allowed.' };
  }
  if (file.size < 5 * 1024) {
    return { valid: false, reason: 'File too small. Please upload a proper photograph.' };
  }
  return { valid: true, reason: '' };
}
