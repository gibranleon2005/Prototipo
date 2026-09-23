import { Link } from 'react-router-dom'

function ObjectCard({ objeto }) {
  const esResuelto = objeto.estado === 'resuelto'

  return (
    <Link
      to={`/objeto/${objeto.id}`}
      className={`object-card ${esResuelto ? 'is-resolved' : ''}`}
    >
      <img src={objeto.url} alt={objeto.titulo} />
      <div className="object-card-info">
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
          {esResuelto && <span className="badge badge-resuelto">Resuelto</span>}
        </div>
        <h3>{objeto.titulo}</h3>
        <p>{objeto.descripcion}</p>
        {objeto.ubicacion && (
          <p className="object-card-ubicacion">📍 {objeto.ubicacion}</p>
        )}
      </div>
    </Link>
  )
}

export default ObjectCard
