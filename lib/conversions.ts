/**
 * Typed helpers for loading and querying the static conversion JSON data.
 * All JSON files live in /conversions/ and are imported at build time.
 *
 * JSON shape:
 *   { "Category Name": { "FORMAT Converter": { description, conversions: [{ operation, progress }] } } }
 */

import imageData       from '@/conversions/image_converter.json';
import videoData       from '@/conversions/video_converter.json';
import audioData       from '@/conversions/audio_converter.json';
import documentData    from '@/conversions/document_converter.json';
import archiveData     from '@/conversions/archive_converter.json';
import cadData         from '@/conversions/cad_converter.json';
import fontData        from '@/conversions/font_converter.json';
import vectorData      from '@/conversions/vector_converter.json';
import ebookData       from '@/conversions/ebook_converter.json';
import presentData     from '@/conversions/presentation_converter.json';
import spreadsheetData from '@/conversions/spreadsheet_converter.json';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConversionPair {
  operation: string;   // e.g. "JPG to PNG"
  sourceFormat: string;
  targetFormat: string;
}

export interface FormatEntry {
  name: string;           // e.g. "JPG"
  description: string;
  conversions: ConversionPair[];
}

export interface CategoryData {
  id: string;
  title: string;
  formats: FormatEntry[];
}

// ─── Parse helpers ────────────────────────────────────────────────────────────

type RawJson = Record<string, Record<string, { description: string; conversions: { operation: string; progress: string }[] }>>;

function parseCategory(id: string, title: string, raw: RawJson): CategoryData {
  const topKey = Object.keys(raw)[0]!;
  const byFormat = raw[topKey]!;

  const formats: FormatEntry[] = Object.entries(byFormat).map(([key, val]) => {
    const name = key.replace(/ Converter$/, '');
    const conversions: ConversionPair[] = val.conversions.map((c) => {
      const parts = c.operation.split(' to ');
      return {
        operation: c.operation,
        sourceFormat: parts[0]?.trim() ?? '',
        targetFormat: parts[1]?.trim() ?? '',
      };
    });
    return { name, description: val.description, conversions };
  });

  return { id, title, formats };
}

// ─── Category map ─────────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, () => CategoryData> = {
  images:        () => parseCategory('images',        'Image Converter',        imageData as RawJson),
  video:         () => parseCategory('video',         'Video Converter',        videoData as RawJson),
  audio:         () => parseCategory('audio',         'Audio Converter',        audioData as RawJson),
  documents:     () => parseCategory('documents',     'Document Converter',     documentData as RawJson),
  archives:      () => parseCategory('archives',      'Archive Converter',      archiveData as RawJson),
  cad:           () => parseCategory('cad',           'CAD Converter',          cadData as RawJson),
  fonts:         () => parseCategory('fonts',         'Font Converter',         fontData as RawJson),
  vector:        () => parseCategory('vector',        'Vector Converter',       vectorData as RawJson),
  ebooks:        () => parseCategory('ebooks',        'Ebook Converter',        ebookData as RawJson),
  presentations: () => parseCategory('presentations', 'Presentation Converter', presentData as RawJson),
  spreadsheets:  () => parseCategory('spreadsheets',  'Spreadsheet Converter',  spreadsheetData as RawJson),
};

export function getCategoryData(id: string): CategoryData | null {
  const loader = CATEGORY_MAP[id];
  return loader ? loader() : null;
}

export function getAllCategoryIds(): string[] {
  return Object.keys(CATEGORY_MAP);
}

/** Returns all target formats a given source format can convert to in a category. */
export function getTargetsForFormat(category: CategoryData, sourceFormat: string): string[] {
  const entry = category.formats.find(
    (f) => f.name.toLowerCase() === sourceFormat.toLowerCase(),
  );
  if (!entry) return [];
  return [...new Set(entry.conversions.map((c) => c.targetFormat))];
}
