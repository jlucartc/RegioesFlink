// ---- Inicializando mapa ----

var poligonos = []
var currentPolygon = 'polygon'
var currentPolygonPoints = []
var counter = 1

var layer = new L.StamenTileLayer("toner");
var map = new L.Map("mapid", {
    center: new L.LatLng(-3.747268,-38.575144),
    zoom: 14
});
map.addLayer(layer);


L.control.scale({position :'topleft'}).addTo(map);

// ---- Inicializando mapa FIM ----


// ---- Inicializando botoes ----

var settingRegiao = false
var settingPonto = false

var adicionarRegiao = document.getElementById('addRgn')
var adicionarPonto = document.getElementById('addPnt')
var salvar = document.getElementById('saveBtn')
var resetar = document.getElementById('resetBtn')
var cancelar = document.getElementById('cancelBtn')

salvar.style.visibility = 'hidden'
resetar.style.visibility = 'hidden'
cancelar.style.visibility = 'hidden'

adicionarRegiao.onclick = startAddRegiao
adicionarPonto.onclick = startAddPonto
salvar.onclick = saveData
resetar.onclick = sendAlert
cancelar.onclick = cancelData

function sendAlert(e){

  alert("sending alert...")

}

function beginInsertion(type){

  if(type == "ponto"){

    settingRegiao = false
    settingPonto = true

    /* save data */

  }else if(type == "regiao"){

    settingPonto = false
    settingRegiao = true

    /* save data */

  }

  salvar.style.visibility = 'visible'
  resetar.style.visibility = 'visible'
  cancelar.style.visibility = 'visible'

  adicionarRegiao.disabled = true
  adicionarPonto.disabled = true

}

function endInsertion(){

  if(settingPonto){

    settingRegiao = false
    settingPonto = false

    /* save data */

  }else if(settingRegiao){

    settingPonto = false
    settingRegiao = false

    /* save data */

  }

  salvar.style.visibility = 'hidden'
  resetar.style.visibility = 'hidden'
  cancelar.style.visibility = 'hidden'

  adicionarRegiao.disabled = false
  adicionarPonto.disabled = false


}

function startAddRegiao(e){ beginInsertion("regiao") }
function startAddPonto(e){ beginInsertion("ponto") }
function saveData(e){ endInsertion() }
function resetData(e){}
function cancelData(e){ endInsertion() }

// ---- Inicializando botoes : FIM ----

function addMarker(e){

	var newMarker = L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
	//newMarker.bindTooltip(e.latlng.lat+","+e.latlng.lng).openTooltip();
	newMarker.bindTooltip(counter.toString()).openTooltip();
	counter = counter + 1
	if(currentPolygon == 'polygon'){

		currentPolygonPoints.push(e.latlng);
		currentPolygon = L.polygon(currentPolygonPoints, {color: 'red'}).addTo(map);



	}else{

		currentPolygon.removeFrom(map);
		currentPolygonPoints.push(e.latlng);
		currentPolygon = L.polygon(currentPolygonPoints, {color: 'red'}).addTo(map);

	}

}

function alertPolygon(){

	alert(this.currentPolygon)

}

map.on('click',addMarker.bind(this));


/* Modifica o callback do evento de click, permitindo a adição de novos pontos no mapa */
function startPolygonMarking(){

	map.on('click',alertPolygon.bind(this))

}


/* Modifica o callback do evento click, encerrando a adição de novos pontos no mapa.
   Também adiciona o polígono criado na estrutura de armazenamento para que seja exportado futuramente.
*/
function stopPolygonMarking(){

	map.off('click',addMarker.bind(this));

}
