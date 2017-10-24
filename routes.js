var express = require('express');
var router = express.Router();

var fs = require("fs");  //filesystem

var db = require('./queries');  //Se requiere el el modulo queries que esta dentro del proyecto

router.get('/', function(req, res) {	
	fs.readFile("./views/index.html", function(err,html){   //cargar la pagina de manera asincrona, se pasa el callback con paramtero error y
															// dato, en este caso el html
    res.write(html); //Probar escribiendo el contenido de index  (paso 8)
    res.end();       //finalizar la petición
    });
});

router.get('/v1/rooms', db.getRooms);  		//mediante un metodo get al url ...../users ser le ejecutara la funcion getALL
router.get('/v1/getAll', db.getAll);  		//mediante un metodo get al url ...../users ser le ejecutara la funcion getALL
router.post('/v1/save', db.save);
router.post('/v1/saveHotel', db.saveHotel);
router.post('/v1/rooms/reserve', db.saveReserve);

module.exports = router;    //exporta todo lo que esta almacenado en router
