console.log("JS cargado correctamente");

const BASE_URL = "https://calculadora-microservicios.onrender.com";

function calcular(operacion) {

const a = document.getElementById("num1").value;
const b = document.getElementById("num2").value;
const tipo = document.getElementById("tipo").value;

const loading = document.getElementById("loading");
const resultado = document.getElementById("resultado");
const botones = document.querySelectorAll("button");

if (a === "" || b === "") {
    resultado.innerText = "⚠️ Ingresa ambos números";
    return;
}

let url = "";
let opciones = {};

loading.style.display = "block";
resultado.innerText = "Resultado: ...";
botones.forEach(btn => btn.disabled = true);

// =========================
// PATH
// =========================
if (tipo === "path") {
    url = `${BASE_URL}/${operacion}/${a}/${b}`;
}

// =========================
// QUERY
// =========================
else if (tipo === "query") {
    url = `${BASE_URL}/${operacion}Query?a=${a}&b=${b}`;
}

// =========================
// BODY
// =========================
else if (tipo === "body") {
    url = `${BASE_URL}/${operacion}Body`;

    opciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            a: Number(a),
            b: Number(b)
        })
    };
}

console.log("Operacion:", operacion);
console.log("Tipo:", tipo);
console.log("URL generada:", url);

fetch(url, opciones)
    .then(res => {
        if (!res.ok) throw new Error("Error en servidor");
        return res.json();
    })
    .then(data => {

        loading.style.display = "none";
        botones.forEach(btn => btn.disabled = false);

        if (data.error) {
            resultado.innerText = "❌ " + data.error;
        } else {
            resultado.innerText = `Resultado: ${data.resultado}`;
        }

    })
    .catch(error => {

        loading.style.display = "none";
        botones.forEach(btn => btn.disabled = false);

        console.error(error);
        resultado.innerText = "❌ Error conectando al servidor";

    });

}

// Función limpiar
function limpiar() {
document.getElementById("num1").value = "";
document.getElementById("num2").value = "";
document.getElementById("resultado").innerText = "Resultado: --";
document.getElementById("loading").style.display = "none";
}
