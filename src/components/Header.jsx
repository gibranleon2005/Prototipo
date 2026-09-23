import { NavLink, useNavigate } from 'react-router-dom'
import pageLogo from '../assets/logo.svg'
import { useAuth } from '../context/AuthContext'

function claseLink({ isActive }) {
  return `link${isActive ? ' active' : ''}`
}

function Header() {
  const { usuarioActual, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <section id="header">
      <section id="headerLeft">
        <NavLink to="/" end className={claseLink}>
          Inicio
        </NavLink>
        <NavLink to="/subir" className={claseLink}>
          Publicar objeto
        </NavLink>

        {usuarioActual ? (
          <>
            <span className="header-user">Hola, {usuarioActual.nombre.split(' ')[0]}</span>
            <button type="button" className="link" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={claseLink}>
              Iniciar sesión
            </NavLink>
            <NavLink to="/registro" className={claseLink}>
              Registrarse
            </NavLink>
          </>
        )}
      </section>

      {/*
      <section id="headerRight">
        <img src={pageLogo} id="pageLogo" alt="Logo de la pagina" />
      </section>
      */}
    </section>
  )
}

export default Header
