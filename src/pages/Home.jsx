import { useMemo, useState } from 'react'
import { useObjects } from '../context/ObjectsContext'
import { CATEGORIAS, ETIQUETAS, TIPOS_OBJETO } from '../data/constants'
import ObjectCard from '../components/ObjectCard'

function Home() {
  const { objetos } = useObjects()
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('Todos')
  const [categoria, setCategoria] = useState('Todas')
  const [etiqueta, setEtiqueta] = useState('Todas')
  const [mostrarResueltos, setMostrarResueltos] = useState(false)

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    return objetos.filter((o) => {
      const pasaTexto =
        !texto ||
        o.titulo.toLowerCase().includes(texto) ||
        o.descripcion.toLowerCase().includes(texto)
      const pasaTipo = tipo === 'Todos' || o.tipo === tipo
      const pasaCategoria = categoria === 'Todas' || o.categoria === categoria
      const pasaEtiqueta = etiqueta === 'Todas' || o.etiqueta === etiqueta
      const pasaResuelto = mostrarResueltos || o.estado !== 'resuelto'
      return pasaTexto && pasaTipo && pasaCategoria && pasaEtiqueta && pasaResuelto
    })
  }, [objetos, busqueda, tipo, categoria, etiqueta, mostrarResueltos])

  const hayFiltrosActivos =
    busqueda || tipo !== 'Todos' || categoria !== 'Todas' || etiqueta !== 'Todas'

  function limpiarFiltros() {
    setBusqueda('')
    setTipo('Todos')
    setCategoria('Todas')
    setEtiqueta('Todas')
  }

  return (
    <section id="body">
      <div className="objects">
        <p>
          {filtrados.length} objeto{filtrados.length === 1 ? '' : 's'} publicado
          {filtrados.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="filters">
        <div className="filter-group filter-search">
          <label htmlFor="busqueda">Buscar</label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Título o descripción..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-tipo">Tipo</label>
          <select
            id="filtro-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {TIPOS_OBJETO.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-categoria">Categoría</label>
          <select
            id="filtro-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-etiqueta">Etiqueta</label>
          <select
            id="filtro-etiqueta"
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {ETIQUETAS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={mostrarResueltos}
            onChange={(e) => setMostrarResueltos(e.target.checked)}
          />
          Mostrar resueltos
        </label>

        {hayFiltrosActivos && (
          <button type="button" className="link filter-clear" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
      </div>

      {objetos.length === 0 ? (
        <p className="empty-state">Todavía no hay objetos publicados.</p>
      ) : filtrados.length === 0 ? (
        <p className="empty-state">No hay objetos que coincidan con ese filtro.</p>
      ) : (
        <section className="grid-objects">
          {filtrados.map((objeto) => (
            <ObjectCard key={objeto.id} objeto={objeto} />
          ))}
        </section>
      )}
    </section>
  )
}

export default Home
