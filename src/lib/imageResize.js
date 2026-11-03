export const MAX_SOURCE_SIZE = 20 * 1024 * 1024;
const FULL_SIZE = 2000;
const THUMB_SIZE = 800;

export class ImageResizeError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function encode(bitmap, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);

  // Старый Safari не умеет кодировать WebP и молча отдаёт PNG — тогда JPEG.
  let blob = await canvasToBlob(canvas, "image/webp", 0.82);
  if (!blob || blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg", 0.85);
  }
  if (!blob) throw new ImageResizeError("encode");
  return { blob, width, height };
}

/**
 * Готовит фото к загрузке: поворот по EXIF, уменьшение, WebP.
 * Перекодирование заодно удаляет метаданные (в том числе геолокацию).
 */
export async function prepareImage(file) {
  if (file.size > MAX_SOURCE_SIZE) throw new ImageResizeError("tooBig");
  if (file.type && !file.type.startsWith("image/")) throw new ImageResizeError("notImage");

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Чаще всего это HEIC в браузере, который его не открывает.
    throw new ImageResizeError("unsupported");
  }

  try {
    const full = await encode(bitmap, FULL_SIZE);
    const thumb = await encode(bitmap, THUMB_SIZE);
    return { full, thumb };
  } finally {
    bitmap.close?.();
  }
}

export function extensionFor(blob) {
  return blob.type === "image/webp" ? "webp" : "jpg";
}
