import { readFileSync } from 'fs';
import pkg from 'fig-kiwi';
const { readFigFile } = pkg;

const figData = readFileSync('.figma-extract/canvas.fig');
const result = readFigFile(figData);

// Extract text content
function extractTexts(obj, depth = 0) {
  if (!obj || typeof obj !== 'object') return;
  if (depth > 15) return;
  
  if (obj.type === 'TEXT' || obj.characters) {
    console.log('TEXT:', JSON.stringify({
      name: obj.name,
      characters: obj.characters,
      fontSize: obj.fontSize,
      fontFamily: obj.fontFamily,
      fontWeight: obj.fontWeight,
      lineHeight: obj.lineHeight,
      letterSpacing: obj.letterSpacing,
    }));
  }
  
  // Look for fills/colors
  if (obj.fills && Array.isArray(obj.fills)) {
    for (const fill of obj.fills) {
      if (fill.color) {
        const r = Math.round((fill.color.r || 0) * 255);
        const g = Math.round((fill.color.g || 0) * 255);
        const b = Math.round((fill.color.b || 0) * 255);
        console.log('COLOR:', `rgb(${r},${g},${b})`, `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`, 'on:', obj.name);
      }
    }
  }
  
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val)) {
      for (const item of val) extractTexts(item, depth + 1);
    } else if (typeof val === 'object' && val !== null) {
      extractTexts(val, depth + 1);
    }
  }
}

// Try to navigate the structure
const msg = result.message;
console.log('=== Top-level keys ===');
console.log(Object.keys(msg));

// Try to access the document
if (msg.document) {
  console.log('\n=== Document keys ===');
  console.log(Object.keys(msg.document));
}

// Recursively extract 
console.log('\n=== Extracted Content ===');
extractTexts(msg);
