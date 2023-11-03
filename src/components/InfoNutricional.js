import React from 'react'

export const InfoNutricional = () => {
  const divStyle = {
    border: '1px solid #A68B67'
  };

  const textStyle = {
    fontSize: '22px'
  }
  return (
    <div className='animate__animated animate__fadeIn'>
        <div className="main bg-black " >
      <div className="container ">
        <h2 className="semibold" >INFORMACIÓN NUTRICIONAL</h2>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-2 mt-2 bolsa d-flex align-items-center justify-content-center">
            <div className="bolsa">
              <img className="imagen" src="image/bolsa small.webp" alt="Bolsa-producto"/>
            </div>
          </div>
          <div className="col-md-8 mt-4 mb-3 text-custom" style={textStyle}>
            <p><strong>GOLDEN HORSES</strong> es un concentrado energético pelletizado, que en forma combinada entre almidón, fibra y contenido graso proveen de manera altamente eficiente la energía necesaria para cubr/ir los requerimientos nutricionales en caballos con altas exigencias físicas.</p>          
            <p><strong>Recomendación de uso:</strong> El consumo diario recomendado de Golden Horses está relacionado al peso del animal y a la intención de reemplazo de la avena en la ración. 
              <br/><br/>* Para un reemplazo total de la avena, 1kg por cada 100kg de peso vivo por día.
              <br/>* Para un reemplazo parcial de la avena, 0,5kg por cada 100kg de peso vivo por día.
              <br/>Recuerde efectuar variaciones en la alimentación de forma gradual y consultando a un profesional idóneo.</p>
          </div>
        </div>
      </div>
      </div>
        <div className="col-md-8 ms-3 mt-3">
          <h3 className="semibold ms-5">COMPOSICIÓN CENTESIMAL:</h3></div>         
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
        <ul className="row col-xl-12  mt-4 ms-0 text-custom-ficha ">

            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Tenor min Prot. br/uta:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>18%</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Tenor min Cont. Graso:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>4%</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Tenor max. Materia seca:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>75%</div>
            </li>
            <li className="row">
              <div className="col-sm-9 col-8 item" style={divStyle}>Tenor max Fibr/a Cruda:</div>
              <div className="col-sm-3 col-4 value text-center" style={divStyle}>7.45%</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Tenor máx Humedad:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>10%</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Valor Energético (Mcal/Kg):</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>2.871</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Tenor de Fósforo; min, máx:</div>
                <div className="col-sm-3 col-4 value text-center ppm" style={divStyle}>0.13-0.23%</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Magnesio:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>0.017%</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Zinc:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>30ppm</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Manganesa:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>20ppm</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Cobr/e:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>10ppm</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Selenio:</div>
                <div className="col-sm-3 col-4 value text-center ppm" style={divStyle}>0.065ppm</div>
            </li>
            <li className="row">
                <div className="col-sm-9 col-8 item" style={divStyle}>Bio-Mos AR Alltech:</div>
                <div className="col-sm-3 col-4 value text-center" style={divStyle}>0.1%</div>
            </li>
            <li className="row mb-2">
                <div className="col-sm-9 col-8 item" style={divStyle}>Tenor de Calcio; min, máx:</div>
                <div className="col-sm-3 col-4 value text-center ppm" style={divStyle}>0.1-0.24%</div>
            </li>
            </ul>
          </div>
        </div>
      </div>
   
   
    
    </div>
  )
}
