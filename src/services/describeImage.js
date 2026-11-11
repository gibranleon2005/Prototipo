// Reduce la foto antes de enviarla: acelera la petición y evita límites de tamaño.
async function resizeToDataUrl(file, max = 768) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.8)
}

// Devuelve { titulo, descripcion, categoria }
export async function describeImage(file, signal) {
  const image = await resizeToDataUrl(file)
  const res = await fetch('/api/describe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
    signal,
  })
  if (!res.ok) throw new Error('No se pudo analizar la imagen')
  return res.json()
}
