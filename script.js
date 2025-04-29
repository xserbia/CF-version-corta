// --- Financial Evaluator Short - script.js ---
// ✅ Ocultar todas las secciones
function ocultarTodasLasSecciones() {
  document.querySelectorAll('.step').forEach(div => {
    div.classList.remove('active');
    div.style.display = "none";
  });
}

// ✅ Ir a una sección específica
function irASeccion(stepId) {
  ocultarTodasLasSecciones();

  const step = document.getElementById(stepId);
  if (step) {
    step.classList.add('active');
    step.style.display = "block";
  }

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const buttons = document.querySelectorAll('.nav-btn');
  const index = {
    stepIngresos: 0,
    stepGastos: 1,
    stepActivos: 2,
    stepPasivos: 3,
    stepSegurosHerencia: 4,
    stepRetiro: 5
  }[stepId];
  if (buttons[index]) buttons[index].classList.add('active');
  
  seccionActual = stepId;
}

// ✅ Variables de navegación
let seccionActual = 'stepIngresos';
const ordenSecciones = ['stepIngresos', 'stepGastos', 'stepActivos', 'stepPasivos', 'stepSegurosHerencia', 'stepRetiro'];

// ✅ Bloqueo de navegación
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const destino = this.getAttribute('onclick').match(/'(.*?)'/)[1];

    const pasoActualIndex = ordenSecciones.indexOf(seccionActual);
    const destinoIndex = ordenSecciones.indexOf(destino);

    if (destinoIndex > pasoActualIndex) {
      // Quiere ir hacia adelante: validar primero
      if (!validarCamposPasoActual()) {
        e.preventDefault();
      } else {
        seccionActual = destino;
      }
    } else {
      // Quiere ir hacia atrás o misma sección
      seccionActual = destino;
    }
  });
});

// ✅ Validar campos individuales
function validarCampo(input) {
  const label = input.previousElementSibling;
  if (input.value.trim() === '' || isNaN(input.value) || parseFloat(input.value) < 0) {
    input.style.border = '2px solid red';
    if (label) label.classList.add('error');
  } else {
    input.style.border = '2px solid green';
    if (label) label.classList.remove('error');
  }
}

// ✅ Validar todos los campos del paso actual
function validarCamposPasoActual() {
  const pasoActual = document.querySelector('.step.active');
  let camposValidos = true;

  if (pasoActual) {
    const inputs = pasoActual.querySelectorAll('input[required]:not([type="hidden"])');

    inputs.forEach(input => {
      validarCampo(input);
      if (input.style.borderColor === 'red') {
        camposValidos = false;
      }
    });
  }
  return camposValidos;
}

// ✅ Validar y avanzar al siguiente paso
function guardarDatosYAvanzar(siguientePasoId) {
  if (validarCamposPasoActual()) {
    if (siguientePasoId === 'mostrarResultados') {
      procesarResultados(); // 🚀 Mostrar resultados si corresponde
    } else {
      irASeccion(siguientePasoId);
    }
  }
}

// ✅ Retroceder libremente
function prevStep(prevPasoId) {
  irASeccion(prevPasoId);
}

// ✅ Configurar al cargar
window.onload = function() {
  ocultarTodasLasSecciones();
  const step = document.getElementById('stepIngresos');
  if (step) {
    step.classList.add('active');
    step.style.display = "block";
  }
  seccionActual = 'stepIngresos';
};

// ✅ Agregar asteriscos y validar mientras escribe
document.addEventListener('DOMContentLoaded', function() {
  const inputsRequeridos = document.querySelectorAll('input[required]');

  inputsRequeridos.forEach(input => {
    const label = input.previousElementSibling;
    if (label && label.tagName.toLowerCase() === 'label') {
      label.classList.add('required-label');
    }
    input.addEventListener('input', function() {
      validarCampo(input);
    });
  });
});

// ✅ Validar Seguros y Herencia antes de pasar
function guardarDatosSegurosHerencia() {
  const segurosSeleccionados = document.querySelectorAll('input[name^="seguro_"]:checked');
  const ningunSeguro = document.querySelector('input[name="ningun_seguro"]:checked');

  const documentosSeleccionados = document.querySelectorAll('input[name="trust"]:checked, input[name="will"]:checked, input[name="advance_medical_directive"]:checked, input[name="power_of_attorney"]:checked, input[name="beneficiary_designation"]:checked, input[name="property_deeds"]:checked');
  const ningunDocumento = document.querySelector('input[name="ningun_documento"]:checked');

  let error = false;

  if (segurosSeleccionados.length === 0 && !ningunSeguro) {
    error = true;
  }
  if (documentosSeleccionados.length === 0 && !ningunDocumento) {
    error = true;
  }

  const container = document.getElementById('stepSegurosHerencia');

  if (error) {
    container.classList.add('shake');
    container.querySelector('fieldset').style.border = '2px solid red';
    setTimeout(() => {
      container.classList.remove('shake');
    }, 400);
  } else {
    container.querySelector('fieldset').style.border = 'none';
    irASeccion('stepRetiro');
  }
}

let data = {};

// ✅ Captura todos los datos del formulario
function capturarDatos() {
  const form = document.getElementById("calculadoraFormulario");
  const datos = {};
  Array.from(form.elements).forEach(el => {
    if (el.name) {
      datos[el.name] = el.type === "checkbox" ? el.checked : parseFloat(el.value) || 0;
    }
  });
  return datos;
}

// ✅ Procesa y muestra los resultados
function procesarResultados(event) {
  event.preventDefault(); // 🔒 Evita recargar la página

  data = capturarDatos();
  mostrarResultados(); // 📊 Calcula e inyecta los resultados

  document.getElementById("formularioContainer").style.display = "none";
  document.getElementById("resultadosContainer").style.display = "block";

  mostrarResultado('resA'); // ✅ Asegura que #resA esté visible

  // Espera un momento a que el DOM actualice la visibilidad del canvas
  setTimeout(() => {
    mostrarGraficoGastos();  // ✅ Ahora sí, canvas ya visible
  }, 50);
}
function mostrarResultado(id) {
  document.querySelectorAll(".resultado-categoria").forEach(div => div.style.display = "none");
  document.getElementById(id).style.display = "block";

  // Cambiar estilo de navegación
  document.querySelectorAll('#navResultados .nav-btn').forEach(btn => btn.classList.remove('active'));
  const botones = document.querySelectorAll('#navResultados .nav-btn');
  const indices = { resA: 0, resB: 1, resC: 2, resD: 3, resE: 4, resF: 5, resG: 6, resH: 7 };
  if (botones[indices[id]]) botones[indices[id]].classList.add('active');
}

function mostrarResultados() {
  mostrarFlujo();
  mostrarDeuda();
  mostrarPatrimonio();
  mostrarSeguridad();
  mostrarRiesgo();
  mostrarPatrimonial();
  mostrarRetiro();
  mostrarEstres();
}

// --- Resultados por sección ---

//---SECCION A LIQUIDEZ---

  document.getElementById("resA").innerHTML = `
    <h3>🅰️ A. Flujo de efectivo y liquidez</h3>

    <p><strong>Ingreso anual:</strong> $${ingreso.toLocaleString()}</p>
    <p><strong>Impuestos:</strong> $${impuestos.toLocaleString()}</p>
    <p><strong>Seguros:</strong> $${seguros.toLocaleString()}</p>
    <p><strong>Gastos diarios:</strong> $${gastoDiario.toLocaleString()}</p>
    <p><strong>Pago de deuda:</strong> $${deuda.toLocaleString()}</p>
    <p><strong>Ahorro:</strong> $${ahorro.toLocaleString()}</p>
    <p><strong>Superávit:</strong> $${superavit.toLocaleString()} ${iconoSuperavit}</p>
    
    <hr>
    <p><strong>Tasa de ahorro:</strong> ${(tasaAhorro * 100).toFixed(1)}% ${iconoAhorro}</p>
    <p><strong>Reserva de emergencia:</strong> ${reservaEmergencia.toFixed(1)} meses ${iconoReserva}</p>
    <p><strong>Razón corriente:</strong> ${razonCorriente.toFixed(2)} ${iconoRazonCorriente}</p>
    <p><strong>Capacidad de acumulación:</strong> ${(capacidadAcumulacion * 100).toFixed(1)}% ${iconoCapacidad}</p>
  `;
function mostrarFlujo() {
  const ingreso = data.ingreso_bruto || 0;

  const ahorro = (data.aporte_personal_retiro || 0) +
                 (data.aporte_empleador_retiro || 0) +
                 (data.otros_ahorros || 0);

  const impuestos = data.impuestos_anuales || 0;
  const seguros = data.seguros_anuales || 0;
  const gastoDiario = data.gastos_diarios || 0;
  const deuda = data.pago_deudas || 0;

  const gastosTotales = impuestos + seguros + gastoDiario + deuda;
  const superavit = ingreso - (gastosTotales + ahorro);

  const tasaAhorro = ingreso > 0 ? ahorro / ingreso : 0;
  const capacidadAcumulacion = ingreso > 0 ? (ahorro + superavit) / ingreso : 0;
  const reservaEmergencia = gastoDiario > 0 ? (data.efectivo_similar || 0) / (gastoDiario / 12) : 0;
  const razonCorriente = deuda > 0 ? (data.efectivo_similar || 0) / deuda : 0;

  // Evaluaciones visuales
  const iconoAhorro = tasaAhorro >= 0.30 ? '✅' : tasaAhorro >= 0.15 ? '⚠️' : '🚨';
  const iconoSuperavit = superavit < 0 ? '🚨' : superavit / ingreso <= 0.15 ? '⚠️' : '✅';
  const iconoReserva = reservaEmergencia > 36 ? '🔁' : reservaEmergencia >= 12 ? '✅' : reservaEmergencia >= 6 ? '⚠️' : '🚨';
  const iconoRazonCorriente = razonCorriente > 1 ? '✅' : '🚨';
  const iconoCapacidad = capacidadAcumulacion > 0.5 ? '🔁' : capacidadAcumulacion >= 0.15 ? '✅' : capacidadAcumulacion >= 0 ? '⚠️' : '🚨';
  //
  function mostrarGraficoGastos() {
  const canvas = document.getElementById('graficoGastos');
  if (!canvas || canvas.offsetParent === null) return; // 🔒 Previene error si el canvas no está o está oculto

  const ingresoTotal = data.ingreso_bruto || 0;
  const impuestos = data.impuestos_anuales || 0;
  const seguros = data.seguros_anuales || 0;
  const gastosDiarios = data.gastos_diarios || 0;
  const pagoDeuda = data.pago_deudas || 0;
  const ahorro =
    (data.aporte_personal_retiro || 0) +
    (data.aporte_empleador_retiro || 0) +
    (data.otros_ahorros || 0);
  const sumaCategorias = impuestos + seguros + gastosDiarios + pagoDeuda + ahorro;
  const superavit = ingresoTotal - sumaCategorias;

  const ctx = canvas.getContext('2d');

  if (window.graficoGastosInstance) {
    window.graficoGastosInstance.destroy();
  }

  // Plugin de texto central
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width, height } = chart;
      const ctx = chart.ctx;
      ctx.restore();
      const fontSize = (height / 150).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#111827';

      const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
      const text = `Total: $${total.toLocaleString()}`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  };

  window.graficoGastosInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Impuestos', 'Seguros', 'Gastos diarios', 'Pago de deuda', 'Ahorro', 'Superávit/Deficit'],
      datasets: [{
        data: [impuestos, seguros, gastosDiarios, pagoDeuda, ahorro, superavit],
        backgroundColor: ['#FF6384', '#FF9F40', '#60a5fa', '#fbbf24', '#4ade80', '#a78bfa']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
        datalabels: {
          color: '#111827',
          font: { weight: 'bold' },
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const porcentaje = (value / total) * 100;
            return porcentaje.toFixed(1) + '%';
          }
        }
      }
    },
    plugins: [ChartDataLabels, centerTextPlugin]
  });
}
//---SECCION B DEUDA---
function mostrarDeuda() {
  const ingresoBruto = data.ingreso_bruto || 0;
  const deudaVivienda = data.deuda_hipotecaria || 0;

  const deudaTotal =
    (data.deuda_tarjetas || 0) +
    (data.deuda_hipotecaria || 0) +
    (data.deuda_comercial || 0) +
    (data.deuda_vehiculos || 0) +
    (data.deuda_estudios || 0) +
    (data.deuda_otros || 0);

  const activosTotales =
    (data.efectivo_similar || 0) +
    (data.cuentas_inversion || 0) +
    (data.cuentas_retiro || 0) +
    (data.valor_propiedades || 0) +
    (data.otros_activos || 0);

  const patrimonioNeto = activosTotales - deudaTotal;

  // Indicadores sobre ingreso bruto
  const viviendaSobreIngresoBruto = ingresoBruto > 0 ? deudaVivienda / ingresoBruto : 0;
  const dtiBruto = ingresoBruto > 0 ? deudaTotal / ingresoBruto : 0;
  const deudaSobreActivos = activosTotales > 0 ? deudaTotal / activosTotales : 0;
  const deudaSobrePatrimonio = patrimonioNeto > 0 ? deudaTotal / patrimonioNeto : Infinity;

  const icono = (valor, limites) => {
    if (valor <= limites[0]) return '✅';
    if (limites.length === 2 && valor <= limites[1]) return '⚠️';
    return '🚨';
  };

  const tabla = `
    <h3>🅱️ B. Endeudamiento</h3>
    <table style="width:100%; font-size: 0.95em; margin-top: 10px;">
      <thead>
        <tr>
          <th>Indicador</th>
          <th>Valor</th>
          <th>Evaluación</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>% Vivienda / ingreso bruto</td><td>${(viviendaSobreIngresoBruto * 100).toFixed(1)}%</td><td>${icono(viviendaSobreIngresoBruto, [0.24])}</td></tr>
        <tr><td>DTI / ingreso bruto</td><td>${(dtiBruto * 100).toFixed(1)}%</td><td>${icono(dtiBruto, [0.30])}</td></tr>
        <tr><td>Deuda / activos totales</td><td>${(deudaSobreActivos * 100).toFixed(1)}%</td><td>${icono(deudaSobreActivos, [0.50])}</td></tr>
        <tr><td>Deuda / patrimonio neto</td><td>${isFinite(deudaSobrePatrimonio) ? (deudaSobrePatrimonio * 100).toFixed(1) + '%' : 'N/A'}</td><td>${icono(deudaSobrePatrimonio, [0.50, 1.00])}</td></tr>
      </tbody>
    </table>
  `;

  document.getElementById("resB").innerHTML = tabla;
}

//---SECCION C PATRIMONIO---
  
function mostrarPatrimonio() {
  const edad = data.edad || 0;
  const ingreso = data.ingreso_bruto || 0;

  const activos = 
    (data.efectivo_similar || 0) +
    (data.cuentas_inversion || 0) +
    (data.cuentas_retiro || 0) +
    (data.valor_propiedades || 0) +
    (data.otros_activos || 0);

  const pasivos =
    (data.deuda_tarjetas || 0) +
    (data.deuda_hipotecaria || 0) +
    (data.deuda_comercial || 0) +
    (data.deuda_vehiculos || 0) +
    (data.deuda_estudios || 0) +
    (data.deuda_otros || 0);

  const patrimonio = activos - pasivos;

  const relPatrimonioActivos = activos > 0 ? patrimonio / activos : 0;
  const relPatrimonioPasivos = pasivos > 0 ? patrimonio / pasivos : 0;

  // Tabla benchmark por edad
  const tablaBenchmark = [
    { edad: 25, good: 2.5, great: 5 },
    { edad: 30, good: 3, great: 6 },
    { edad: 35, good: 3.5, great: 7 },
    { edad: 40, good: 4, great: 8 },
    { edad: 45, good: 4.5, great: 9 },
    { edad: 50, good: 5, great: 10 },
    { edad: 55, good: 5.5, great: 11 },
    { edad: 60, good: 6, great: 12 },
    { edad: 65, good: 6.5, great: 13 },
    { edad: 70, good: 7, great: 14 }
  ];

  const filaEdad = tablaBenchmark.find(f => edad <= f.edad) || tablaBenchmark[tablaBenchmark.length - 1];
  const valorGood = filaEdad.good * ingreso;
  const valorGreat = filaEdad.great * ingreso;

  let iconoAbsoluto;
  if (patrimonio >= valorGreat) {
    iconoAbsoluto = '⭐';
  } else if (patrimonio >= valorGood) {
    iconoAbsoluto = '✅';
  } else if (patrimonio >= 0.8 * valorGood) {
    iconoAbsoluto = '⚠️';
  } else {
    iconoAbsoluto = '🚨';
  }

  const iconoRelActivos = relPatrimonioActivos >= 0.7 ? '✅' : relPatrimonioActivos >= 0.5 ? '⚠️' : '🚨';
  const iconoRelPasivos = relPatrimonioPasivos >= 2 ? '✅' : relPatrimonioPasivos >= 1 ? '⚠️' : '🚨';

  const tabla = `
    <h3>🅲 C. Patrimonio neto</h3>
    <table style="width:100%; font-size: 0.95em; margin-top: 10px;">
      <thead>
        <tr><th>Indicador</th><th>Valor</th><th>Evaluación</th></tr>
      </thead>
      <tbody>
        <tr><td>Patrimonio neto absoluto</td><td>$${patrimonio.toLocaleString()}</td><td>${iconoAbsoluto}</td></tr>
        <tr><td>Relación patrimonio / activos</td><td>${(relPatrimonioActivos * 100).toFixed(1)}%</td><td>${iconoRelActivos}</td></tr>
        <tr><td>Relación patrimonio / pasivos</td><td>${isFinite(relPatrimonioPasivos) ? (relPatrimonioPasivos * 100).toFixed(1) + '%' : 'N/A'}</td><td>${iconoRelPasivos}</td></tr>
      </tbody>
    </table>
    <p style="font-size: 0.85em;">⭐ = superior al benchmark por edad; ✅ = sólido; ⚠️ = aceptable; 🚨 = débil.</p>
  `;

  document.getElementById("resC").innerHTML = tabla;
}
  
//---SECCION D SEGURIDAD---
  
function mostrarSeguridad() {
  const edad = data.edad || 0;
  const ingreso = data.ingreso_bruto || 0;

  const ahorro = (data.aporte_personal_retiro || 0) + (data.aporte_empleador_retiro || 0) + (data.otros_ahorros || 0);
  const superavit = ingreso - (
    (data.impuestos_anuales || 0) +
    (data.seguros_anuales || 0) +
    (data.gastos_diarios || 0) +
    (data.pago_deudas || 0) +
    ahorro
  );

  const tasaAhorro = ingreso > 0 ? ahorro / ingreso : 0;
  const capacidadAcumulacion = ingreso > 0 ? (ahorro + superavit) / ingreso : 0;

  const activosInversion = (data.cuentas_inversion || 0) + (data.cuentas_retiro || 0);
  const activosTotales = 
    (data.efectivo_similar || 0) +
    activosInversion +
    (data.valor_propiedades || 0) +
    (data.otros_activos || 0);

  const ratioInversionActivos = activosTotales > 0 ? activosInversion / activosTotales : 0;
  const ratioInversionIngreso = ingreso > 0 ? activosInversion / ingreso : 0;

  // Benchmark por edad
  const tablaEdad = [
    { edad: 25, ratio: 0.2 },
    { edad: 30, ratio: 0.6 },
    { edad: 35, ratio: 1.6 },
    { edad: 45, ratio: 3.0 },
    { edad: 55, ratio: 8.0 },
    { edad: 65, ratio: 16.0 }
  ];
  const filaEdad = tablaEdad.find(e => edad <= e.edad) || tablaEdad[tablaEdad.length - 1];
  const benchmarkInversionIngreso = filaEdad.ratio;

  // Evaluaciones visuales
  const iconoAhorro = tasaAhorro >= 0.30 ? '✅' : tasaAhorro >= 0.15 ? '⚠️' : '🚨';
  const iconoCapacidad = capacidadAcumulacion >= 0.30 ? '✅' : capacidadAcumulacion >= 0.15 ? '⚠️' : '🚨';
  const iconoInversionActivos = ratioInversionActivos >= 0.50 ? '✅' : ratioInversionActivos >= 0.30 ? '⚠️' : '🚨';

  let iconoInversionIngreso = '🚨';
  const ratioVsBenchmark = ratioInversionIngreso / benchmarkInversionIngreso;
  if (ratioVsBenchmark > 1.2) iconoInversionIngreso = '⭐';
  else if (ratioVsBenchmark >= 1.0) iconoInversionIngreso = '✅';
  else if (ratioVsBenchmark >= 0.9) iconoInversionIngreso = '⚠️';

  // Presentación
  const tabla = `
    <h3>🅳 Seguridad financiera</h3>
    <table style="width:100%; font-size: 0.95em; margin-top: 10px;">
      <thead><tr><th>Indicador</th><th>Valor</th><th>Evaluación</th></tr></thead>
      <tbody>
        <tr><td>Tasa de ahorro</td><td>${(tasaAhorro * 100).toFixed(1)}%</td><td>${iconoAhorro}</td></tr>
        <tr><td>Capacidad de acumulación</td><td>${(capacidadAcumulacion * 100).toFixed(1)}%</td><td>${iconoCapacidad}</td></tr>
        <tr><td>Inversión / activos totales</td><td>${(ratioInversionActivos * 100).toFixed(1)}%</td><td>${iconoInversionActivos}</td></tr>
        <tr><td>Inversión / ingreso bruto</td><td>${ratioInversionIngreso.toFixed(2)}× ingreso</td><td>${iconoInversionIngreso}</td></tr>
      </tbody>
    </table>
    <p style="font-size: 0.85em;">⭐ = sobresaliente · ✅ = cumple · ⚠️ = advertencia · 🚨 = peligro</p>
  `;

  document.getElementById("resD").innerHTML = tabla;
}

//---SECCION E RIESGO---
  
function mostrarRiesgo() {
  const gastosEsenciales = (data.gastos_diarios || 0) + (data.pago_deudas || 0) + (data.seguros_anuales || 0) + (data.impuestos_anuales || 0);
  const reservaEmergencia = gastosEsenciales > 0 ? (data.efectivo_similar || 0) / (gastosEsenciales / 12) : 0;
  const emojiReserva = reservaEmergencia > 6 ? '✅' : reservaEmergencia > 3 ? '⚠️' : '🚨';

  document.getElementById("resE").innerHTML = `
    <h3>🅴 Manejo de riesgo</h3>
    <p>Meses de reserva: ${reservaEmergencia.toFixed(1)} meses ${emojiReserva}</p>
  `;
}

  //---SECCION F HERENCIA---
  
function mostrarPatrimonial() {
  const documentos = [
    { nombre: "Trust", tiene: data.trust },
    { nombre: "Testamento", tiene: data.will },
    { nombre: "Directiva médica", tiene: data.advance_medical_directive },
    { nombre: "Poder legal", tiene: data.power_of_attorney },
    { nombre: "Designación de beneficiarios", tiene: data.beneficiary_designation },
    { nombre: "Títulos de propiedad", tiene: data.property_deeds }
  ];

  const tiene = documentos.filter(d => d.tiene).map(d => d.nombre).join(", ") || "Ninguno registrado";

  document.getElementById("resF").innerHTML = `
    <h3>🅵 Planificación patrimonial</h3>
    <p>Documentos disponibles: ${tiene}</p>
  `;
}

    //---SECCION G RETIRO---
  
function mostrarRetiro() {
  const edadActual = data.edad || 0;
  const edadRetiro = data.edad_retiro || 0;
  const anosRestantes = edadRetiro - edadActual;

  document.getElementById("resG").innerHTML = `
    <h3>🅶 Retiro</h3>
    <p>Años hasta retiro: ${anosRestantes}</p>
    <p>Estimación de retiro completada con inputs.</p>
  `;
}
    //---SECCION H STRESS TEST---
  
function mostrarEstres() {
  document.getElementById("resH").innerHTML = `
    <h3>🅷 Pruebas de estrés</h3>
    <p>Simulación de estrés aún en desarrollo (versión inicial).</p>
  `;
}
