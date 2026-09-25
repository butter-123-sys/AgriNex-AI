// ============================================================
// AgriFedX — Crop Image Validator
// ============================================================
// Validates uploaded images to ensure they are crop/leaf images.
// Uses color histogram analysis to detect green/brown plant tones.
// Rejects non-crop images like selfies, screenshots, documents.
// INTEGRATION POINT: Replace with real image classification API
// ============================================================

export interface ValidationResult {
  isValid: boolean;
  isCropImage: boolean;
  confidence: number;
  reason: string;
  dominantColors: { green: number; brown: number; other: number };
}

/**
 * Analyzes an image to determine if it's likely a crop/leaf image.
 * Uses canvas-based color analysis — no API needed.
 */
export async function validateCropImage(imageDataUrl: string): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ isValid: false, isCropImage: false, confidence: 0, reason: 'Cannot analyze image', dominantColors: { green: 0, brown: 0, other: 0 } });
        return;
      }

      // Resize for faster analysis
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

        // Convert to HSL for better color detection
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;

        // Green detection (leaves, stems, grass)
        if (g > r && g > b && g > 60 && (g - r) > 15) {
          greenPixels++;
        }
        // Brown detection (soil, dried leaves, blight spots)
        else if (r > g && r > b && r > 80 && g > 50 && b < g && (r - b) > 30) {
          brownPixels++;
        }
        // Yellow detection (wilting, rust, yellow sticky trap)
        else if (r > 150 && g > 130 && b < 100 && Math.abs(r - g) < 50) {
          yellowPixels++;
        }
        // Blue detection (blue sticky trap)
        else if (b > 110 && b > r + 25 && b > g + 15) {
          blueTrapPixels++;
        }
        // White/very light (powdery mildew, overexposed)
        else if (r > 200 && g > 200 && b > 200) {
          whitePixels++;
        }
        // Very dark (insects, necrosis)
        else if (l < 30) {
          darkPixels++;
        }
      }

      const greenPct = (greenPixels / totalPixels) * 100;
      const brownPct = (brownPixels / totalPixels) * 100;
      const yellowPct = (yellowPixels / totalPixels) * 100;
      const blueTrapPct = (blueTrapPixels / totalPixels) * 100;
      const plantRelated = greenPct + brownPct + yellowPct;
      const whitePct = (whitePixels / totalPixels) * 100;
      const darkPct = (darkPixels / totalPixels) * 100;

      // Decision logic
      let isCropImage = false;
      let confidence = 0;
      let reason = '';

      if (yellowPct >= 28 && darkPct >= 1) {
        // Agricultural Yellow Sticky Trap with insect spots
        isCropImage = true;
        confidence = 94;
        reason = 'Agricultural Yellow Sticky Trap image detected';
      } else if (blueTrapPct >= 20) {
        // Agricultural Blue Sticky Trap
        isCropImage = true;
        confidence = 92;
        reason = 'Agricultural Blue Sticky Trap image detected';
      } else if (plantRelated >= 25) {
        // Strong plant-related colors
        isCropImage = true;
        confidence = Math.min(95, 50 + plantRelated * 0.8);
        reason = 'Image contains plant/crop color patterns';
      } else if (greenPct >= 12) {
        // Some green present
        isCropImage = true;
        confidence = Math.min(80, 40 + greenPct * 2);
        reason = 'Image contains green vegetation patterns';
      } else if (brownPct >= 15 && greenPct >= 5) {
        // Diseased or dry crop
        isCropImage = true;
        confidence = Math.min(75, 35 + brownPct + greenPct);
        reason = 'Image appears to show crop/plant material';
      } else if (whitePct > 60) {
        isCropImage = false;
        confidence = 85;
        reason = 'Image appears to be a document or screenshot. Please upload a crop or trap photo.';
      } else if (darkPct > 60) {
        isCropImage = false;
        confidence = 70;
        reason = 'Image is too dark. Please upload a clear, well-lit crop or trap image.';
      } else {
        isCropImage = false;
        confidence = 60;
        reason = 'This does not appear to be a crop leaf or trap image. Please upload a crop photograph.';
      }

      resolve({
        isValid: true,
        isCropImage,
        confidence: Math.round(confidence),
        reason,
        dominantColors: {
          green: Math.round(greenPct),
          brown: Math.round(brownPct),
          other: Math.round(100 - greenPct - brownPct),
        },
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        isCropImage: false,
        confidence: 0,
        reason: 'Failed to load image. Please try a different file.',
        dominantColors: { green: 0, brown: 0, other: 0 },
      });
    };

    img.src = imageDataUrl;
  });
}

/**
 * Quick file-type validation before loading
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
    return { valid: false, reason: 'File too small. Please upload a proper crop photograph.' };
  }
  return { valid: true, reason: '' };
}
