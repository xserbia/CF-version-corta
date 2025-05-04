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
  if (isNaN(valor) || valor < 0) {
    input.classList.add("shake");
    input.style.borderColor = "red";
    setTimeout(() => input.classList.remove("shake"), 300);
    return false;
  } else {
    input.style.borderColor = "#44008f";
    return true;
  }
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
    if (!validarCampo(input)) validos = false;
  });
  if (validos) document.getElementById(btnId).disabled = false;
}

// ✅ Navegación con validación
function validarAntesDeIrAGastos() {
  const campos = ["ingreso_bruto", "aporte_personal_retiro", "aporte_empleador_retiro", "otros_ahorros"];
  if (campos.every(id => validarCampo(document.getElementById(id)))) {
    irASeccion("stepGastos");
  }
}

function validarAntesDeIrAActivos() {
  const campos = ["pago_deudas", "gastos_diarios", "impuestos_anuales", "seguros_anuales"];
  if (campos.every(id => validarCampo(document.getElementById(id)))) {
    irASeccion("stepActivos");
  }
}

function validarAntesDeIrAPasivos() {
  const campos = ["efectivo_similar", "cuentas_inversion", "cuentas_retiro", "valor_propiedades", "otros_activos"];
  if (campos.every(id => validarCampo(document.getElementById(id)))) {
    irASeccion("stepPasivos");
  }
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

// ✅ Recolectar datos
function recolectarDatosFinancieros() {
  const data = {};
  document.querySelectorAll("input").forEach(input => {
    if (!input.name) return;
    const val = input.type === "checkbox" ? input.checked : parseFloat(input.value);
    data[input.name] = isNaN(val) ? 0 : val;
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

function iconoEndeudamiento(valor, tipo) {
  switch (tipo) {
    case "dti": return valor <= 30 ? "✅" : "🚨";
    case "deuda_activos": return valor <= 50 ? "✅" : "⚠️";
    case "deuda_patrimonio": return valor <= 50 ? "✅" : valor <= 100 ? "⚠️" : "🚨";
    default: return "";
  }
}

// ✅ Resultado de Liquidez
function mostrarResultadoLiquidez(data) {
  const ingreso = data.ingreso_bruto || 0;
  const ahorro = (data.aporte_personal_retiro || 0) + (data.aporte_empleador_retiro || 0) + (data.otros_ahorros || 0);
  const impuestos = data.impuestos_anuales || 0;
  const seguros = data.seguros_anuales || 0;
  const diarios = data.gastos_diarios || 0;
  const deuda = data.pago_deudas || 0;

  const gastoTotal = impuestos + seguros + diarios + deuda;
  const superavit = ingreso - gastoTotal - ahorro;
  const superavitPct = ingreso > 0 ? (superavit / ingreso) * 100 : 0;
  const reservaMeses = gastoTotal > 0 ? (data.efectivo_similar || 0) / (gastoTotal / 12) : 0;
  const razonCorriente = deuda > 0 ? (data.efectivo_similar || 0) / deuda : 0;
  const capacidad = ingreso > 0 ? ((ahorro + superavit) / ingreso) * 100 : 0;
  const tasaAhorro = ingreso > 0 ? (ahorro / ingreso) * 100 : 0;

  const html = `
    <h4>💧 Indicadores de Liquidez</h4>
    <table class="tabla-resultados">
      <thead>
        <tr>
          <th>Indicador</th>
          <th>Resultado</th>
          <th>Benchmark</th>
          <th>Explicación</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tasa de ahorro</td>
          <td>${tasaAhorro.toFixed(1)}% ${iconoLiquidez(tasaAhorro, "tasa_ahorro")}</td>
          <td>≥ 30% ✅ · 15%-29% ⚠️ · < 15% 🚨</td>
          <td>Porcentaje del ingreso que se destina al ahorro anual</td>
        </tr>
        <tr>
          <td>Superávit</td>
          <td>${superavitPct.toFixed(1)}% ${iconoLiquidez(superavitPct, "superavit")}</td>
          <td>< 0 🚨 · 0–15% ⚠️ · >15% ✅</td>
          <td>Diferencia entre ingreso y gastos (sin contar ahorro)</td>
        </tr>
        <tr>
          <td>Reserva de emergencia</td>
          <td>${reservaMeses.toFixed(1)} meses ${iconoLiquidez(reservaMeses, "reserva")}</td>
          <td>> 36 🔁 · 12–36 ✅ · 6–12 ⚠️ · < 6 🚨</td>
          <td>Meses de gastos cubiertos con efectivo disponible</td>
        </tr>
        <tr>
          <td>Razón corriente</td>
          <td>${razonCorriente.toFixed(2)} ${iconoLiquidez(razonCorriente, "razon")}</td>
          <td>> 1.00 ✅ · < 1.00 🚨</td>
          <td>Relación entre efectivo y deuda anual</td>
        </tr>
        <tr>
          <td>Capacidad de acumulación</td>
          <td>${capacidad.toFixed(1)}% ${iconoLiquidez(capacidad, "capacidad")}</td>
          <td>> 50% 🔁 · 15%-50% ✅ · 0%-15% ⚠️ · < 0% 🚨</td>
          <td>Suma de ahorro y superávit sobre ingreso anual</td>
        </tr>
      </tbody>
    </table>
  `;

  document.getElementById("resA").innerHTML = html;
}

// ✅ Resultado de Pasivos y Endeudamiento (sin línea de vivienda)
function mostrarResultadoPasivos() {
  const campos = [
    "deuda_tarjetas", "deuda_hipotecaria", "deuda_comercial",
    "deuda_vehiculos", "deuda_estudios", "deuda_otros"
  ];

  let validos = true;
  campos.forEach(id => {
    const input = document.getElementById(id);
    if (!validarCampo(input)) validos = false;
  });
  if (!validos) return;

  const data = recolectarDatosFinancieros();

  // 🅱️ Endeudamiento
  const ingreso = data.ingreso_bruto || 0;
  const deudaTotal = campos.reduce((sum, id) => sum + (data[id] || 0), 0);
  const activos = (data.efectivo_similar || 0) + (data.cuentas_inversion || 0) +
                  (data.cuentas_retiro || 0) + (data.valor_propiedades || 0) + (data.otros_activos || 0);
  const patrimonio = activos - deudaTotal;

  const dti = ingreso > 0 ? (deudaTotal / ingreso) * 100 : 0;
  const deudaActivos = activos > 0 ? (deudaTotal / activos) * 100 : 0;
  const deudaPatrimonio = patrimonio > 0 ? (deudaTotal / patrimonio) * 100 : 999;

  const htmlB = `
    <h4>🅱️ Indicadores de Endeudamiento</h4>
    <table class="tabla-resultados">
      <thead>
        <tr>
          <th>Indicador</th>
          <th>Resultado</th>
          <th>Benchmark</th>
          <th>Explicación</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>DTI / ingreso bruto</td>
          <td>${dti.toFixed(1)}% ${iconoEndeudamiento(dti, "dti")}</td>
          <td>≤ 30% ✅ · > 30% 🚨</td>
          <td>Porcentaje del ingreso bruto destinado a todas las deudas</td>
        </tr>
        <tr>
          <td>Deuda / activos totales</td>
          <td>${deudaActivos.toFixed(1)}% ${iconoEndeudamiento(deudaActivos, "deuda_activos")}</td>
          <td>≤ 50% ✅ · > 50% ⚠️</td>
          <td>Proporción de deuda total sobre activos</td>
        </tr>
        <tr>
          <td>Deuda / patrimonio neto</td>
          <td>${deudaPatrimonio.toFixed(1)}% ${iconoEndeudamiento(deudaPatrimonio, "deuda_patrimonio")}</td>
          <td>≤ 50% ✅ · 51–100% ⚠️ · > 100% 🚨</td>
          <td>Proporción de deuda total sobre patrimonio</td>
        </tr>
      </tbody>
    </table>
  `;

  document.getElementById("resB").innerHTML = htmlB;
  document.getElementById("resultadosContainer").style.display = "block";
  document.getElementById("navResultados").style.display = "flex";
  mostrarResultado("resB");
  mostrarResultadoLiquidez(data);
  mostrarResultadoPatrimonio(data)
}
function mostrarResultadoPatrimonio(data) {
  const activos = (
    data.efectivo_similar +
    data.cuentas_inversion +
    data.cuentas_retiro +
    data.valor_propiedades +
    data.otros_activos
  );

  const pasivos = (
    data.deuda_tarjetas +
    data.deuda_hipotecaria +
    data.deuda_comercial +
    data.deuda_vehiculos +
    data.deuda_estudios +
    data.deuda_otros
  );

  const patrimonio = activos - pasivos;

  const relacionActivos = activos > 0 ? (patrimonio / activos) * 100 : 0;
  const relacionPasivos = pasivos > 0 ? (patrimonio / pasivos) * 100 : 999;

  // Benchmarks patrimonio absoluto
  const edad = data.edad || 0;
  const ingreso = data.ingreso_bruto || 0;

  const multiplicadores = {
    25: [2.5, 5],
    30: [3, 6],
    35: [3.5, 7],
    40: [4, 8],
    45: [4.5, 9],
    50: [5, 10],
    55: [5.5, 11],
    60: [6, 12],
    65: [6.5, 13],
    70: [7, 14],
  };

  const edadClave = Object.keys(multiplicadores).reduce((prev, curr) => {
    return Math.abs(curr - edad) < Math.abs(prev - edad) ? curr : prev;
  }, 25);

  const [multiploGood, multiploGreat] = multiplicadores[edadClave];
  const valorGood = ingreso * multiploGood;
  const valorGreat = ingreso * multiploGreat;

  let iconoPatrimonio;
  if (patrimonio >= valorGreat) iconoPatrimonio = "⭐";
  else if (patrimonio >= valorGood) iconoPatrimonio = "✅";
  else if (patrimonio >= valorGood * 0.8) iconoPatrimonio = "⚠️";
  else iconoPatrimonio = "🚨";

  const iconoRelActivo = relacionActivos >= 70 ? "✅" : relacionActivos >= 50 ? "⚠️" : "🚨";
  const iconoRelPasivo = relacionPasivos >= 200 ? "✅" : relacionPasivos >= 100 ? "⚠️" : "🚨";

  const html = `
    <h4>🅲 Indicadores de Patrimonio Neto</h4>
    <table class="tabla-resultados">
      <thead>
        <tr>
          <th>Indicador</th>
          <th>Resultado</th>
          <th>Benchmark</th>
          <th>Explicación</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Relación patrimonio / activos</td>
          <td>${relacionActivos.toFixed(1)}% ${iconoRelActivo}</td>
          <td>≥ 70% ✅ · 50%-69% ⚠️ · < 50% 🚨</td>
          <td>Qué proporción de tus activos no tiene deuda</td>
        </tr>
        <tr>
          <td>Relación patrimonio / pasivos</td>
          <td>${relacionPasivos.toFixed(1)}% ${iconoRelPasivo}</td>
          <td>≥ 200% ✅ · 100%-199% ⚠️ · < 100% 🚨</td>
          <td>Capacidad para cubrir deudas con tu patrimonio</td>
        </tr>
        <tr>
          <td>Patrimonio neto absoluto</td>
          <td>$${patrimonio.toLocaleString()} ${iconoPatrimonio}</td>
          <td>${edadClave} años: Good $${valorGood.toLocaleString()} ✅ · Great $${valorGreat.toLocaleString()} ⭐</td>
          <td>Tu patrimonio comparado con personas de tu edad</td>
        </tr>
      </tbody>
    </table>
  `;

  document.getElementById("resC").innerHTML = html;
}

// ✅ Al cargar
document.addEventListener("DOMContentLoaded", () => {
  irASeccion("stepIngresos");
});
