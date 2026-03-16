function asignarEventos(){

document.getElementById("btnPath").addEventListener("click", sumaPath);
document.getElementById("btnQuery").addEventListener("click", sumaQuery);
document.getElementById("btnBody").addEventListener("click", sumaBody);

}
//Parametro PATH
function sumaPath(){

let a = document.getElementById("num1").value;
let b = document.getElementById("num2").value;

fetch(`http://localhost:3005/suma/${a}/${b}`)
.then(response => response.json())
.then(data=>{

document.getElementById("resultado").innerText =
"Resultado: " + data.resultado;

});

}
//Parametro QUERY
function sumaQuery(){

let a = document.getElementById("num1").value;
let b = document.getElementById("num2").value;

fetch(`http://localhost:3005/sumaQuery?a=${a}&b=${b}`)
.then(response => response.json())
.then(data=>{

document.getElementById("resultado").innerText =
"Resultado: "+data.resultado;

});

}
//Parametro BODY
function sumaBody(){

let a = document.getElementById("num1").value;
let b = document.getElementById("num2").value;

fetch("http://localhost:3005/sumaBody",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
a: Number(a),
b: Number(b)
})

})
.then(response => response.json())
.then(data=>{

document.getElementById("resultado").innerText =
"Resultado: "+data.resultado;

});

}