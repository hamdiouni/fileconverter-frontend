/**
 * Client-side ZIP file generator using standard PKZip (Store method / CRC-32).
 * Works 100% in browser memory without external packages or server roundtrips.
 */

// Precomputed CRC-32 lookup table
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

export function computeCRC32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipEntry {
  name: string;
  data: Uint8Array;
  date?: Date;
}

/**
 * Creates a standard, fully valid .zip binary Blob containing the provided files.
 */
export async function createZipBlob(entries: ZipEntry[]): Promise<Blob> {
  const parts: Uint8Array[] = [];
  const centralDirectoryHeaders: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = new TextEncoder().encode(entry.name);
    const data = entry.data;
    const crc = computeCRC32(data);
    const date = entry.date || new Date();

    // MS-DOS time and date
    const time =
      ((date.getHours() & 0x1f) << 11) |
      ((date.getMinutes() & 0x3f) << 5) |
      ((Math.floor(date.getSeconds() / 2)) & 0x1f);
    const dosDate =
      (((date.getFullYear() - 1980) & 0x7f) << 9) |
      (((date.getMonth() + 1) & 0x0f) << 5) |
      (date.getDate() & 0x1f);

    // ── Local file header (30 bytes + name length) ──
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature (PK\x03\x04)
    lv.setUint16(4, 20, true);         // Version needed to extract (2.0)
    lv.setUint16(6, 0x0800, true);     // General purpose bit flag (UTF-8 filename)
    lv.setUint16(8, 0, true);          // Compression method (0 = store)
    lv.setUint16(10, time, true);      // File last mod time
    lv.setUint16(12, dosDate, true);   // File last mod date
    lv.setUint32(14, crc, true);       // CRC-32
    lv.setUint32(18, data.length, true); // Compressed size
    lv.setUint32(22, data.length, true); // Uncompressed size
    lv.setUint16(26, nameBytes.length, true); // File name length
    lv.setUint16(28, 0, true);         // Extra field length
    localHeader.set(nameBytes, 30);

    parts.push(localHeader);
    parts.push(data);

    // ── Central directory file header (46 bytes + name length) ──
    const cdHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cdHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central directory header signature (PK\x01\x02)
    cv.setUint16(4, 20, true);         // Version made by
    cv.setUint16(6, 20, true);         // Version needed to extract
    cv.setUint16(8, 0x0800, true);     // General purpose bit flag (UTF-8)
    cv.setUint16(10, 0, true);         // Compression method (0 = store)
    cv.setUint16(12, time, true);      // Last mod time
    cv.setUint16(14, dosDate, true);   // Last mod date
    cv.setUint32(16, crc, true);       // CRC-32
    cv.setUint32(20, data.length, true); // Compressed size
    cv.setUint32(24, data.length, true); // Uncompressed size
    cv.setUint16(28, nameBytes.length, true); // File name length
    cv.setUint16(30, 0, true);         // Extra field length
    cv.setUint16(32, 0, true);         // File comment length
    cv.setUint16(34, 0, true);         // Disk number start
    cv.setUint16(36, 0, true);         // Internal file attributes
    cv.setUint32(38, 0, true);         // External file attributes
    cv.setUint32(42, offset, true);    // Relative offset of local header
    cdHeader.set(nameBytes, 46);

    centralDirectoryHeaders.push(cdHeader);
    offset += localHeader.length + data.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cdh of centralDirectoryHeaders) {
    parts.push(cdh);
    cdSize += cdh.length;
  }

  // ── End of central directory record (22 bytes) ──
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // End of central directory signature (PK\x05\x06)
  ev.setUint16(4, 0, true);          // Number of this disk
  ev.setUint16(6, 0, true);          // Disk where central directory starts
  ev.setUint16(8, entries.length, true);  // Number of central directory records on this disk
  ev.setUint16(10, entries.length, true); // Total number of central directory records
  ev.setUint32(12, cdSize, true);    // Size of central directory
  ev.setUint32(16, cdOffset, true);  // Offset of start of central directory
  ev.setUint16(20, 0, true);         // Comment length

  parts.push(eocd);

  return new Blob(parts, { type: 'application/zip' });
}
