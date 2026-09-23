import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useObjects } from '../context/ObjectsContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIAS, ETIQUETAS, TIPOS_OBJETO } from '../data/constants'

function UploadObject() {
  const { addObject } = useObjects()
  const { usuarioActual } = useAuth()
  const navigate = useNavigate()

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [preview, setPreview] = useState(null)
  const [categoria, setCategoria] = useState('')
  const [etiqueta, setEtiqueta] = useState('')
  const [tipo, setTipo] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [error, setError] = useState('')

  // Si nadie ha iniciado sesión, no se puede publicar: se pide iniciar sesión primero.
  if (!usuarioActual) {
    return (
      <section id="body">
        <p className="empty-state">
          Necesitas iniciar sesión para publicar un objeto.{' '}
          <Link to="/login">Inicia sesión</Link> o{' '}
          <Link to="/registro">crea una cuenta</Link>.
        </p>
      </section>
    )
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) {
      setPreview(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!titulo.trim() || !descripcion.trim() || !preview) {
      setError('Completa el título, la descripción y sube una foto.')
      return
    }

    if (!categoria) {
      setError('Selecciona una categoría.')
      return
    }

    if (!tipo) {
      setError('Indica si el objeto está perdido o fue encontrado.')
      return
    }

    if (!ubicacion.trim()) {
      setError('Indica dónde se perdió o encontró el objeto.')
      return
    }

    setError('')
    addObject({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      url: preview,
      categoria,
      etiqueta: etiqueta || null,
      tipo,
      ubicacion: ubicacion.trim(),
      usuarioId: usuarioActual.id,
    })
    navigate('/')
  }

  return (
    <section id="body">
      <form className="upload-form" onSubmit={handleSubmit} noValidate>
        <h2>Publicar objeto</h2>

        <label htmlFor="tipo">¿El objeto se perdió o lo encontraste?</label>
        <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecciona una opción...</option>
          {TIPOS_OBJETO.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.etiqueta}
            </option>
          ))}
        </select>

        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Termo negro"
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          placeholder="Da detalles: marca, color, señas particulares..."
        />

        <label htmlFor="ubicacion">Ubicación</label>
        <input
          id="ubicacion"
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Ej. Cafetería central, edificio B..."
        />

        <label htmlFor="foto">Foto</label>
        <input
          id="foto"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview && (
          <img src={preview} alt="Vista previa" className="upload-preview" />
        )}

        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Selecciona una categoría...</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label htmlFor="etiqueta">Etiqueta (opcional)</label>
        <select
          id="etiqueta"
          value={etiqueta}
          onChange={(e) => setEtiqueta(e.target.value)}
        >
          <option value="">Sin etiqueta</option>
          {ETIQUETAS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <p className="form-hint">
          Tu contacto ({usuarioActual.correo} · {usuarioActual.telefono}) se
          mostrará en la publicación para que puedan comunicarse contigo.
        </p>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="link submit-button">
          Publicar
        </button>
      </form>
    </section>
  )
}

export default UploadObject
