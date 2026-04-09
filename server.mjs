import { createServer } from 'node:http';

const server = createServer((req, res) => {

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (req.method === "OPTIONS") {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === "/favicon.ico") {
        return res.end();
    }

    // ROOT
    if (pathname === "/") {
        res.writeHead(200, headers);
        return res.end(JSON.stringify({
            mensaje: "Microservicio calculadora funcionando"
        }));
    }

    // PATH
    if (
        pathname.startsWith('/suma/') ||
        pathname.startsWith('/resta/') ||
        pathname.startsWith('/multiplicacion/') ||
        pathname.startsWith('/division/')
    ) {
        let partes = pathname.split('/');
        let operacion = partes[1];
        let a = Number(partes[2]);
        let b = Number(partes[3]);

        if (isNaN(a) || isNaN(b)) {
            res.writeHead(400, headers);
            return res.end(JSON.stringify({ error: "Datos invalidos" }));
        }

        let resultado;

        if (operacion === 'suma') resultado = a + b;
        if (operacion === 'resta') resultado = a - b;
        if (operacion === 'multiplicacion') resultado = a * b;
        if (operacion === 'division') {
            if (b === 0) {
                res.writeHead(400, headers);
                return res.end(JSON.stringify({ error: "No se puede dividir por cero" }));
            }
            resultado = a / b;
        }

        res.writeHead(200, headers);
        return res.end(JSON.stringify({ operacion, a, b, resultado }));
    }

    // QUERY
    if (
        pathname === '/sumaQuery' ||
        pathname === '/restaQuery' ||
        pathname === '/multiplicacionQuery' ||
        pathname === '/divisionQuery'
    ) {
        let operacion = pathname.replace('Query', '').replace('/', '');
        let a = Number(url.searchParams.get('a'));
        let b = Number(url.searchParams.get('b'));

        if (isNaN(a) || isNaN(b)) {
            res.writeHead(400, headers);
            return res.end(JSON.stringify({ error: "Datos invalidos" }));
        }

        let resultado;

        if (operacion === 'suma') resultado = a + b;
        if (operacion === 'resta') resultado = a - b;
        if (operacion === 'multiplicacion') resultado = a * b;
        if (operacion === 'division') {
            if (b === 0) {
                res.writeHead(400, headers);
                return res.end(JSON.stringify({ error: "No se puede dividir por cero" }));
            }
            resultado = a / b;
        }

        res.writeHead(200, headers);
        return res.end(JSON.stringify({ operacion, a, b, resultado }));
    }

    // BODY
    if (
        pathname === '/sumaBody' ||
        pathname === '/restaBody' ||
        pathname === '/multiplicacionBody' ||
        pathname === '/divisionBody'
    ) {

        let body = "";

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {
                let datos = JSON.parse(body);

                let operacion = pathname.replace('Body', '').replace('/', '');

                let a = Number(datos.a);
                let b = Number(datos.b);

                if (isNaN(a) || isNaN(b)) {
                    res.writeHead(400, headers);
                    return res.end(JSON.stringify({ error: "Datos invalidos" }));
                }

                let resultado;

                if (operacion === 'suma') resultado = a + b;
                if (operacion === 'resta') resultado = a - b;
                if (operacion === 'multiplicacion') resultado = a * b;
                if (operacion === 'division') {
                    if (b === 0) {
                        res.writeHead(400, headers);
                        return res.end(JSON.stringify({ error: "No se puede dividir por cero" }));
                    }
                    resultado = a / b;
                }

                res.writeHead(200, headers);
                return res.end(JSON.stringify({ operacion, a, b, resultado }));

            } catch {
                return res.end(JSON.stringify({ error: "JSON invalido" }));
            }
        });

        return;
    }

    res.writeHead(404, headers);
    return res.end(JSON.stringify({ error: "Ruta no válida" }));
});

const PORT = process.env.PORT || 3006;

server.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});