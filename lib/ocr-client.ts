import { createWorker, type Worker } from 'tesseract.js';

const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';
const OCR_SPACE_KEY = 'helloworld';

async function ocrSpace(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file, file.name);
  fd.append('language', 'por');
  fd.append('isOverlayRequired', 'false');
  fd.append('OCREngine', '2');
  fd.append('scale', 'true');
  fd.append('detectOrientation', 'true');
  if (file.type === 'application/pdf') fd.append('filetype', 'PDF');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch(OCR_SPACE_URL, {
      method: 'POST',
      headers: { apikey: OCR_SPACE_KEY },
      body: fd,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`OCR.space HTTP ${res.status}`);
    const json = await res.json();
    if (json?.IsErroredOnProcessing) {
      const msg = Array.isArray(json.ErrorMessage)
        ? json.ErrorMessage.join('; ')
        : String(json.ErrorMessage || 'erro');
      throw new Error(`OCR.space: ${msg}`);
    }
    const parts: string[] = (json?.ParsedResults || []).map((r: { ParsedText?: string }) => r?.ParsedText || '');
    return parts.join('\n').trim();
  } finally {
    clearTimeout(timer);
  }
}

let _worker: Worker | null = null;
async function getWorker(): Promise<Worker> {
  if (_worker) return _worker;
  _worker = await createWorker('por');
  return _worker;
}

async function tesseract(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    throw new Error('Tesseract não suporta PDF no navegador. Envie uma imagem (JPG/PNG).');
  }
  const worker = await getWorker();
  const { data } = await worker.recognize(file);
  return (data?.text || '').trim();
}

export async function ocrFile(file: File): Promise<{ text: string; engine: 'ocrspace' | 'tesseract' }> {
  const skipSpace = file.type === 'application/pdf' && file.size > 1024 * 1024;
  if (!skipSpace) {
    try {
      const text = await ocrSpace(file);
      if (text && text.length > 5) return { text, engine: 'ocrspace' };
    } catch (e) {
      console.warn('OCR.space falhou, usando Tesseract:', e);
    }
  }
  const text = await tesseract(file);
  return { text, engine: 'tesseract' };
}
