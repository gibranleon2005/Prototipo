import { createContext, useContext, useEffect, useState } from 'react'

// Esto es solo para la fase local del proyecto. Guarda contraseñas
// en texto plano en localStorage. Cuando se
// conecte una base de datos real, el backend debería encriptar las contraseñas
const USUARIOS_KEY = 'ubika_usuarios'
const SESION_KEY = 'ubika_sesion_id'

const AuthContext = createContext(null)

function leerUsuarios() {
  try {
    const raw = localStorage.getItem(USUARIOS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function leerSesionId() {
  try {
    return localStorage.getItem(SESION_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(leerUsuarios)
  const [sesionId, setSesionId] = useState(leerSesionId)

  useEffect(() => {
    try {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios))
    } catch {
      // localStorage no disponible
    }
  }, [usuarios])

  useEffect(() => {
    try {
      if (sesionId) {
        localStorage.setItem(SESION_KEY, sesionId)
      } else {
        localStorage.removeItem(SESION_KEY)
      }
    } catch {
      // localStorage no disponible
    }
  }, [sesionId])

  const usuarioActual = usuarios.find((u) => u.id === sesionId) || null

  function registrar({ nombre, correo, telefono, password }) {
    const correoNormalizado = correo.trim().toLowerCase()

    if (usuarios.some((u) => u.correo === correoNormalizado)) {
      throw new Error('Ya existe una cuenta con ese correo.')
    }

    const nuevoUsuario = {
      id: `u_${Date.now()}`,
      nombre: nombre.trim(),
      correo: correoNormalizado,
      telefono: telefono.trim(),
      password, // ver nota de seguridad arriba
    }

    setUsuarios((prev) => [...prev, nuevoUsuario])
    setSesionId(nuevoUsuario.id)
    return nuevoUsuario
  }

  function iniciarSesion({ correo, password }) {
    const correoNormalizado = correo.trim().toLowerCase()
    const usuario = usuarios.find((u) => u.correo === correoNormalizado)

    if (!usuario || usuario.password !== password) {
      throw new Error('Correo o contraseña incorrectos.')
    }

    setSesionId(usuario.id)
    return usuario
  }

  function cerrarSesion() {
    setSesionId(null)
  }

  function buscarUsuario(id) {
    return usuarios.find((u) => u.id === id) || null
  }

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        registrar,
        iniciarSesion,
        cerrarSesion,
        buscarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return ctx
}
