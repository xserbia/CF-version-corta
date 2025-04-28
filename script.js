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

// ✅ Bloqueo de navegación en menú top
let seccionActual = 'stepIngresos';
const ordenSecciones = ['stepIngresos', 'stepGastos', 'stepActivos', 'stepPasivos', 'stepSegurosHerencia', 'stepRetiro'];

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const destino = this.getAttribute('onclick').match(/'(.*?)'/)[1];

    const pasoActualIndex = ordenSecciones.indexOf(seccionActual);
    const destinoIndex = ordenSecciones.indexOf(destino);

    if (destinoIndex > pasoActualIndex) {
      if (!validarCamposPasoActual()) {
        e.preventDefault();
      } else {
        seccionActual = destino;
      }
    } else {
      seccionActual = destino;
    }
  });
});

function validarCampo(input) {
  if (input.value.trim() === '' || isNaN(input.value) || parseFloat(input.value) < 0) {
    input.style.border = '2px solid red';
  } else {
    input.style.border = '2px solid green';
  }
}

// ✅ Validar campos antes de avanzar
function guardarDatosYAvanzar(siguientePasoId) {
  const pasoActual = document.querySelector('.step.active');
  let camposValidos = true;

  if (pasoActual) {
    const inputs = pasoActual.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      const label = input.previousElementSibling;
      if (input.value.trim() === '' || isNaN(input.value) || parseFloat(input.value) < 0) {
        camposValidos = false;
        input.style.border = '2px solid red';
        if (label) {
          label.classList.add('error');
          label.classList.add('shake');
          setTimeout(() => label.classList.remove('shake'), 400);
        }
      } else {
        input.style.border = '2px solid green';
        if (label) {
          label.classList.remove('error');
        }
      }
    });
  }

  return camposValidos;
}

// ✅ Validar antes de pasar con botón "Continuar"
function guardarDatosYAvanzar(siguientePasoId) {
  if (validarCamposPasoActual()) {
    irASeccion(siguientePasoId);
  }
}

// ✅ Retroceder sin validar
function prevStep(prevPasoId) {
  irASeccion(prevPasoId);
}

// ✅ Al cargar la página
window.onload = function() {
  ocultarTodasLasSecciones();
  const step = document.getElementById('stepIngresos');
  if (step) {
    step.classList.add('active');
    step.style.display = "block";
  }
  seccionActual = 'stepIngresos';
};

// ✅ Marcar campos requeridos y bloquear navegación solo después de cargar DOM
document.addEventListener('DOMContentLoaded', function() {
  const inputsRequeridos = document.querySelectorAll('input[required]');
  
  inputsRequeridos.forEach(input => {
    const label = input.previousElementSibling;
    if (label && label.tagName.toLowerCase() === 'label') {
      label.classList.add('required-label');
    }

    // 🔥 Nuevo: Revalidar automáticamente mientras escribe
    input.addEventListener('input', function() {
      if (input.value.trim() !== '' && !isNaN(input.value) && parseFloat(input.value) >= 0) {
        input.style.border = '2px solid green';
        if (label) {
          label.classList.remove('error');
        }
      } else {
        input.style.border = '2px solid red';
        if (label) {
          label.classList.add('error');
        }
      }
    });
  });

  // 🔥 Bloquear navegación manual
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const destino = this.getAttribute('onclick').match(/'(.*?)'/)[1];
      if (destino !== seccionActual) {
        e.preventDefault();
      }
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

function procesarResultados() {
  data = capturarDatos();
  mostrarResultados();
  document.getElementById("formularioContainer").style.display = "none";
  document.getElementById("resultadosContainer").style.display = "block";
  mostrarGraficoGastos();
}

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
  const ingreso = data.salario + data.negocio + data.otros_ingresos;
  const gastos = data.gastos_totales;
  const superavit = ingreso - gastos;
  const tasaAhorro = superavit / ingreso;
  const emojiAhorro = tasaAhorro > 0.15 ? '✅' : tasaAhorro > 0 ? '⚠️' : '🚨';

  document.getElementById("flujo").innerHTML = `
    <h3>🅰️ A. Flujo</h3>
    <p>Ingreso anual: $${ingreso.toLocaleString()}</p>
    <p>Gastos anuales: $${gastos.toLocaleString()}</p>
    <p>Superávit anual: $${superavit.toLocaleString()} ${emojiAhorro}</p>
  `;
}

function mostrarDeuda() {
  const deudaTotal = data.deuda_hipotecaria + data.deuda_consumo + data.otras_deudas;
  document.getElementById("deuda").innerHTML = `
    <h3>🅱️ B. Deuda</h3>
    <p>Total deudas: $${deudaTotal.toLocaleString()}</p>
  `;
}

function mostrarPatrimonio() {
  const activos = data.cuentas_bancarias + data.inversiones_no_retiro + data.cuentas_retiro + data.valor_propiedades + data.valor_otros_activos;
  const pasivos = data.deuda_hipotecaria + data.deuda_consumo + data.otras_deudas;
  const patrimonio = activos - pasivos;

  document.getElementById("patrimonio").innerHTML = `
    <h3>🅲 Patrimonio</h3>
    <p>Activos: $${activos.toLocaleString()}</p>
    <p>Pasivos: $${pasivos.toLocaleString()}</p>
    <p>Patrimonio neto: $${patrimonio.toLocaleString()}</p>
  `;
}

function mostrarSeguridad() {
  const activosInversion = data.inversiones_no_retiro + data.cuentas_retiro;
  const activosTotales = data.cuentas_bancarias + data.inversiones_no_retiro + data.cuentas_retiro + data.valor_propiedades + data.valor_otros_activos;
  const porcentajeInversion = (activosInversion / activosTotales) * 100;

  const emojiInversion = porcentajeInversion >= 50 ? '✅' : porcentajeInversion >= 30 ? '⚠️' : '🚨';

  document.getElementById("seguridad").innerHTML = `
    <h3>🅳 Seguridad</h3>
    <p>Activos de inversión: $${activosInversion.toLocaleString()} (${porcentajeInversion.toFixed(1)}%) ${emojiInversion}</p>
  `;
}

function mostrarRiesgo() {
  const reservaEmergencia = data.cuentas_bancarias / (data.gastos_esenciales / 12);
  const emojiReserva = reservaEmergencia > 6 ? '✅' : reservaEmergencia > 3 ? '⚠️' : '🚨';

  document.getElementById("riesgo").innerHTML = `
    <h3>🅴 Manejo de riesgo</h3>
    <p>Meses de reserva: ${reservaEmergencia.toFixed(1)} meses ${emojiReserva}</p>
  `;
}

function mostrarPatrimonial() {
  const documentos = [
    { nombre: "Trust", tiene: data.tiene_trust },
    { nombre: "Testamento", tiene: data.tiene_testamento },
    { nombre: "Directiva médica", tiene: data.tiene_directiva_medica },
    { nombre: "Poder legal", tiene: data.tiene_poder_legal }
  ];
  const tiene = documentos.filter(d => d.tiene).map(d => d.nombre).join(", ") || "Ninguno registrado";

  document.getElementById("planificacion").innerHTML = `
    <h3>🅵 Patrimonial</h3>
    <p>Documentos disponibles: ${tiene}</p>
  `;
}

function mostrarRetiro() {
  const edadActual = data.edad_actual;
  const edadRetiro = data.edad_retiro;
  const anosRestantes = edadRetiro - edadActual;
  const ingresoSeguro = data.seguro_social_ingreso;
  const ahorroNecesario = ingresoSeguro * 20; // Simplificación rápida

  document.getElementById("retiro").innerHTML = `
    <h3>🅶 Retiro</h3>
    <p>Años hasta retiro: ${anosRestantes}</p>
    <p>Ahorro necesario aproximado: $${ahorroNecesario.toLocaleString()}</p>
  `;
}

function mostrarEstres() {
  document.getElementById("estres").innerHTML = `
    <h3>🅷 Estrés financiero</h3>
    <p>Simulación: En proceso (versión simplificada no aplica caída de activos todavía).</p>
  `;
}
