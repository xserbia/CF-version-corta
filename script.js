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
  }

  // 🔄 Actualizar los botones de navegación
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

  // 🔄 Actualizar el estado global
  seccionActual = stepId;
} //HERE

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

// ✅ Establecer la sección actual
seccionActual = 'stepIngresos';

// 🔄 Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', inicializarFormulario);

function inicializarFormulario() {
  console.log("✅ DOMContentLoaded event fired");

  ocultarTodasLasSecciones();

  // ✅ Primero define qué paso quieres mostrar
  seccionActual = 'stepIngresos';

  const primerPaso = document.getElementById(seccionActual);
  if (primerPaso) {
    primerPaso.classList.add('active');
  }

  // 🔄 Eliminar required y aplicar validación dinámica
  const camposRequeridos = document.querySelectorAll('input[required], select[required], textarea[required]');
  camposRequeridos.forEach(el => {
    el.removeAttribute('required');

    if (el.tagName.toLowerCase() === 'input') {
      const label = el.previousElementSibling;
      if (label && label.tagName.toLowerCase() === 'label') {
        label.classList.add('required-label');
      }
      el.addEventListener('input', () => validarCampo(el));
    }
  });
}


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
  console.log("✅ Entró a procesarResultados");
  if (event) event.preventDefault();
  data = capturarDatos();
  console.log("📦 Datos capturados:", data);

document.getElementById("formularioContainer").style.display = "none";
document.getElementById("resultadosContainer").style.display = "block";
document.getElementById("resultadosContainer").style.visibility = "visible"; // (por si acaso)
  console.log("📊 Se mostró resultadosContainer");

  mostrarResultados();
  mostrarResultado('resA');
  setTimeout(() => {
    mostrarGraficoGastos();
  }, 50);
}
function mostrarResultado(id) {
  console.log(`🟦 mostrarResultado('${id}') ejecutado`);

  // Ocultar todas las secciones y quitar bordes
  document.querySelectorAll(".resultado-categoria").forEach(div => {
    div.style.display = "none";
    div.style.outline = "none"; // eliminar cualquier borde anterior
  });

  // Mostrar y remarcar la sección seleccionada
  const seccion = document.getElementById(id);
  if (seccion) {
    seccion.style.display = "block";
    seccion.style.outline = "3px dashed orange"; // ✅ borde permanente
    console.log(`✅ Se mostró #${id}`);
  } else {
    console.warn(`🚨 No se encontró el elemento con ID: ${id}`);
  }

  // Actualizar estado visual del navegador de resultados
  document.querySelectorAll('#navResultados .nav-btn').forEach(btn => btn.classList.remove('active'));
  const botones = document.querySelectorAll('#navResultados .nav-btn');
  const indices = { resA: 0, resB: 1, resC: 2, resD: 3, resE: 4, resF: 5, resG: 6, resH: 7 };
  if (botones[indices[id]]) botones[indices[id]].classList.add('active');
}

function mostrarResultados() {
  console.log("✅ mostrarResultados ejecutado");
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

// ;-)
//---SECCION A LIQUIDEZ---

function mostrarFlujo() {
  console.log("✅ mostrarFlujo ejecutado");
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

  const iconoAhorro = tasaAhorro >= 0.30 ? '✅' : tasaAhorro >= 0.15 ? '⚠️' : '🚨';
  const iconoSuperavit = superavit < 0 ? '🚨' : superavit / ingreso <= 0.15 ? '⚠️' : '✅';
  const iconoReserva = reservaEmergencia > 36 ? '🔁' : reservaEmergencia >= 12 ? '✅' : reservaEmergencia >= 6 ? '⚠️' : '🚨';
  const iconoRazonCorriente = razonCorriente > 1 ? '✅' : '🚨';
  const iconoCapacidad = capacidadAcumulacion > 0.5 ? '🔁' : capacidadAcumulacion >= 0.15 ? '✅' : capacidadAcumulacion >= 0 ? '⚠️' : '🚨';

   console.log("🔍 resA existe?", document.getElementById("resA"));
  document.getElementById("resA").innerHTML = `
    <h3>🅰️ A. Flujo de efectivo y liquidez</h3>
    <span style="color:red; font-size: 32px;">🚨 PRUEBA VISIBLE</span>
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

  mostrarGraficoGastos(); // ahora que está definida globalmente
}

// ✅ Función separada
function mostrarGraficoGastos() {
  const canvas = document.getElementById('graficoGastos');
  if (!canvas || canvas.offsetParent === null) return;

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
  const gastosMensuales = gastosEsenciales / 12;

  // Activos
  const efectivo = data.efectivo_similar || 0;
  const inversiones = data.cuentas_inversion || 0;
  const retiro = data.cuentas_retiro || 0;
  const propiedades = data.valor_propiedades || 0;
  const fisicos = data.otros_activos || 0;

  // Fondos por nivel
  const fondo1 = efectivo;
  const fondo2 = fondo1 + (inversiones * 0.9);
  const fondo3 = fondo2 + (retiro * 0.9);
  const fondo4 = fondo3 + (propiedades * 0.9);
  const fondo5 = fondo4 + (fisicos * 0.5);

  // Meses de cobertura
  const meses1 = gastosMensuales > 0 ? fondo1 / gastosMensuales : 0;
  const meses2 = gastosMensuales > 0 ? fondo2 / gastosMensuales : 0;
  const meses3 = gastosMensuales > 0 ? fondo3 / gastosMensuales : 0;
  const meses4 = gastosMensuales > 0 ? fondo4 / gastosMensuales : 0;
  const meses5 = gastosMensuales > 0 ? fondo5 / gastosMensuales : 0;

  // Checklist de seguros
  const seguros = [
    { nombre: "Seguro médico", valor: data.seguro_salud },
    { nombre: "Seguro de vida", valor: data.seguro_vida },
    { nombre: "Seguro de discapacidad", valor: data.seguro_incapacidad },
    { nombre: "Seguro de hogar", valor: data.seguro_propiedad },
    { nombre: "Seguro de auto", valor: data.seguro_auto },
    { nombre: "Seguro umbrella", valor: data.seguro_umbrella }
  ];

  let tablaSeguros = '<ul style="list-style:none; padding-left:0;">';
  seguros.forEach(s => {
    tablaSeguros += `<li>${s.valor ? '✅' : '❌'} ${s.nombre}</li>`;
  });
  tablaSeguros += '</ul>';

  const resultado = `
    <h3>🅴 Manejo de riesgo</h3>

    <h4>💰 Fondos acumulados y meses cubiertos</h4>
    <table style="width:100%; font-size:0.95em;">
      <thead><tr><th>Nivel</th><th>Fondos disponibles</th><th>Meses cubiertos</th></tr></thead>
      <tbody>
        <tr><td>1. Solo efectivo</td><td>$${fondo1.toLocaleString()}</td><td>${meses1.toFixed(1)}</td></tr>
        <tr><td>2. + Inversiones</td><td>$${fondo2.toLocaleString()}</td><td>${meses2.toFixed(1)}</td></tr>
        <tr><td>3. + Cuentas de retiro</td><td>$${fondo3.toLocaleString()}</td><td>${meses3.toFixed(1)}</td></tr>
        <tr><td>4. + Propiedades</td><td>$${fondo4.toLocaleString()}</td><td>${meses4.toFixed(1)}</td></tr>
        <tr><td>5. + Activos físicos</td><td>$${fondo5.toLocaleString()}</td><td>${meses5.toFixed(1)}</td></tr>
      </tbody>
    </table>

    <h4>🧾 Checklist de pólizas de seguro</h4>
    ${tablaSeguros}
    <p style="font-size: 0.85em;">✅ = Tiene la póliza · ❌ = No tiene</p>
  `;

  document.getElementById("resE").innerHTML = resultado;
}

  //---SECCION F HERENCIA---

  function mostrarPatrimonial() {
  const documentos = [
    { nombre: "Trust (fideicomiso)", valor: data.trust },
    { nombre: "Testamento (will)", valor: data.will },
    { nombre: "Directiva médica anticipada", valor: data.advance_medical_directive },
    { nombre: "Poder legal", valor: data.power_of_attorney },
    { nombre: "Designación de beneficiarios", valor: data.beneficiary_designation },
    { nombre: "Títulos de propiedad", valor: data.property_deeds }
  ];

  const tiene = documentos.filter(d => d.valor);
  const noTiene = documentos.filter(d => !d.valor);

  let listaTiene = '<ul style="list-style:none; padding-left:0;">';
  tiene.forEach(d => {
    listaTiene += `<li>✅ ${d.nombre}</li>`;
  });
  listaTiene += '</ul>';

  let listaNoTiene = '<ul style="list-style:none; padding-left:0;">';
  noTiene.forEach(d => {
    listaNoTiene += `<li>❌ ${d.nombre}</li>`;
  });
  listaNoTiene += '</ul>';

  const resultado = `
    <h3>🅵 Planificación patrimonial</h3>
    <h4>✅ Documentos que tienes</h4>
    ${listaTiene}

    <h4>❌ Documentos que no tienes</h4>
    ${listaNoTiene}

    <p style="font-size:0.85em; margin-top:10px;">
      Este resumen solo indica la presencia o ausencia de documentos clave.<br>
      Consulta con un abogado si deseas verificar su validez o actualizar tu planificación.
    </p>
  `;

  document.getElementById("resF").innerHTML = resultado;
}
    //---SECCION G RETIRO---
  
function mostrarRetiro() {
  const edadActual = data.edad || 0;
  const edadRetiro = data.edad_retiro || 0;
  const anosAcumulacion = edadRetiro - edadActual;
  const ingresoBruto = data.ingreso_bruto || 0;

  const ahorroAcumulado = (data.cuentas_retiro || 0);
  const aporteAnual = (data.aporte_personal_retiro || 0) + (data.aporte_empleador_retiro || 0);

  // Parámetros de proyección
  const tasaAcumulacion = (data.tasa_acumulacion || 7) / 100;
  const tasaRetiro = (data.tasa_retiro || 4) / 100;
  const inflacion = (data.inflacion_esperada || 3) / 100;
  const tasaReal = ((1 + tasaRetiro) / (1 + inflacion)) - 1;

  const ingresoDeseado = ingresoBruto * 0.7;
  const anosDistribucion = 100 - edadRetiro;

  // 🧱 Capital necesario = Ingreso anual deseado × fórmula de valor presente
  const capitalNecesario = ingresoDeseado * ((1 - Math.pow(1 + tasaReal, -anosDistribucion)) / tasaReal);

  // 💼 Total acumulado estimado
  const totalAcumulado = ahorroAcumulado * Math.pow(1 + tasaAcumulacion, anosAcumulacion) +
                         aporteAnual * ((Math.pow(1 + tasaAcumulacion, anosAcumulacion) - 1) / tasaAcumulacion);

  // ⚠️ Faltante
  const faltante = capitalNecesario - totalAcumulado;

  // 💸 Aportes extra sugeridos (si hay déficit)
  const aporteAnualExtra = faltante > 0
    ? faltante / ((Math.pow(1 + tasaAcumulacion, anosAcumulacion) - 1) / tasaAcumulacion)
    : 0;

  const aporteMensualExtra = aporteAnualExtra / 12;

  // 📏 Factor por edad actual
  const factores = {
    25: 0.35, 30: 0.85, 35: 1.5, 40: 2.58,
    45: 3.14, 50: 4.92, 55: 6.35, 60: 7.23,
    65: 10.84, 70: 11
  };

  const factorEsperado = Object.keys(factores)
    .reverse()
    .find(e => edadActual >= parseInt(e)) || 25;

  const factor = factores[factorEsperado];
  const esperado = ingresoBruto * factor;
  const ratioAhorroEdad = ahorroAcumulado / esperado;

  const iconoFaltante = faltante <= 0 ? '✅' : '⚠️';
  const iconoFactor = ratioAhorroEdad >= 1 ? '✅' : ratioAhorroEdad >= 0.9 ? '⚠️' : '🚨';

  document.getElementById("retiroTexto").innerHTML = `
    <p><strong>🧱 Capital necesario:</strong> $${capitalNecesario.toLocaleString()}</p>
    <p><strong>💼 Capital acumulado:</strong> $${totalAcumulado.toLocaleString()}</p>
  `;

  renderGraficoRetiro(capitalNecesario, totalAcumulado);

  // Monte Carlo (placeholder por ahora)
  const probabilidadExito = 82; // ⚠️ Simulación básica (futuro: generar dinámicamente)
  const iconoMonteCarlo = probabilidadExito > 90 ? '✅' : probabilidadExito >= 70 ? '⚠️' : '🚨';

  // 🧾 Output
  document.getElementById("resG").innerHTML = `
    <h3>🅶 Futuro financiero</h3>
    <table>
      <tr><td>🧱 Capital necesario:</td><td>$${capitalNecesario.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td></tr>
      <tr><td>💼 Total acumulado estimado:</td><td>$${totalAcumulado.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td></tr>
      <tr><td>⚠️ Faltante actual:</td><td>$${faltante.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${iconoFaltante}</td></tr>
      <tr><td>💸 Aporte anual extra recomendado:</td><td>$${aporteAnualExtra.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td></tr>
      <tr><td>💰 Aporte mensual extra recomendado:</td><td>$${aporteMensualExtra.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td></tr>
      <tr><td>📏 Factor de ahorro por edad:</td><td>${(ratioAhorroEdad * 100).toFixed(1)}% ${iconoFactor}</td></tr>
      <tr><td>📊 Probabilidad de éxito (Monte Carlo):</td><td>${probabilidadExito}% ${iconoMonteCarlo}</td></tr>
    </table>
  `;
}

    //---SECCION H STRESS TEST---
  
function mostrarEstres() {
  const ingreso = data.ingreso_bruto || 0;
  const ahorro = (data.aporte_personal_retiro || 0) + (data.aporte_empleador_retiro || 0) + (data.otros_ahorros || 0);
  const gastos = (data.impuestos_anuales || 0) + (data.seguros_anuales || 0) + (data.gastos_diarios || 0);
  const deudas = data.pago_deudas || 0;

  const activosNoLiquidos =
    (data.cuentas_inversion || 0) +
    (data.cuentas_retiro || 0) +
    (data.valor_propiedades || 0) +
    (data.otros_activos || 0);

  const escenarios = [
    { nombre: "Leve", ajuste: 0.9 },
    { nombre: "Moderado", ajuste: 0.7 },
    { nombre: "Severo", ajuste: 0.5 }
  ];

  let tabla = `
    <h3>🅷 Pruebas de estrés</h3>
    <table style="font-size: 0.95em; margin-top: 10px; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Escenario</th>
          <th>¿Cubre gastos?</th>
          <th>¿Cubre deudas?</th>
          <th>¿Sigue ahorrando?</th>
        </tr>
      </thead>
      <tbody>
  `;

  escenarios.forEach(e => {
    const ingresoAjustado = ingreso * e.ajuste;
    const activosAjustados = activosNoLiquidos * e.ajuste;
    const ingresoTotalDisponible = ingresoAjustado + activosAjustados;
    const gastosTotales = gastos + deudas;

    const cubreGastos = ingresoTotalDisponible >= gastos;
    const cubreDeudas = ingresoTotalDisponible >= gastosTotales;
    const puedeAhorrar = ingresoTotalDisponible > (gastosTotales + 0.05 * ingreso); // regla simple

    const iconGastos = cubreGastos ? "✅" : "❌";
    const iconDeudas = cubreDeudas ? "✅" : "❌";
    const iconAhorro = puedeAhorrar ? "✅" : (ingresoTotalDisponible >= gastosTotales ? "⚠️" : "🚨");

    tabla += `
      <tr>
        <td>${e.nombre}</td>
        <td>${iconGastos}</td>
        <td>${iconDeudas}</td>
        <td>${iconAhorro}</td>
      </tr>
    `;
  });

  tabla += `
      </tbody>
    </table>
    <p style="font-size: 0.85em; margin-top: 10px;">
      Simulación basada en caída del 10%, 30%, y 50% de ingresos y activos no líquidos.<br>
      Efectivo y equivalentes no se afectan en la simulación.
    </p>
  `;

  document.getElementById("resH").innerHTML = tabla;
}
function mostrarResultadosFinales() {
  // 🔍 Verificamos si los elementos existen
  const formulario = document.getElementById("formularioContainer");
  const resultados = document.getElementById("resultadosContainer");
  const resA = document.getElementById("resA");

  if (!formulario || !resultados || !resA) {
    console.warn("🚨 Uno o más elementos no fueron encontrados en el DOM");
    return;
  }

  // ✅ Capturar datos
  data = capturarDatos();
  console.log("📦 Datos capturados:", data);

  // 🔒 Ocultamos el formulario
  formulario.style.display = "none";

  // ✅ Mostramos el contenedor de resultados
  resultados.style.display = "block";
  resultados.style.visibility = "visible"; // por si acaso

  // ✅ Ejecutar todos los cálculos y poblar resultados
  mostrarResultados();

  // ✅ Mostrar solo la sección A
  document.querySelectorAll(".resultado-categoria").forEach(div => div.style.display = "none");
  resA.classList.add("mostrar");
  resA.style.outline = "2px dashed green";

  console.log("✅ resA se está mostrando:", resA);
  document.getElementById("navResultados").style.display = "flex";
}



