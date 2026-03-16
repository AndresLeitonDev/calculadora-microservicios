console.log("JS cargado correctamente");

document.getElementById("btnPath").addEventListener("click", sumaPath);
document.getElementById("btnQuery").addEventListener("click", sumaQuery);
document.getElementById("btnBody").addEventListener("click", sumaBody);


// PATH PARAM
function sumaPath(){

let a = document.getElementById("num1").value;
let b = document.getElementById("num2").value;

console.log("Click PATH");

fetch(`https://calculadora-microservicios.onrender.com/suma/${a}/${b}`)
.then(res => res.json())
.then(data => {

document.getElementById("resultado").innerText =
"Resultado: " + data.resultado;

})
.catch(error => console.error(error));

}


// QUERY PARAM
function sumaQuery(){

let a = document.getElementById("num1").value;
let b = document.getElementById("num2").value;

console.log("Click QUERY");

fetch(`https://calculadora-microservicios.onrender.com/sumaQuery?a=${a}&b=${b}`)
.then(res => res.json())
.then(data => {

document.getElementById("resultado").innerText =
"Resultado: " + data.resultado;

})
.catch(error => console.error(error));

}


// BODY PARAM
function sumaBody(){

let a = document.getElementById("num1").value;
let b = document.getElementById("num2").value;

console.log("Click BODY");

fetch("https://calculadora-microservicios.onrender.com/sumaBody",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
a: Number(a),
b: Number(b)
})

})
.then(res => res.json())
.then(data => {

document.getElementById("resultado").innerText =
"Resultado: " + data.resultado;

})
.catch(error => console.error(error));

}