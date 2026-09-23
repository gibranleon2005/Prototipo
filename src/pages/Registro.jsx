import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!nombre.trim() || !correo.trim() || !telefono.trim() || !password) {
      setError('Completa todos los campos.')
      return
    }

    try {
      registrar({ nombre, correo, telefono, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="body">
      <form className="upload-form" onSubmit={handleSubmit} noValidate>
        <h2>Crear cuenta</h2>

        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Ana Torres"
        />

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
        />

        <label htmlFor="telefono">Teléfono de contacto</label>
        <input
          id="telefono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej. 646 123 4567"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="link submit-button">
          Registrarme
        </button>

        <p className="form-footer-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  )
}

export default Registro
