import { Link, useNavigate, useParams } from 'react-router-dom'
import { useObjects } from '../context/ObjectsContext'
import { useAuth } from '../context/AuthContext'

function formatearFecha(timestamp) {
  if (!timestamp) return ''
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function ObjectDetail() {
  const { id } = useParams()
  const { objetos, deleteObject, toggleResolved } = useObjects()
  const { usuarioActual, buscarUsuario } = useAuth()
  const navigate = useNavigate()

  const objeto = objetos.find((o) => String(o.id) === id)

  if (!objeto) {
    return (
      <section id="body">
        <Link to="/" className="link back-link">
          ← Volver
        </Link>
        <p className="empty-state">No encontramos ese objeto.</p>
      </section>
    )
  }

  const publicador = buscarUsuario(objeto.usuarioId)
  const esDueño = usuarioActual && usuarioActual.id === objeto.usuarioId

  function handleDelete() {
    if (confirm(`¿Eliminar "${objeto.titulo}"?`)) {
      deleteObject(objeto.id)
      navigate('/')
    }
  }

  return (
    <section id="body">
      <Link to="/" className="link back-link">
        ← Volver
      </Link>

      <article className={`object-detail ${objeto.estado === 'resuelto' ? 'is-resolved' : ''}`}>
        <img src={objeto.url} alt={objeto.titulo} />
        <div className="object-detail-info">
          <div className="object-card-badges">
            <span className={`badge badge-tipo badge-tipo-${objeto.tipo}`}>
              {objeto.tipo === 'perdido' ? 'Perdido' : 'Encontrado'}
            </span>
            {objeto.categoria && (
              <span className="badge badge-categoria">{objeto.categoria}</span>
            )}
            {objeto.etiqueta && (
              <span className="badge badge-etiqueta">{objeto.etiqueta}</span>
            )}
            {objeto.estado === 'resuelto' && (
              <span className="badge badge-resuelto">Resuelto</span>
            )}
          </div>

          <h2>{objeto.titulo}</h2>
          <p>{objeto.descripcion}</p>

          {objeto.ubicacion && (
            <p className="object-detail-meta">📍 {objeto.ubicacion}</p>
          )}
          {objeto.fechaPublicacion && (
            <p className="object-detail-meta">
              🗓️ Publicado el {formatearFecha(objeto.fechaPublicacion)}
            </p>
          )}

          {publicador && (
            <div className="object-detail-contacto">
              <h3>Contacto</h3>
              <p>{publicador.nombre}</p>
              <p>{publicador.correo}</p>
              <p>{publicador.telefono}</p>
            </div>
          )}

          {esDueño && (
            <div className="object-detail-actions">
              <button
                type="button"
                className="link"
                onClick={() => toggleResolved(objeto.id)}
              >
                {objeto.estado === 'resuelto'
                  ? 'Marcar como activo'
                  : 'Marcar como resuelto'}
              </button>
              <Link to={`/editar/${objeto.id}`} className="link link-secondary">
                Editar
              </Link>
              <button
                type="button"
                className="link link-danger"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  )
}

export default ObjectDetail
