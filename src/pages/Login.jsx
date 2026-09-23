import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    try {
      iniciarSesion({ correo, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="body">
      <form className="upload-form" onSubmit={handleSubmit} noValidate>
        <h2>Iniciar sesión</h2>

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
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
          Entrar
        </button>

        <p className="form-footer-text">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
