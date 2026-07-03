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
            </Route>
          </Route>

          {/* ── Sitio público ── */}
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
