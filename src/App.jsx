import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ObjectDetail from './pages/ObjectDetail'
import UploadObject from './pages/UploadObject'
import EditObject from './pages/EditObject'
import Login from './pages/Login'
import Registro from './pages/Registro'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/objeto/:id" element={<ObjectDetail />} />
        <Route path="/subir" element={<UploadObject />} />
        <Route path="/editar/:id" element={<EditObject />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </>
  )
}

export default App
