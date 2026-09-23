import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'ubika_objetos_subidos'
const ObjectsContext = createContext(null)

function leerAlmacenados() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function ObjectsProvider({ children }) {
  const [subidos, setSubidos] = useState(leerAlmacenados)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subidos))
    } catch {
      // localStorage no disponible (modo privado, cuota llena, etc.)
    }
  }, [subidos])

  const objetos = subidos.map((o) => ({ ...o, subido: true }))

  function addObject({
    titulo,
    descripcion,
    url,
    categoria,
    etiqueta,
    tipo,
    ubicacion,
    usuarioId,
  }) {
    const nuevo = {
      id: Date.now(),
      titulo,
      descripcion,
      url,
      categoria,
      etiqueta: etiqueta || null,
      tipo, // 'perdido' | 'encontrado'
      ubicacion,
      estado: 'activo', // 'activo' | 'resuelto'
      usuarioId, // dueño de la publicación, para permisos de editar/borrar
      fechaPublicacion: Date.now(),
    }
    setSubidos((prev) => [nuevo, ...prev])
    return nuevo
  }

  function editObject(id, cambios) {
    setSubidos((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...cambios } : o))
    )
  }

  function toggleResolved(id) {
    setSubidos((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, estado: o.estado === 'resuelto' ? 'activo' : 'resuelto' }
          : o
      )
    )
  }

  function deleteObject(id) {
    setSubidos((prev) => prev.filter((o) => o.id !== id))
  }

  return (
    <ObjectsContext.Provider
      value={{ objetos, addObject, editObject, toggleResolved, deleteObject }}
    >
      {children}
    </ObjectsContext.Provider>
  )
}

export function useObjects() {
  const ctx = useContext(ObjectsContext)
  if (!ctx) {
    throw new Error('useObjects debe usarse dentro de <ObjectsProvider>')
  }
  return ctx
}
