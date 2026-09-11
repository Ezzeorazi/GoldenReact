import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import ScrollToTop from '../ScrollToTop'
import { HeaderNav } from '../layout/HeaderNav'
import { Footer } from '../layout/Footer'
import { Inicio } from '../Inicio'
import { Conocenos } from '../Conocenos'
import { Productos } from '../Productos'
import { Beneficios } from '../Beneficios'
import { InfoNutricional } from '../InfoNutricional'
import { NotFound } from '../NotFound'
import { Trivia } from '../Trivia'
import { AuthProvider } from '../../lib/auth'
import { ProtectedRoute } from '../admin/ProtectedRoute'
import { AdminLayout } from '../admin/AdminLayout'
import { Login } from '../admin/Login'
import { Dashboard } from '../admin/Dashboard'
import { InicioAdmin } from '../admin/InicioAdmin'
import { ProductosAdmin } from '../admin/ProductosAdmin'
import { ConocenosAdmin } from '../admin/ConocenosAdmin'
import { BeneficiosAdmin } from '../admin/BeneficiosAdmin'
import { DestacadoAdmin } from '../admin/DestacadoAdmin'
import { TriviaAdmin } from '../admin/TriviaAdmin'
import { TriviaParticipantes } from '../admin/TriviaParticipantes'

/** Layout del sitio público: header + contenido + footer. */
function PublicLayout() {
  return (
    <>
      <HeaderNav />
      <main className="contenido-principal">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export function RouterPrincipal() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Panel de administración ── */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index            element={<Dashboard />} />
              <Route path="inicio"     element={<InicioAdmin />} />
              <Route path="productos"  element={<ProductosAdmin />} />
              <Route path="conocenos"  element={<ConocenosAdmin />} />
              <Route path="beneficios" element={<BeneficiosAdmin />} />
              <Route path="destacado"  element={<DestacadoAdmin />} />
              <Route path="trivia"     element={<TriviaAdmin />} />
              <Route path="participantes" element={<TriviaParticipantes />} />
            </Route>
          </Route>

          {/* ── Sitio público ── */}
          {/* Trivia de eventos: pantalla completa, sin header ni footer, para
              que en la tablet del stand nadie navegue fuera del juego. */}
          <Route path="/trivia" element={<Trivia />} />

          <Route element={<PublicLayout />}>
            <Route path="/"                element={<Inicio />} />
            <Route path="/inicio"          element={<Navigate to="/" replace />} />
            <Route path="/conocenos"       element={<Conocenos />} />
            <Route path="/productos"       element={<Productos />} />
            <Route path="/beneficios"      element={<Beneficios />} />
            <Route path="/infoNutricional" element={<InfoNutricional />} />
            <Route path="*"                element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
