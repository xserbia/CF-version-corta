// --- Financial Evaluator Short - script.js ---

// ✅ Navegación entre secciones
function irASeccion(id) {
  const pasos = document.querySelectorAll(".step");
  pasos.forEach(p => p.classList.remove("active"));
  const pasoActual = document.getElementById(id);
  if (pasoActual) pasoActual.classList.add("active");

  const botones = document.querySelectorAll(".nav-btn");
  botones.forEach(b => b.classList.remove("active"));
  const botonActivo = Array.from(botones).find(b => b.getAttribute("onclick")?.includes(id));
  if (botonActivo) botonActivo.classList.add("active");
}

// ✅ Validación visual
function validarCampo(input) {
  const valor = parseFloat(input.value);
  if (isNaN(valor) || valor < 0) {
    input.style.borderColor = "red";
  } else {
    input.style.borderColor = "#44008f";
  }
}

// ✅ Recolectar todos los datos del formulario
function recolectarDatosFinancieros() {
  const data = {};
  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    const name = input.name;
    if (!name) return;

    if (input.type === "checkbox") {
      data[name] = input.checked;
    } else {
      const valor = parseFloat(input.value);
      data[name] = isNaN(valor) ? 0 : valor;
    }
  });

  return data;
}

// ✅ Mostrar sección de resultados con navegación entre pestañas
function mostrarResultado(id) {
  const secciones = document.querySelectorAll(".resultado-categoria");
  secciones.forEach(s => s.classList.remove("mostrar"));

  const activa = document.getElementById(id);
  if (activa) activa.classList.add("mostrar");

  const botones = document.querySelectorAll("#navResultados .nav-btn");
  botones.forEach(b => b.classList.remove("resultado-activo"));
  const botonActivo = Array.from(botones).find(b => b.getAttribute("onclick")?.includes(id));
  if (botonActivo) botonActivo.classList.add("resultado-activo");
}

// ✅ Función auxiliar para íconos
function iconoLiquidez(valor, tipo) {
  switch (tipo) {
    case "tasa_ahorro":
      return valor >= 30 ? "✅" : valor >= 15 ? "⚠️" : "🚨";
    case "superavit":
      return valor < 0 ? "🚨" : valor <= 15 ? "⚠️" : "✅";
    case "reserva":
      return valor > 36 ? "🔁" : valor >= 12 ? "✅" : valor >= 6 ? "⚠️" : "🚨";
    case "razon":
      return valor >= 1 ? "✅" : "🚨";
    case "capacidad":
      return valor > 50 ? "🔁" : valor >= 15 ? "✅" : valor >= 0 ? "⚠️" : "🚨";
    default:
      return "";
  }
}

// ✅ Mostrar resultado de Liquidez
function mostrarResultadoLiquidez(data) {
  const ingresoAnual = data.ingreso_bruto || 0;
  const ahorroAnual =
    (data.aporte_personal_retiro || 0) +
    (data.aporte_empleador_retiro || 0) +
    (data.otros_ahorros || 0);

  const impuestos = data.impuestos_anuales || 0;
  const seguros = data.seguros_anuales || 0;
  const gastoDiario = data.gastos_diarios || 0;
  const deuda = data.pago_deudas || 0;

  const gastoTotal = impuestos + seguros + gastoDiario + deuda;
  const superavitAnual = ingresoAnual - gastoTotal - ahorroAnual;
  const superavitPorcentaje = ingresoAnual > 0 ? (superavitAnual / ingresoAnual) * 100 : 0;

  const mesesReserva = gastoTotal > 0 ? (data.efectivo_similar || 0) / (gastoTotal / 12) : 0;
  const razonCorriente = deuda > 0 ? (data.efectivo_similar || 0) / deuda : 0;
  const capacidad = ingresoAnual > 0 ? ((ahorroAnual + superavitAnual) / ingresoAnual) * 100 : 0;
  const tasaAhorro = ingresoAnual > 0 ? (ahorroAnual / ingresoAnual) * 100 : 0;

  document.getElementById("liquidez_tasa_ahorro").innerHTML =
    tasaAhorro.toFixed(1) + "% " + iconoLiquidez(tasaAhorro, "tasa_ahorro");

  document.getElementById("liquidez_superavit").innerHTML =
    superavitPorcentaje.toFixed(1) + "% " + iconoLiquidez(superavitPorcentaje, "superavit");

  document.getElementById("liquidez_reserva").innerHTML =
    mesesReserva.toFixed(1) + " meses " + iconoLiquidez(mesesReserva, "reserva");

  document.getElementById("liquidez_razon_corriente").innerHTML =
    razonCorriente.toFixed(2) + " " + iconoLiquidez(razonCorriente, "razon");

  document.getElementById("liquidez_capacidad").innerHTML =
    capacidad.toFixed(1) + "% " + iconoLiquidez(capacidad, "capacidad");

  document.getElementById("resultadosContainer").style.display = "block";
  document.getElementById("navResultados").style.display = "flex";
  mostrarResultado("resA");
}

// ✅ Mostrar resultado de Pasivos y activar Liquidez
function mostrarResultadoPasivos() {
  const campos = [
    "deuda_tarjetas",
    "deuda_hipotecaria",
    "deuda_comercial",
    "deuda_vehiculos",
    "deuda_estudios",
    "deuda_otros"
  ];

  let validos = true;

  campos.forEach(id => {
    const input = document.getElementById(id);
    const valor = parseFloat(input.value);
    if (isNaN(valor) || valor < 0) {
      input.classList.add("shake");
      input.style.borderColor = "red";
      validos = false;
      setTimeout(() => input.classList.remove("shake"), 300);
    } else {
      input.style.borderColor = "#44008f";
    }
  });

  if (!validos) return;

  const tarjeta = parseFloat(document.getElementById("deuda_tarjetas").value) || 0;
  const hipoteca = parseFloat(document.getElementById("deuda_hipotecaria").value) || 0;
  const comercial = parseFloat(document.getElementById("deuda_comercial").value) || 0;
  const vehiculo = parseFloat(document.getElementById("deuda_vehiculos").value) || 0;
  const estudio = parseFloat(document.getElementById("deuda_estudios").value) || 0;
  const otros = parseFloat(document.getElementById("deuda_otros").value) || 0;
  const total = tarjeta + hipoteca + comercial + vehiculo + estudio + otros;

  const html = `
    <h4>📉 Deudas Totales</h4>
    <p><strong>Tarjetas de crédito:</strong> $${tarjeta.toLocaleString()}</p>
    <p><strong>Hipoteca:</strong> $${hipoteca.toLocaleString()}</p>
    <p><strong>Deuda comercial:</strong> $${comercial.toLocaleString()}</p>
    <p><strong>Vehículos:</strong> $${vehiculo.toLocaleString()}</p>
    <p><strong>Estudios:</strong> $${estudio.toLocaleString()}</p>
    <p><strong>Otras deudas:</strong> $${otros.toLocaleString()}</p>
    <p><strong>Total pasivos:</strong> $${total.toLocaleString()}</p>
  `;

  document.getElementById("resD").innerHTML = html;
  document.getElementById("resultadosContainer").style.display = "block";
  document.getElementById("navResultados").style.display = "flex";
  mostrarResultado("resA");

  // Recolectar todos los datos y calcular Liquidez
  const data = recolectarDatosFinancieros();
  mostrarResultadoLiquidez(data);
}

// ✅ Al cargar la página, mostrar la primera sección
document.addEventListener("DOMContentLoaded", () => {
  irASeccion("stepIngresos");
});
