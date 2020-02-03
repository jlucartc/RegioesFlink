// ---- Inicializando mapa ----

var poligonos = []
var currentPolygon = null
var currentPolygonPoints = []
var counter = 1
var params = new Object()
var markers = new Array()
var pendingPoint = false
var currentPoint = null
params.data = new Array()

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
var nomeInput = document.getElementById('nomeInput')
var radiusDiv = document.getElementById('radiusDiv')

salvar.style.visibility = 'hidden'
resetar.style.visibility = 'hidden'
cancelar.style.visibility = 'hidden'
nomeInput.style.visibility = 'hidden'
radiusDiv.style.visibility = 'hidden'

adicionarRegiao.onclick = startAddRegiao
adicionarPonto.onclick = startAddPonto
salvar.onclick = saveData
resetar.onclick = resetData
cancelar.onclick = cancelData

function sendAlert(e){

  alert("sending alert...")

}

function beginInsertion(type){


  if(type == "ponto"){

    startPointMarking()
    settingRegiao = false
    settingPonto = true
    radiusDiv.style.visibility = 'visible'
    pendingPoint = true

    /* save data */

  }else if(type == "regiao"){

    startPolygonMarking()
    settingPonto = false
    settingRegiao = true

    /* save data */

  }

  salvar.style.visibility = 'visible'
  resetar.style.visibility = 'visible'
  cancelar.style.visibility = 'visible'
  nomeInput.style.visibility = 'visible'

  adicionarRegiao.disabled = true
  adicionarPonto.disabled = true

  console.log("Ponto: ",settingPonto)
  console.log("Região: ",settingRegiao)

}

function endInsertion(){

  if(settingPonto){

    settingRegiao = false
    settingPonto = false
    radiusDiv.style.visibility = 'hidden'

    /* save data */

  }else if(settingRegiao){

    settingPonto = false
    settingRegiao = false

    /* save data */

  }

  salvar.style.visibility = 'hidden'
  resetar.style.visibility = 'hidden'
  cancelar.style.visibility = 'hidden'
  nomeInput.style.visibility = 'hidden'
  radiusDiv.style.visibility = 'hidden'

  adicionarRegiao.disabled = false
  adicionarPonto.disabled = false

  params.data = new Array()

  map.off('click');

  clearLayers()

}
function startAddRegiao(e){ beginInsertion("regiao") }
function startAddPonto(e){ beginInsertion("ponto") }
function saveData(e){

  if(pendingPoint == true){

    if(nomeInput.value != null && nomeInput.value != '' && radiusDivInput.value != null && radiusDivInput.value != ''){

      params.nome = nomeInput.value
      params.raio = radiusDivInput.value

      pendingPoint = false

      if(settingPonto == true){

        var http = new XMLHttpRequest();
        http.open('POST','http://localhost:3000/saveData');
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(params));
        alert("Pontos salvos!")

      }else if(settingRegiao == true){

        var http = new XMLHttpRequest();
        http.open('POST','http://localhost:3000/saveData');
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(params));
        alert("Região salva!")

      }

        endInsertion();

    }else{

      alert("Campos não prenchidos")

    }

    radiusDivInput.value = ''
    nomeInput.value = ''

  }else{

    if(nomeInput.value != null && nomeInput.value != ''){

      params.nome = nomeInput.value

      if(settingPonto == true){

        var http = new XMLHttpRequest();
        http.open('POST','http://localhost:3000/saveData');
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(params));
        alert("Pontos salvos!")

      }else if(settingRegiao == true){

        var http = new XMLHttpRequest();
        http.open('POST','http://localhost:3000/saveData');
        http.setRequestHeader("Content-type", "application/json");
        http.send(JSON.stringify(params));
        alert("Região salva!")

      }

        endInsertion();

    }else{

      alert("Campos não prenchidos")

    }

  }

}

function resetData(e){

  if(currentPolygon != null){
    currentPolygon.remove()
  }
  currentPolygonPoints = new Array()
  currentPolygon = null
  markers.forEach( (val,index) => {

      val.remove()

  })

}
function cancelData(e){ endInsertion(); pendingPoint = false }

// ---- Inicializando botoes : FIM ----

function addMarker(e){


	var newMarker = L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
	newMarker.bindTooltip(e.latlng.lat+","+e.latlng.lng).openTooltip();
  markers.push(newMarker)
	//newMarker.bindTooltip(counter.toString()).openTooltip();
	counter = counter + 1

  if(settingRegiao == true){
    console.log('atualizando poligono')
  	if(currentPolygon == null){

      currentPolygon = new Array()
  		currentPolygonPoints.push(e.latlng);
  		currentPolygon = L.polygon(currentPolygonPoints, {color: 'red'}).addTo(map);

  	}else{

      if(currentPolygon != null){
        currentPolygon.removeFrom(map);
      }
  		currentPolygonPoints.push(e.latlng);
  		currentPolygon = L.polygon(currentPolygonPoints, {color: 'red'}).addTo(map);

  	}
  }

  params.type = "regiao"
  params.data.push([e.latlng.lat,e.latlng.lng])

}

function clearLayers(){

  markers.forEach( (val,index) => {

    val.remove()

  })

  if(currentPolygon != null){
    currentPolygon.remove()
  }

  if(currentPoint != null){

    currentPoint.remove()

  }

  currentPoint = null
  currentPolygonPoints = new Array()

}

function alertPolygon(){

	alert(currentPolygon)

}

function pointMarking(e){

  if(currentPoint == null){

      var radius = 0

      if(radiusDivInput.value != null && radiusDivInput.value != '' && !isNaN(parseFloat(radiusDivInput.value)) && isFinite(radiusDivInput.value)){
          radius = radiusDivInput.value
      }

      currentPoint = L.circle([e.latlng.lat,e.latlng.lng], {radius: radius})
      currentPoint.addTo(map);

  }else{

    currentPoint.remove()

    var radius = 0

    if(radiusDivInput.value != null && radiusDivInput.value != '' && !isNaN(parseFloat(radiusDivInput.value)) && isFinite(radiusDivInput.value)){
        radius = radiusDivInput.value
    }

    currentPoint = L.circle([e.latlng.lat,e.latlng.lng], {radius: radius})
    currentPoint.addTo(map);

  }

  params.data = new Array()
  params.data.push([e.latlng.lat,e.latlng.lng])

  params.type = "pontos"

}

function updateRadius(e){

  if(currentPoint != null && !isNaN(parseFloat(radiusDivInput.value)) && isFinite(radiusDivInput.value)){

    currentPoint.remove()
    currentPoint.setRadius(radiusDivInput.value)
    currentPoint.addTo(map)

  }else{

    currentPoint.remove()
    currentPoint.setRadius(0)
    currentPoint.addTo(map)

  }

}

/* Modifica o callback do evento de click, permitindo a adição de novos pontos no mapa */
function startPolygonMarking(){

	map.on('click',addMarker.bind(this))

}


function startPointMarking(){

  map.on('click',pointMarking.bind(this))

}

function stopPointMarking(){

  map.off('click')

}

/* Modifica o callback do evento click, encerrando a adição de novos pontos no mapa.
   Também adiciona o polígono criado na estrutura de armazenamento para que seja exportado futuramente.
*/
function stopPolygonMarking(){

	map.off('click');

}
