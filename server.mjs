// Se importa el modulo http para crear un servidor en Node.js.
import { createServer } from 'node:http';
// Se crea el servidor, cada vez que un cliente hace una petición (req)
// y el servidor responde (res)
const server = createServer((req, res) => {
// Cabeceras HTTP de la respuesta
const headers = {
'Content-Type': 'application/json', // indica que la respuesta será JSON
'Access-Control-Allow-Origin': '*', // permite que cualquier dominio consuma la API
};
/*
Manejo de CORS (preflight)
El navegador antes de enviar una petición POST, envía una petición OPTIONS
para verificar si el servidor permite la petición desde otro origen.
*/  
if (req.method === "OPTIONS") {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*", // permite cualquier origen
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // métodos permitidos
        "Access-Control-Allow-Headers": "Content-Type" // permite enviar JSON en el body
    });

    return res.end(); // termina la respuesta y evita que siga ejecutando código
}

//Se crea un objeto URL para analizar la petición
const url = new URL(req.url, `http://${req.headers.host}`);

//Se obtiene la ruta (endpoint)
const pathname = url.pathname;

console.log("Endpoint recibido:", pathname);

//Ignorar solicitud automática del navegador (favicon)
if (pathname === "/favicon.ico") {
    return res.end();
}

//RUTA RAÍZ
//Muestra información del microservicio
if (pathname === "/") {
    res.writeHead(200, headers);
    return res.end(JSON.stringify({
        mensaje: "Microservicio calculadora funcionando",
        endpoints: [
            "/suma/:a/:b",
            "/resta/:a/:b",
            "/multiplicacion/:a/:b",
            "/division/:a/:b",
            "/sumaQuery?a=&b=",
            "/sumaBody (POST)"
        ]
    }));
}

//PARÁMETROS PATH (TODAS LAS OPERACIONES)
//Ejemplo: /suma/5/7
else if (
    pathname.startsWith('/suma/') ||
    pathname.startsWith('/resta/') ||
    pathname.startsWith('/multiplicacion/') ||
    pathname.startsWith('/division/')
) {

    //Se divide la ruta en partes usando "/"
    let partes = pathname.split('/');

    //Se identifica la operación (suma, resta, etc.)
    let operacion = partes[1];

    //Se obtienen los valores y se convierten a número
    let a = Number(partes[2]);
    let b = Number(partes[3]);

    let resultadoOperacion;

    //Validación de datos
    if (isNaN(a) || isNaN(b)) {
        return res.end(JSON.stringify({ error: "Datos invalidos" }));
    }

    //Lógica de operaciones
    if (operacion === 'suma') {
        resultadoOperacion = a + b;
    } else if (operacion === 'resta') {
        resultadoOperacion = a - b;
    } else if (operacion === 'multiplicacion') {
        resultadoOperacion = a * b;
    } else if (operacion === 'division') {
        if (b === 0) {
            return res.end(JSON.stringify({ error: "No se puede dividir por cero" }));
        }
        resultadoOperacion = a / b;
    }

    //Respuesta al cliente
    res.writeHead(200, headers);
    return res.end(JSON.stringify({
        operacion,
        a,
        b,
        resultado: resultadoOperacion
    }));
}

//PARÁMETROS QUERY (TODAS LAS OPERCIONES)
//Ejemplo: /sumaQuery?a=5&b=7
//sumaQuery?a=5&b=7
//restaQuery?a=5&b=7
//multiplicacionQuery?a=5&b=7
//divisionQuery?a=5&b=7
else if (
    pathname === '/sumaQuery' ||
    pathname === '/restaQuery' ||
    pathname === '/multiplicacionQuery' ||
    pathname === '/divisionQuery'
) {

    //Se obtiene la operacion desde el endpoint
    let operacion = pathname.replace('Query', '').replace('/', '');

    // Se obtienen los valores desde la URL
    let a = Number(url.searchParams.get('a'));
    let b = Number(url.searchParams.get('b'));

    // Validación
    if (isNaN(a) || isNaN(b)) {
        return res.end(JSON.stringify({ error: "Datos invalidos" }));
    }

    let resultado;
    
    //Lógica de operaciones
    if (operacion === 'suma') {
        resultado = a + b;
    } else if (operacion === 'resta') {
        resultado = a - b;
    } else if (operacion === 'multiplicacion') {
        resultado = a * b;
    } else if (operacion === 'division') {
        if (b === 0) {
            return res.end(JSON.stringify({ error: "No se puede dividir por cero" }));
        }
        resultado = a / b;
    }
    res.writeHead(200, headers);
    return res.end(JSON.stringify({ operacion, a, b, resultado }));
}

//PARÁMETROS BODY (PARA TODAS LAS OPERACIONES)
/*Ejemplo: POST /sumaBody con JSON en el body:
/restaBody
/multiplicacionBody
/divisionBody*/

else if (
    pathname === '/sumaBody' ||
    pathname === '/restaBody' ||
    pathname === '/multiplicacionBody' ||
    pathname === '/divisionBody'
) {
    console.log("Entro al endpoint BODY");

    let body = "";

    //Se reciben los datos en fragmentos (chunks)
    req.on('data', chunk => {
        body += chunk.toString();
    });

    //Cuando termina de recibir los datos
    req.on('end', () => {
        try {
            console.log("Body crudo:", body);
            console.log("Body recibido:", body);

            //Se convierte el JSON a objeto JS
            let datos = JSON.parse(body);

            let operacion = pathname.replace('Body', '').replace('/', '');

            let a = Number(datos.a);
            let b = Number(datos.b);

            //Validación
            if (isNaN(a) || isNaN(b)) {
                return res.end(JSON.stringify({ error: "Datos invalidos" }));
            }

            let resultado;

            //Lógica de operaciones
            if (operacion === 'suma') {
                resultado = a + b;
            } else if (operacion === 'resta') {
                resultado = a - b;
            } else if (operacion === 'multiplicacion') {
                resultado = a * b;
            } else if (operacion === 'division') {
                if (b === 0) {
                    return res.end(JSON.stringify({ error: "No se puede dividir por cero" }));
                }
                resultado = a / b;
            }

            res.writeHead(200, headers);
            return res.end(JSON.stringify({ operacion, a, b, resultado }));

        } catch (error) {
            //Error si el JSON está mal formado
            return res.end(JSON.stringify({ error: "JSON invalido" }));
        }
    });

    return; //importante para no continuar ejecutando código
}

//RUTA NO VÁLIDA

res.writeHead(404, headers);
return res.end(JSON.stringify({ error: "Ruta no válida" }));

});

//Puerto dinámico para Render
const PORT = process.env.PORT || 3006;

//Se inicia el servidor
server.listen(PORT, () => {
console.log("Servidor corriendo en puerto", PORT);
});