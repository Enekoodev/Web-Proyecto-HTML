var w,h,ctx,canvas;
var pala1, pala2, pilota;
var id;

window.onload=Game();

function Game() {
    canvas = document.getElementById("game");
    w = canvas.width;
    h = canvas.height;
    pala1={x:20, y:(h/2)-14, score:0};
	pala2={x:w-20, y:(h/2)-14, score:0};
	pilota={x:100, y:100, dx:1, dy:1, mida:4};
    
    ctx = canvas.getContext("2d");
    ctx.font = '15pt Calibri';
    ctx.fillStyle = "white";
    actualitza();
    document.addEventListener("keydown",escoltar,false);
    id = requestAnimationFrame(actualitza);
}
function pintarPista(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(w/2, 0, 2, h);
}
function pintarPala(pala) {
    ctx.fillRect(pala.x,pala.y, 2, 28);
}
function pintarPilota(p){
	ctx.save();
	ctx.fillStyle="red";
    ctx.fillRect(p.x, p.y, p.mida, p.mida);
	ctx.restore();
}
function actualitzaPilota(){
	pilota.x = pilota.x+pilota.dx;
    pilota.y = pilota.y+pilota.dy;
	
	if ((pilota.x<=23 && pilota.y>pala1.y && pilota.y<(pala1.y+28))||(pilota.x>=w-20 && pilota.y>pala2.y && pilota.y<(pala2.y+28))){
	     pilota.dx=-pilota.dx;
	}
	else if (pilota.x >= w) {
			pilota.dx=-pilota.dx;
			pala1.score++;
			}
			else if (pilota.x <= 0){
				pilota.dx=-pilota.dx;
				pala2.score++;
			}
			if (pilota.y >= h || pilota.y <= 0) {
				pilota.dy=-pilota.dy;
			
			}
    		pintarPilota(pilota);	
}
function actualitzaMarcador(){
	ctx.fillText(pala1.score+"   "+pala2.score, (w/2)-16, 50);
	
}
function actualitza(timeStamp){
	ctx.clearRect(0, 0, w, h);
	pintarPista();
	pintarPala(pala1);
	pintarPala(pala2);
	actualitzaPilota();
	actualitzaMarcador();
	id = requestAnimationFrame(actualitza);
}
//TECLAS TECLADO//
function escoltar(e){
	
	if(e.keyCode==40){
		pala2.y+=+10;
	}
	else if(e.keyCode==38){
		pala2.y+=-10;
	}
	if(e.keyCode==65){
		pala1.y+=-10;
	}
	else if(e.keyCode==90){
		pala1.y+=+10;
	}	
}