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

    // PATH
    if (tipo === "path") {
        url = `${BASE_URL}/${operacion}/${a}/${b}`;
    }

    // QUERY
    else if (tipo === "query") {
        url = `${BASE_URL}/${operacion}Query?a=${a}&b=${b}`;
    }

    // BODY
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

    fetch(url, opciones)
        .then(async res => {
            const data = await res.json();

            if (!res.ok) {
                return { error: data.error || "Error del servidor" };
            }

            return data;
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
        .catch(() => {
            loading.style.display = "none";
            botones.forEach(btn => btn.disabled = false);
            resultado.innerText = "❌ Error de conexión con el servidor";
        });
}

// limpiar
function limpiar() {
    document.getElementById("num1").value = "";
    document.getElementById("num2").value = "";
    document.getElementById("resultado").innerText = "Resultado: --";
    document.getElementById("loading").style.display = "none";
}

// 🔥 hacer funciones globales
window.calcular = calcular;
window.limpiar = limpiar;