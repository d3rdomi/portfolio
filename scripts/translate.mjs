#!/usr/bin/env node
/**
 * translate.mjs
 * Befüllt leere `en:`-Felder in .mdoc-Dateien automatisch per DeepL API.
 *
 * Nutzung:
 *   npm run translate                          – alle Dateien
 *   npm run translate -- datei.mdoc           – einzelne Datei
 *   npm run translate -- --dry-run            – Vorschau ohne Schreiben
 *
 * Voraussetzung: .env-Datei mit DEEPL_API_KEY (siehe .env.example)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

// ─── .env laden (kein extra Paket nötig) ─────────────────────────────────────
// Sucht .env im selben Ordner wie dieses Script (scripts/.env)
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
try {
  const env = await fs.readFile(path.join(scriptDir, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const match = line.match(/^([^#\s][^=]*)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
} catch { /* .env ist optional – Key kann auch direkt als Env-Var gesetzt sein */ }

const API_KEY = process.env.DEEPL_API_KEY;
if (!API_KEY) {
  console.error('❌  DEEPL_API_KEY fehlt. Lege eine .env-Datei an (siehe .env.example).');
  process.exit(1);
}

// CLI-Flags
const DRY_RUN = process.argv.includes('--dry-run');
const CLI_FILES = process.argv.slice(2).filter((a) => !a.startsWith('--'));

// ─── DeepL API ────────────────────────────────────────────────────────────────
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate';

async function translateBatch(texts) {
  if (texts.length === 0) return [];

  const body = new URLSearchParams();
  body.append('source_lang', 'DE');
  body.append('target_lang', 'EN-GB');
  for (const t of texts) body.append('text', t);

  const res = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${API_KEY}` },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL API Fehler ${res.status}: ${err}`);
  }
  const json = await res.json();
  return json.translations.map((t) => t.text);
}

// ─── Frontmatter Walk ─────────────────────────────────────────────────────────
// Findet rekursiv alle tText-Felder ({ de, en }) wo `de` gesetzt und `en` leer ist.
// Gibt ein Array von { path: string[], text: string } zurück.
function findTranslatableFields(obj, currentPath = []) {
  const results = [];

  if (Array.isArray(obj)) {
    obj.forEach((item, i) =>
      results.push(...findTranslatableFields(item, [...currentPath, i]))
    );
    return results;
  }

  if (!obj || typeof obj !== 'object') return results;

  // Ist dieses Objekt ein tText-Feld? → { de: '<text>', en: '' | undefined }
  const hasDe = typeof obj.de === 'string' && obj.de.trim() !== '';
  const enEmpty = !obj.en || obj.en.trim() === '';
  if (hasDe && enEmpty) {
    results.push({ path: currentPath, text: obj.de });
    return results; // Nicht tiefer in tText-Objekte rekursieren
  }

  // Sonst: rekursiv in alle Schlüssel
  for (const [key, value] of Object.entries(obj)) {
    results.push(...findTranslatableFields(value, [...currentPath, key]));
  }
  return results;
}

// Schreibt eine Übersetzung tief in das Daten-Objekt zurück (setzt .en am Ziel-Objekt).
function applyTranslation(obj, pathArr, translation) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    cur = cur[pathArr[i]];
  }
  // cur ist jetzt das tText-Objekt { de, en } – en wird gesetzt
  cur[pathArr.at(-1)].en = translation;
}

// ─── Einzelne Datei verarbeiten ───────────────────────────────────────────────
async function processFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = matter(raw);

  // Zielfeld für den Body-Text automatisch erkennen:
  // about-me nutzt `textEn`, alle anderen Seiten `contentEn`
  const bodyField = 'textEn' in parsed.data ? 'textEn' : 'contentEn';

  // Alle leeren EN-Felder in der Frontmatter finden
  const translatables = findTranslatableFields(parsed.data);

  // Body-Text (deutscher Markdoc-Inhalt) → bodyField, falls noch leer
  const bodyText = parsed.content.trim();
  const needsBody =
    bodyText && (!parsed.data[bodyField] || parsed.data[bodyField].trim() === '');
  if (needsBody) {
    translatables.push({ path: ['__body__'], text: bodyText });
  }

  if (translatables.length === 0) {
    console.log(`  ⏭  ${path.basename(filePath)} – alles bereits übersetzt`);
    return;
  }

  console.log(`  🔄  ${path.basename(filePath)} – ${translatables.length} Feld(er) zu übersetzen`);

  if (DRY_RUN) {
    for (const { path: p, text } of translatables) {
      const label = p[0] === '__body__' ? `body → ${bodyField}` : p.join('.');
      console.log(`      [${label}] "${text.slice(0, 70).replace(/\n/g, ' ')}…"`);
    }
    return;
  }

  // Alle Texte in einem Batch an DeepL schicken (spart API-Calls)
  const translations = await translateBatch(translatables.map((t) => t.text));

  // Übersetzungen zurückschreiben
  for (let i = 0; i < translatables.length; i++) {
    const { path: p } = translatables[i];
    if (p[0] === '__body__') {
      parsed.data[bodyField] = translations[i];
    } else {
      applyTranslation(parsed.data, p, translations[i]);
    }
  }

  // Datei mit aktualisierten Daten zurückschreiben
  const output = matter.stringify(parsed.content, parsed.data);
  await fs.writeFile(filePath, output, 'utf8');
  console.log(`  ✅  ${path.basename(filePath)} gespeichert`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const label = DRY_RUN ? '🔍  Dry-run – keine Dateien werden verändert' : '🚀  Starte Übersetzung…';
console.log(`\n${label}\n`);

let files;
if (CLI_FILES.length > 0) {
  // Einzelne Dateien aus CLI-Argumenten
  files = CLI_FILES;
} else {
  // Standard: alle Content-Dateien in Design, Konzepte, Fotografie & About
  const dirs = [
    { path: 'src/content/design', ext: '.mdoc' },
    { path: 'src/content/concepts', ext: '.mdoc' },
    { path: 'src/content/photography', ext: '.mdoc' },
    { path: 'src/content/about-me', ext: '.mdoc' },
  ];
  files = [];
  for (const { path: dir, ext } of dirs) {
    const entries = await fs.readdir(dir);
    for (const entry of entries) {
      if (entry.endsWith(ext)) files.push(path.join(dir, entry));
    }
  }
}

for (const file of files) {
  await processFile(file);
}

console.log('\n✓  Fertig.\n');
