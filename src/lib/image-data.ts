const MAX_EDGE = 1024;

/** Load any image URL (bundled asset included) and return a downscaled JPEG data URL. */
export async function toDataUrl(src: string, maxEdge = MAX_EDGE): Promise<string> {
  const image = await loadImage(src);
  return drawToDataUrl(image, maxEdge);
}

/** Read a user-selected file into a downscaled JPEG data URL. */
export async function fileToDataUrl(file: File, maxEdge = 1280): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });
  const image = await loadImage(raw);
  return drawToDataUrl(image, maxEdge);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Görsel yüklenemedi"));
    image.src = src;
  });
}

function drawToDataUrl(image: HTMLImageElement, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Görsel işlenemedi");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}
