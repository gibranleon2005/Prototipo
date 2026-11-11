// Proxy mínimo hacia el modelo que corre en Colab.
import express from 'express'

const PORT = process.env.PORT || 3001
const COLAB_URL = process.env.COLAB_URL?.trim().replace(/\/+$/, '') // sin "/" final

const CATEGORIAS = ['Electrónicos', 'Ropa', 'Credenciales', 'Llaves', 'Útiles', 'Otros']

const PROMPT = `Eres un asistente de una página de objetos perdidos. Observa la foto y describe el objeto principal.
Responde ÚNICAMENTE con un JSON válido, sin texto extra, con esta forma:
{"titulo": "...", "descripcion": "...", "categoria": "..."}
- titulo: máximo 6 palabras, en español (ej. "Termo negro con tapa").
- descripcion: 1 a 3 frases en español con tipo de objeto, color, material, marca visible y señas particulares (rayones, stickers, estado). No inventes lo que no se vea.
- categoria: exactamente una de: ${CATEGORIAS.join(', ')}.`

const app = express()
app.use(express.json({ limit: '5mb' }))

// Prueba rápida: http://localhost:3001/api/health
app.get('/api/health', async (_req, res) => {
  if (!COLAB_URL) return res.status(500).json({ error: 'Falta COLAB_URL en el servidor.' })
  try {
    const r = await fetch(`${COLAB_URL}/health`, { signal: AbortSignal.timeout(10_000) })
    res.status(r.ok ? 200 : 502).json({ colab: r.status, body: await r.text() })
  } catch (err) {
    res.status(502).json({ error: String(err) })
  }
})

app.post('/api/describe', async (req, res) => {
  const { image } = req.body ?? {}
  if (!COLAB_URL) return res.status(500).json({ error: 'Falta COLAB_URL en el servidor.' })
  if (typeof image !== 'string' || !image.startsWith('data:image/') || !image.includes(',')) {
    return res.status(400).json({ error: 'Se esperaba una imagen en formato data URL.' })
  }

  try {
    const r = await fetch(`${COLAB_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, prompt: PROMPT }),
      signal: AbortSignal.timeout(120_000), // el modelo puede tardar
    })

    if (!r.ok) {
      console.error('Colab error', r.status, await r.text())
      return res.status(502).json({ error: 'El servicio de IA no respondió correctamente.' })
    }

    const { text: texto = '' } = await r.json()
    console.log('Respuesta del modelo:', texto)

    let parsed = {}
    const match = texto.match(/\{[\s\S]*\}/) // por si el modelo agrega texto alrededor
    if (match) {
      try {
        parsed = JSON.parse(match[0])
      } catch {
        console.warn('El modelo devolvió un JSON inválido')
      }
    }

    res.json({
      titulo: String(parsed.titulo ?? '').trim(),
      descripcion: String(parsed.descripcion ?? '').trim(),
      categoria: CATEGORIAS.includes(parsed.categoria) ? parsed.categoria : 'Otros',
    })
  } catch (err) {
    console.error(err)
    res.status(502).json({ error: 'No se pudo analizar la imagen.' })
  }
})

app.listen(PORT, () => console.log(`API de IA en http://localhost:${PORT}`))