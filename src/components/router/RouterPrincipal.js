
import React from 'react'
import {Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Inicio } from '../Inicio'
import { Conocenos } from '../Conocenos'
import { Beneficios } from '../Beneficios'
import { InfoNutricional } from '../InfoNutricional'
import { HeaderNav } from '../layout/HeaderNav'
import { Footer } from '../layout/Footer'

export const RouterPrincipal = () => {
  return (
 <BrowserRouter>
 <HeaderNav/>

 <section className='contenido-principal'>
      <Routes>
        <Route path="/" element={<Inicio />} />
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
