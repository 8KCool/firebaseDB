document.addEventListener("DOMContentLoaded", event => {
  var db = firebase.database();
  var sectionListado = $("#listado-eventos");
  departamentosRef = db.ref('formdata/departamento').orderByKey();
  departamentosRef.once('value').then(function(departamentos) {
    departamentos.forEach(function(departamento) {
      // key will be "ada" the first time and "alan" the second time
      var depKey = departamento.key;
      var depKeyForId = depKey.replace(/\s/g, "");
      // childData will be the actual contents of the child
      var departData = departamento.val();
      var contadorDepart = departData.contador;
      if(departamento.hasChild('eventos')) {
        var divDepartamento = "<div id=\"" + depKeyForId + "\"><h2>" + depKey + "</h2><label id=\"" + depKeyForId + "-dep\" visible=\"false\">" + depKey + "</label><ul id=\"" + depKeyForId + "-list\"></ul></div>"
        sectionListado.append(divDepartamento);

        depEventosRef = db.ref('formdata/departamento/' + depKey + '/eventos').orderByChild('timestamp');
        depEventosRef.once('value').then(function(eventos) {
          eventos.forEach(function(evento) {
            var eventKey = evento.key;
            var eventData = evento.val();
            var listItem = "<li>" + eventData.dia + "/" + eventData.mes + "/" + eventData.año + "  " + "hecho: \"" + eventData.hecho + "\"" + "<button id=\"" + eventKey + "\" type=\"button\" onClick=\"deleteEvent(\'" + depKey + "\',\'" + depKeyForId + "\', this.id)\">delete</button></li>";
            var ulForDep = $("#listado-eventos > #" + depKeyForId + " > #" + depKeyForId + "-list");
            ulForDep.append(listItem);
            console.log(" Evento " + eventKey + " año: " + eventData.año);
          });
        });

      }
      else
        console.log("No fechas in departamento " + depKey);
    });
  });
});

function deleteEvent(departamento, departamentoId, evento) {
  var departmentKey = $('#'+departamentoId+'-dep').text();
  console.log("eliminar "+ evento);
  firebase.database().ref('formdata/departamento/' + departmentKey + "/eventos/" + evento).remove();
  reduceCounter(departmentKey);
}

function reduceCounter(departamento){
  console.log("Obtaining counter for " + departamento);
  console.log('Reducing counter for ' + departamento);
	// Reduce departamento counter by 1.
  var departamentoRef = firebase.database().ref('formdata/departamento/' + departamento);
  departamentoRef.once('value').then(function(dep) {
    depValues = dep.val();
    if(depValues.contador > 0) {
    	depValues.contador--;
    }
    departamentoRef.update(depValues);
  });
}
