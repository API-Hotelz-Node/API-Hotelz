var express = require('express');
var router = express.Router();

var db = require('./queries');  //Se requiere el el modulo queries que esta dentro del proyecto

router.get('/v1/rooms', db.getRooms);  		//mediante un metodo get al url ...../users ser le ejecutara la funcion getALL
router.get('/v1/getAll', db.getAll);  		//mediante un metodo get al url ...../users ser le ejecutara la funcion getALL
router.post('/v1/save', db.save);
router.post('/v1/saveHotel', db.saveHotel);

module.exports = router;    //exporta todo lo que esta almacenado en router
