//Se importa el modulo http para crear un servidor en Node.js.
import {createServer} from 'node:http';
// Se crea el servidor, cada vez que un cliente hace una peticion (req) y el servidor responde (res)
//con el Arrow Fuction (=>) se define la logica de manejo de las peticiones y respuestas del servidor. 
const server = createServer ((req, res) =>{
//Se definen las cabeceras HTTP de la respuesta
    const headers = {
        'Content-Type': 'application/json',// omite los otros encabezados.
        //content-type indica que el cuerpo de la respuesta es un JSON, lo que permite a los clientes
        //interpretar correctamente los datos recibidos.
        'Access-Control-Allow-Origin': '*', // permite a cualquier dominio consumir el microservicio
    };
    /*
    Si el metodo de la peticion es OPTIONS, se responde con los encabezados necesarios para permitir el acceso
    desde cualquier origen, y se termina la respuesta sin procesar mas logica.
    El navegador antes de enviar una peticion POST, envia una peticion especial Llamada OPTIONS 
    para verificar si el servidor permite la peticion POST desde el origen del cliente.
    */
    if (req.method === "OPTIONS") {
    //Responde con estatus 200 ok y los encabezados necesarios para permitir el acceso desde cualquier origen.
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",// cualquier dominio puede consumir el microservicio
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",// metodos permitidos para las peticiones
        "Access-Control-Allow-Headers": "Content-Type" //permite enviar json en el body de la peticion
    });

    res.end(); // termina la respuesta
    return;// evita que el servidor siga ejecutando codigo.
}
    //se crea un objeto url para analizar la peticion
    const url = new URL(req.url, `http://${req.headers.host}`);// variable que contiene la direccion del servidor

    const pathname = url.pathname;//indica la ruta especifica o la ubicacion del recurso dentro del servidor 

//RUTA RAIZ
if (pathname === "/") {
    res.writeHead(200, headers);
    res.end(JSON.stringify({
        mensaje: "Microservicio calculadora funcionando",
        endpoints: [
            "/suma/:a/:b",
            "/sumaQuery?a=&b=",
            "/sumaBody (POST)"
        ]
    }));
}

    //Parametros PATH
    else if (pathname.startsWith('/suma/')) {// verifica si la ruta de la peticion comienza con /suma/

        let a = Number(pathname.split('/')[2]);//divide la url en / y obtiene el valor de la posicion del arreglo
        let b = Number(pathname.split('/')[3]);//divide la url en / y obtiene el valor de la posicion del arreglo

        let resultado = a + b;// se crea la variable resultado que almacena la suma de a y b

        res.writeHead(200, headers); // responde con estatus 200 ok y los encabezados definidos anteriormente
        res.end(JSON.stringify({resultado}));//conveirte la respuesta final en un JSON
    }
    // Parametros QUERY
    else if (pathname === '/sumaQuery') {// verifica si la ruta de la peticion es estrictamente /sumaQuery

        let a = Number(url.searchParams.get('a'));//searchParams es un objeto que se encarga de procesar la busqueda de parametros o filtros
        let b = Number(url.searchParams.get('b'));//son los datos que parecen despues del ?, obtiene el valor del query param a yb

        let resultado = a + b;// se crea la variable resultado que almacena la suma de a y b

        res.writeHead(200, headers);// responde con estatus 200 ok y los encabezados definidos anteriormente
        res.end(JSON.stringify({resultado}));//conveirte la respuesta final en un JSON
    }
    // Parametros BODY recibe datos dentro del cuerpo de la peticion
        else if (pathname === '/sumaBody') {// verifica si la ruta de la peticion es estrictamente /sumaBody
            console.log("Entro al endpoint BODY");// se muestra un mensaje en la consola indicando que se ha accedido al endpoint
            let body = "";// se crea una variable vacia para almacenar el cuerpo de la peticion

            req.on('data', chunk => {// chunk es un fragmento de datos que se recibe del cuerpo de la peticion
                body += chunk.toString();// cada fragmento se convierte en String y lo concatena
        });
            req.on('end', () => {// fin de la recepcion de datos
                console.log("Body recibido:", body);//imprime el body recibido en consola
                if (body) {
                    let datos = JSON.parse(body);//convierte el texto json en objeto de JavaScript y lo almacena en la variable datos

                    let resultado = datos.a + datos.b;// se crea la variable resultado que almacena la suma de a y b

                    res.writeHead(200, headers);// responde con estatus 200 ok y los encabezados definidos anteriormente
                    res.end(JSON.stringify({resultado}));//envia la respuesta final en un JSON, convirtiendo el objeto en json
                }

            });
        }
});

const PORT = process.env.PORT || 3006;

server.listen(PORT, () => {
    console.log("Servidor corriendo en puerto", PORT);
});
