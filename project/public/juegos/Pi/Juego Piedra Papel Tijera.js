// Puntos iniciales del jugador y de la CPU
var puntosJ = 0, puntosM = 0; 

// Opción que se llama al clicar en los botones del juego
function opcion(humano){

	var resultado_texto = ["Empatas","Ganas","Pierdes"];
	var nombre = ["Piedra","Papel","Tijeras","Lagarto","Spock"];

	// Matriz que determina si gana pierde o empata, primero CPU después jugador
	var jugada = [
		[0,1,2,2,1],
		[2,0,1,1,2],
		[1,2,0,2,1],
		[1,2,1,0,2],
		[2,1,2,1,0]
	]

	// Una matriz igual que la anterior pero mostrando directamente un mensaje
	var jugada_desc = [
		["Iguales","Papel tapa a piedra","Piedra rompe tijeras","Piedra aplasta lagarto","Spock vaporiza piedra"],
		["Papel tapa piedra","Iguales","tijeras cortan papel","lagarto devora papel","Papel desautoriza a Spock"],
		["Piedra rompe tijeras","Tijeras cortan papel","Iguales","Tijeras decapitan lagarto","Spock rompe tijeras"],
		["Piedra aplasta lagarto","Lagarto devora papel","Tijeras decapitan lagarto","Iguales","Lagarto envenena a Spock"],
		["Spock vaporiza piedra","Papel desautoriza a Spock","Spock rompe tijeras","Lagarto envenena a Spock","Iguales"]
	]

	// La CPU selecciona una opción
	var cpu = Math.floor(Math.random()*5);

	// Devuelve 0, 1 o 2 dependiendo de si gana pierde o empata el jugador
	var resultado = jugada[cpu][humano];

	// Devuelve un mensaje u otro dependiendo de lo que se juegue
	var resultado_desc = jugada_desc[cpu][humano];

	// Dependiendo de lo que salga en la matriz resultado, le sumo puntos a un jugador u otro. 
	switch(resultado){
		case 0: /* No se hace nada */ break; 
		case 1: puntosJ++; break; // El jugador gana puntos
		case 2: puntosM++; break; // La máquina gana puntos
	}

	// Imprimo por pantalla los valores que necesito, imágenes y puntuaciones
	var usuario = document.getElementById("jugador").innerHTML="<img src='./"+dameImagen(humano)+"'>";
	var ordenador = document.getElementById("maquina").innerHTML="<img src='./"+dameImagen(cpu)+"'>";
	var ordenador = document.getElementById("puntosJ").innerHTML=puntosJ;
	var ordenador = document.getElementById("puntosM").innerHTML=puntosM;
	var result = document.getElementById("resultado").innerHTML=resultado_desc;
}

// Esta función, dependiendo de la opción seleccionada, devuelve una imagen u otra. 
// Será la imagen que se muestre al seleccionar una opción.
function dameImagen(opcion){
	var imagenes = ["piedra.png","papel.png","tijeras.png","lagarto.png","spock.png"]
	return imagenes[opcion];
}