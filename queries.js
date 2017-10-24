var mongoose = require('mongoose');  //mongoose es algo que nos permite facilidad a la hora de manejar esquemas y hacer consultar
var Schema = mongoose.Schema;    //se defina una variable Schema


mongoose.connect("mongodb://admin-node:toor@ds227525.mlab.com:27525/hotelznode");  //se conecta a la base de datos, en el servidor adecuado y con el nombre de esta

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
  rooms_number: Number,
  price: Number,
  currency: String,
  room_thumbnail: String,
  description: String,
  beds:{
    simple: Number,
    double: Number
  }
}

var reserveSchemaJSON = { //estructura del esquema, en formato json, excelente para nodo porque json surge de js y node esta basado en js
  arrive_date: String,
  leave_date: String,
  room_type: String,
  capacity: Number,
  beds:{
    simple: Number,
    double: Number
  },
  hotel_id: String,
  user: {
    doc_type: String,
    doc_id: String,
    email: String,
    phone_number: String
  }
}

var room_schema = new Schema(roomsSchemaJSON);  //Creacion del esquema como tal
var hotel_schema = new Schema(hotelSchemaJSON);
var reserve_schema = new Schema(reserveSchemaJSON);

var Room = mongoose.model("Room", room_schema);  //creacion del modelo, este es que conecta con la bd, se le pasa el esquema de la tabla a//Creacion del esquema como tal
var Hotel = mongoose.model("Hotel", hotel_schema);                                              // la que va a mapear
var Reserve = mongoose.model("Reserve", reserve_schema);

var json;

function getRooms(req, res){ // función para obtener todos los usuarios
	Room.find({hotel_id: req.query.city, room_type: req.query.room_type, capacity: parseInt(req.query.hosts)},
   '-_id -__v -hotel_id -rooms_number', function(err, doc) {
        json = doc;
  });

  if(json == null) {
    res.status(200).send("No existen habitaciones");
    return;
  }

  Reserve.find({hotel_id: req.query.city, room_type: req.query.room_type, capacity: parseInt(req.query.hosts)},
   '-_id -__v', 
   function(err, doc) {
    
      res.status(200).send(doc);
      return;  

    for(var i = 0; i < doc.length; i++) {
      var arrive = new Date(doc.arrive_date).getTime();
      var leave = new Date(doc.leave_date).getTime();      
      if(new Date(req.query.arrive_date).getTime() >= arrive || new Date(req.query.arrive_date).getTime() <= leave) {
        doc[i] = "";
      }
    } 
  });

  Hotel.findOne({hotel_id: req.query.city}, '-_id -__v -hotel_id', function(err, doc) {
    if(doc == null) {
      res.status(200).jsonp("No existe el hotel");
      return;   
    }
    doc.rooms = json;
    res.status(200).send(doc);
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

function saveReserve(req, res) { //función para guardar un usuario

  if(req.body.arrive_date == null || req.body.arrive_date == ""
    || req.body.leave_date == null || req.body.leave_date == ""
    || req.body.room_type == null || req.body.room_type == ""
    || req.body.capacity == null || req.body.capacity == 0
    || req.body.beds.simple == null || req.body.beds.double == null 
    || req.body.hotel_id == null || req.body.hotel_id == ""
    || req.body.user.doc_type == null || req.body.user.doc_type == ""
    || req.body.user.doc_id == null || req.body.user.doc_id == ""
    || req.body.user.email == null || req.body.user.email == ""
    || req.body.user.phone_number == null || req.body.user.phone_number == "") {
    res.status(400).send("Error llenando los campos");  
    return;
  }

  var reserve = new Reserve({
      arrive_date: req.body.arrive_date,
      leave_date: req.body.leave_date,
      room_type: req.body.room_type,
      capacity: req.body.capacity,
      beds:{
        simple: req.body.beds.simple,
        double: req.body.beds.double
      },
      hotel_id: req.body.hotel_id,
      user: {
        doc_type: req.body.user.doc_type,
        doc_id: req.body.user.doc_id,
        email: req.body.user.email,
        phone_number: req.body.user.phone_number
      }
    });

  var arrive_date_split = reserve.arrive_date.split("-");
  var leave_date_split = reserve.leave_date.split("-");

  if(arrive_date_split.length != 3 || leave_date_split.length != 3) {
    res.status(400).send("Error en el formato de las fechas");  
    return;
  }

  if((new Date(reserve.arrive_date)).getTime() >= (new Date(reserve.leave_date)).getTime()) {
      res.status(400).send("La fecha de salida debe ser superior a la de llegada");  
      return;
  }

  var d = new Date();

  var subtraction = ((new Date()).getTime() - (new Date(reserve.arrive_date)).getTime()) - 18000000; //le quito 5 horas

  if(subtraction > 86400000) { //verifico si es el mismo día
      res.status(400).send("La fecha de llegada debe ser igual o mayor a la de hoy");  
      return;
  }

  reserve.save(function(err, doc) {
    if(err) {
      res.status(500).send("Error en el servidor");  
      return;
    }
    res.status(200).send(reserve._id);
  });

};

function save(req, res) { //función para guardar un usuario
  var room = new Room({
    hotel_id: req.body.hotel_id, room_type: req.body.room_type, capacity: req.body.capacity,  rooms_number: req.body.rooms_number,
    price: req.body.price, currency: req.body.currency, room_thumbnail: req.body.room_thumbnail, description: req.body.description,
    beds: {simple: req.body.beds.simple, double: req.body.beds.double}});

  room.save(function() {
    res.send(room);
  });
};

module.exports = { // Exporta todos los metodos
	getAll: getAll,
  getRooms: getRooms,
  save: save,
  saveHotel: saveHotel,
  saveReserve: saveReserve
};
