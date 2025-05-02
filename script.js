// --- script.js completo ---

// ✅ Navegar entre secciones del formulario
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

// ✅ Validación visual individual
function validarCampo(input) {
  const valor = parseFloat(input.value);
  input.style.borderColor = isNaN(valor) || valor < 0 ? "red" : "#44008f";
}

// ✅ Validaciones por sección
function validarIngresoYActivarGastos() {
  const campos = ["ingreso_bruto", "aporte_personal_retiro", "aporte_empleador_retiro", "otros_ahorros"];
  validarYActivarBoton(campos, "btnGastos");
}

function validarGastosYActivarActivos() {
  const campos = ["pago_deudas", "gastos_diarios", "impuestos_anuales", "seguros_anuales"];
  validarYActivarBoton(campos, "btnActivos");
}

function validarActivosYActivarPasivos() {
  const campos = ["efectivo_similar", "cuentas_inversion", "cuentas_retiro", "valor_propiedades", "otros_activos"];
  validarYActivarBoton(campos, "btnPasivos");
}

function validarYActivarBoton(campos, btnId) {
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
  if (validos) document.getElementById(btnId).disabled = false;
}

// ✅ Mostrar resultado por pestañas
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

// ✅ Iconos benchmark
function iconoLiquidez(valor, tipo) {
  switch (tipo) {
    case "tasa_ahorro": return valor >= 30 ? "✅" : valor >= 15 ? "⚠️" : "🚨";
    case "superavit": return valor < 0 ? "🚨" : valor <= 15 ? "⚠️" : "✅";
    case "reserva": return valor > 36 ? "🔁" : valor >= 12 ? "✅" : valor >= 6 ? "⚠️" : "🚨";
    case "razon": return valor >= 1 ? "✅" : "🚨";
    case "capacidad": return valor > 50 ? "🔁" : valor >= 15 ? "✅" : valor >= 0 ? "⚠️" : "🚨";
    default: return "";
  }
}

// ✅ Mostrar resultado de Liquidez
function mostrarResultadoLiquidez(data) {
  const ingresoAnual = data.ingreso_bruto || 0;
  const ahorroAnual = (data.aporte_personal_retiro || 0) + (data.aporte_empleador_retiro || 0) + (data.otros_ahorros || 0);
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

  document.getElementById("liquidez_tasa_ahorro").innerHTML = tasaAhorro.toFixed(1) + "% " + iconoLiquidez(tasaAhorro, "tasa_ahorro");
  document.getElementById("liquidez_superavit").innerHTML = superavitPorcentaje.toFixed(1) + "% " + iconoLiquidez(superavitPorcentaje, "superavit");
  document.getElementById("liquidez_reserva").innerHTML = mesesReserva.toFixed(1) + " meses " + iconoLiquidez(mesesReserva, "reserva");
  document.getElementById("liquidez_razon_corriente").innerHTML = razonCorriente.toFixed(2) + " " + iconoLiquidez(razonCorriente, "razon");
  document.getElementById("liquidez_capacidad").innerHTML = capacidad.toFixed(1) + "% " + iconoLiquidez(capacidad, "capacidad");

  document.getElementById("resultadosContainer").style.display = "block";
  document.getElementById("navResultados").style.display = "flex";
  mostrarResultado("resA");
}

// ✅ Mostrar resultado de Pasivos
function mostrarResultadoPasivos() {
  const campos = [
    "deuda_tarjetas", "deuda_hipotecaria", "deuda_comercial",
    "deuda_vehiculos", "deuda_estudios", "deuda_otros"
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

  const data = recolectarDatosFinancieros();

  const html = `
    <h4>📉 Deudas Totales</h4>
    <p><strong>Tarjetas de crédito:</strong> $${data.deuda_tarjetas.toLocaleString()}</p>
    <p><strong>Hipoteca:</strong> $${data.deuda_hipotecaria.toLocaleString()}</p>
    <p><strong>Deuda comercial:</strong> $${data.deuda_comercial.toLocaleString()}</p>
    <p><strong>Vehículos:</strong> $${data.deuda_vehiculos.toLocaleString()}</p>
    <p><strong>Estudios:</strong> $${data.deuda_estudios.toLocaleString()}</p>
    <p><strong>Otras deudas:</strong> $${data.deuda_otros.toLocaleString()}</p>
    <p><strong>Total pasivos:</strong> $${(
      data.deuda_tarjetas +
      data.deuda_hipotecaria +
      data.deuda_comercial +
      data.deuda_vehiculos +
      data.deuda_estudios +
      data.deuda_otros
    ).toLocaleString()}</p>
  `;

  document.getElementById("resD").innerHTML = html;
  document.getElementById("resultadosContainer").style.display = "block";
  mostrarResultado("resD");

  mostrarResultadoLiquidez(data);
}

// ✅ Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  irASeccion("stepIngresos");
});
