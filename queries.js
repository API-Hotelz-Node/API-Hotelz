var mongoose = require('mongoose');  //mongoose es algo que nos permite facilidad a la hora de manejar esquemas y hacer consultar
var Schema = mongoose.Schema;    //se defina una variable Schema
var _ = require("underscore");

mongoose.connect("mongodb://localhost/hotelznode");  //se conecta a la base de datos, en el servidor adecuado y con el nombre de esta

var hotelSchemaJSON = { //estructura del esquema, en formato json, excelente para nodo porque json surge de js y node esta basado en js
  hotel_id : String,
  hotel_name: String,
  hotel_location: {
    address: String,
    lat: String,
    long: String
  },
  hotel_thumbnail: String,
  check_in: String,
  check_out: String,
  hotel_website: String,
  rooms: [{}]
}

var roomsSchemaJSON = { //estructura del esquema, en formato json, excelente para nodo porque json surge de js y node esta basado en js
  hotel_id: String,
  room_type: String,
  capacity: Number,
  price: Number,
  currency: String,
  room_thumbnail: String,
  description: String,
  beds:{
    simple: String,
    double: String
  }
}

var room_schema = new Schema(roomsSchemaJSON);  //Creacion del esquema como tal
var hotel_schema = new Schema(hotelSchemaJSON);
var Room = mongoose.model("Room", room_schema);  //creacion del modelo, este es que conecta con la bd, se le pasa el esquema de la tabla a//Creacion del esquema como tal
var Hotel = mongoose.model("Hotel", hotel_schema);                                              // la que va a mapear
var json;

function getRooms(req, res){ // función para obtener todos los usuarios
	Room.find({hotel_id: req.query.city, room_type: req.query.room_type, capacity: parseInt(req.query.hosts)},
   '-_id -__v -hotel_id', function(err, doc) {
        json = doc;
  });

  Hotel.findOne({hotel_id: req.query.city}, '-_id -__v -hotel_id', function(err, doc) {
    doc.rooms = json;
    res.status(200).jsonp(doc);
  });

  /*if(typeof req.query.arrive_date === 'undefined') {
    console.log('No existe id'); ,{capacity: parseInt(req.query.hosts)}
  }*/
};

// http://localhost:3001/v1/rooms?arrive_date=2017-10-14&leave_date=2017-10-16&city=05001&hosts=2&room_type=L

function getAll(req, res){ // función para obtener todos los usuarios

  Room.find({}, '-_id -__v', function(err, doc) {

      res.status(200).jsonp(doc);
  });


};


function saveHotel(req, res) { //función para guardar un usuario
  var hotel = new Hotel({
    hotel_id: req.body.hotel_id, hotel_name: req.body.hotel_name, hotel_location: {
    address: req.body.hotel_location.address, lat: req.body.hotel_location.lat, long: req.body.hotel_location.long},
    hotel_thumbnail: req.body.hotel_thumbnail, check_in: req.body.check_in,
    check_out: req.body.check_out, hotel_website: req.body.hotel_website});

  hotel.save(function() {
    res.send(hotel);
  });
};


function save(req, res) { //función para guardar un usuario
  var room = new Room({
    hotel_id: req.body.hotel_id, room_type: req.body.room_type, capacity: req.body.capacity, price: req.body.price,
    currency: req.body.currency, room_thumbnail: req.body.room_thumbnail, description: req.body.description,
    beds: {simple: req.body.beds.simple, double: req.body.beds.double}});

  room.save(function() {
    res.send(room);
  });
};

module.exports = { // Exporta todos los metodos
	getAll: getAll,
  getRooms: getRooms,
  save: save,
  saveHotel: saveHotel
};
