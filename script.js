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
  event.preventDefault(); // 🔥 Evita recargar la página

  data = capturarDatos();
  mostrarResultados(); // Tu función que organiza la salida
  document.getElementById("formularioContainer").style.display = "none";
  document.getElementById("resultadosContainer").style.display = "block";
  mostrarGraficoGastos(); // Asegúrate de que esta función también esté definida
}
// hello
function mostrarGraficoGastos() {
  const canvas = document.getElementById('graficoGastos');
  if (!canvas) return; // 🔒 Previene error si el canvas no está en el DOM

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


function mostrarResultado(id) {
  document.querySelectorAll(".resultado-categoria").forEach(div => div.style.display = "none");
  document.getElementById(id).style.display = "block";

  // Cambiar estilo de navegación
  document.querySelectorAll('#navResultados .nav-btn').forEach(btn => btn.classList.remove('active'));
  const botones = document.querySelectorAll('#navResultados .nav-btn');
  const indices = { resA: 0, resB: 1, resC: 2, resD: 3, resE: 4, resF: 5, resG: 6, resH: 7 };
  if (botones[indices[id]]) botones[indices[id]].classList.add('active');
}

function mostrarGraficoGastos() {
  const ctx = document.getElementById('graficoGastos').getContext('2d');

  if (window.graficoGastosInstance) {
    window.graficoGastosInstance.destroy();
  }

  window.graficoGastosInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Deuda', 'Gastos esenciales', 'Seguros', 'Ahorro'],
      datasets: [{
        data: [
          data.deuda_hipotecaria + data.deuda_consumo + data.otras_deudas,
          data.gastos_esenciales,
          data.seguro_vida + data.seguro_medico + data.seguro_incapacidad + data.seguro_hogar + data.seguro_auto,
          data.aporte_anual_retiro || 0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
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

function mostrarFlujo() {
  const ingreso = data.ingreso_bruto || 0;
  const ahorro = (data.aporte_personal_retiro || 0) + (data.aporte_empleador_retiro || 0) + (data.otros_ahorros || 0);
  const gastos = (data.pago_deudas || 0) + (data.gastos_diarios || 0) + (data.impuestos_anuales || 0) + (data.seguros_anuales || 0);

  const superavit = ingreso - (gastos + ahorro);
  const tasaAhorro = ahorro / ingreso;
  const emojiAhorro = tasaAhorro > 0.15 ? '✅' : tasaAhorro > 0 ? '⚠️' : '🚨';

  document.getElementById("resA").innerHTML = `
    <h3>🅰️ A. Flujo</h3>
    <p>Ingreso anual: $${ingreso.toLocaleString()}</p>
    <p>Gastos anuales: $${gastos.toLocaleString()}</p>
    <p>Ahorro anual: $${ahorro.toLocaleString()}</p>
    <p>Superávit anual: $${superavit.toLocaleString()} ${emojiAhorro}</p>
  `;
}

function mostrarDeuda() {
  const deudaTotal = (data.deuda_tarjetas || 0) + (data.deuda_hipotecaria || 0) + (data.deuda_comercial || 0) + (data.deuda_vehiculos || 0) + (data.deuda_estudios || 0) + (data.deuda_otros || 0);

  document.getElementById("resB").innerHTML = `
    <h3>🅱️ B. Deuda</h3>
    <p>Total deudas: $${deudaTotal.toLocaleString()}</p>
  `;
}

function mostrarPatrimonio() {
  const activos = (data.efectivo_similar || 0) + (data.cuentas_inversion || 0) + (data.cuentas_retiro || 0) + (data.valor_propiedades || 0) + (data.otros_activos || 0);
  const pasivos = (data.deuda_tarjetas || 0) + (data.deuda_hipotecaria || 0) + (data.deuda_comercial || 0) + (data.deuda_vehiculos || 0) + (data.deuda_estudios || 0) + (data.deuda_otros || 0);

  const patrimonio = activos - pasivos;

  document.getElementById("resC").innerHTML = `
    <h3>🅲 Patrimonio neto</h3>
    <p>Activos: $${activos.toLocaleString()}</p>
    <p>Pasivos: $${pasivos.toLocaleString()}</p>
    <p>Patrimonio neto: $${patrimonio.toLocaleString()}</p>
  `;
}

function mostrarSeguridad() {
  const activosInversion = (data.cuentas_inversion || 0) + (data.cuentas_retiro || 0);
  const activosTotales = (data.efectivo_similar || 0) + (data.cuentas_inversion || 0) + (data.cuentas_retiro || 0) + (data.valor_propiedades || 0) + (data.otros_activos || 0);

  const porcentajeInversion = activosTotales > 0 ? (activosInversion / activosTotales) * 100 : 0;
  const emojiInversion = porcentajeInversion >= 50 ? '✅' : porcentajeInversion >= 30 ? '⚠️' : '🚨';

  document.getElementById("resD").innerHTML = `
    <h3>🅳 Seguridad financiera</h3>
    <p>Activos de inversión: $${activosInversion.toLocaleString()} (${porcentajeInversion.toFixed(1)}%) ${emojiInversion}</p>
  `;
}

function mostrarRiesgo() {
  const gastosEsenciales = (data.gastos_diarios || 0) + (data.pago_deudas || 0) + (data.seguros_anuales || 0) + (data.impuestos_anuales || 0);
  const reservaEmergencia = gastosEsenciales > 0 ? (data.efectivo_similar || 0) / (gastosEsenciales / 12) : 0;
  const emojiReserva = reservaEmergencia > 6 ? '✅' : reservaEmergencia > 3 ? '⚠️' : '🚨';

  document.getElementById("resE").innerHTML = `
    <h3>🅴 Manejo de riesgo</h3>
    <p>Meses de reserva: ${reservaEmergencia.toFixed(1)} meses ${emojiReserva}</p>
  `;
}

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

function mostrarEstres() {
  document.getElementById("resH").innerHTML = `
    <h3>🅷 Pruebas de estrés</h3>
    <p>Simulación de estrés aún en desarrollo (versión inicial).</p>
  `;
}
