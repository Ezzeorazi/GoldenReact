
import React from 'react'
import {Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Inicio } from '../Inicio'
import { Conocenos } from '../Conocenos'
import { Beneficios } from '../Beneficios'
import { InfoNutricional } from '../InfoNutricional'
import { HeaderNav } from '../layout/HeaderNav'
import { Footer } from '../layout/Footer'
import ScrollToTop from '../ScrollToTop'

export const RouterPrincipal = () => {
  return (
 <BrowserRouter>
 <ScrollToTop/>
 <HeaderNav/>

 <section className='contenido-principal'>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/infoNutricional" element={<InfoNutricional />} />
        {/* Redireccionar a Inicio si la ruta no existe */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      </section>

      <Footer/>
</BrowserRouter>

   
  )
}
