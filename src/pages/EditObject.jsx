import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useObjects } from '../context/ObjectsContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIAS, ETIQUETAS, TIPOS_OBJETO } from '../data/constants'

function EditObject() {
  const { id } = useParams()
  const { objetos, editObject } = useObjects()
  const { usuarioActual } = useAuth()
  const navigate = useNavigate()

  const objeto = objetos.find((o) => String(o.id) === id)

  const [titulo, setTitulo] = useState(objeto?.titulo || '')
  const [descripcion, setDescripcion] = useState(objeto?.descripcion || '')
  const [categoria, setCategoria] = useState(objeto?.categoria || '')
  const [etiqueta, setEtiqueta] = useState(objeto?.etiqueta || '')
  const [tipo, setTipo] = useState(objeto?.tipo || '')
  const [ubicacion, setUbicacion] = useState(objeto?.ubicacion || '')
  const [error, setError] = useState('')

  if (!objeto) {
    return (
      <section id="body">
        <p className="empty-state">No encontramos ese objeto.</p>
      </section>
    )
  }

  // Solo el dueño de la publicación puede editarla.
  if (!usuarioActual || usuarioActual.id !== objeto.usuarioId) {
    return (
      <section id="body">
        <p className="empty-state">No tienes permiso para editar este objeto.</p>
      </section>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!titulo.trim() || !descripcion.trim() || !categoria || !tipo || !ubicacion.trim()) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    editObject(objeto.id, {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoria,
      etiqueta: etiqueta || null,
      tipo,
      ubicacion: ubicacion.trim(),
    })
    navigate(`/objeto/${objeto.id}`)
  }

  return (
    <section id="body">
      <form className="upload-form" onSubmit={handleSubmit} noValidate>
        <h2>Editar objeto</h2>

        <label htmlFor="tipo">¿El objeto se perdió o lo encontraste?</label>
        <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
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
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
        />

        <label htmlFor="ubicacion">Ubicación</label>
        <input
          id="ubicacion"
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        />

        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label htmlFor="etiqueta">Etiqueta (opcional)</label>
        <select
          id="etiqueta"
          value={etiqueta || ''}
          onChange={(e) => setEtiqueta(e.target.value)}
        >
          <option value="">Sin etiqueta</option>
          {ETIQUETAS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        {error && <p className="form-error">{error}</p>}

        <div className="edit-actions">
          <button type="submit" className="link submit-button">
            Guardar cambios
          </button>
          <Link to={`/objeto/${objeto.id}`} className="link link-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}

export default EditObject
