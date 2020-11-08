var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopago = require ('mercadopago');
const request = require('request');
var port = process.env.PORT || 3000
var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


mercadopago.configure({
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
  access_token: 'APP_USR-8058997674329963-062418-89271e2424bb1955bc05b1d7dd0977a8-592190948'
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/pedding_pay', function (req, res) {
  res.render('pedding');
});


app.get('/success_pay', function (req, res) {
  console.log(req.query);
  res.render('success',req.query);
});


app.get('/failed_pay', function (req, res) {
   let url_search = " https://api.mercadopago.com/checkout/preferences/search";
   res.render('failed',req.body);
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/buy',function(req,res){
  //console.log(req.query);
  let preference = {
      items: [
        {
          id : "1234",
          title: req.query.tittle,
          description: "Dispositivo móvil de Tienda e-commerce",
          unit_price: parseInt(req.query.price),
          quantity: parseInt(req.query.unit),
          picture_url: "https://desanlesr95-mp-commerce-nodejs.herokuapp.com/"+req.query.img
        }
      ],
      back_urls : {
          success: "https://desanlesr95-mp-commerce-nodejs.herokuapp.com/success_pay",
          failure : "https://desanlesr95-mp-commerce-nodejs.herokuapp.com/failed_pay",
          pending: "https://desanlesr95-mp-commerce-nodejs.herokuapp.com/pedding_pay"

      },
      external_reference: "lendev.sara@gmail.com", 
      payer: { 
        name: "Lalo",
        surname: "Landa",
        email: "test_user_81131286@testuser.com", 
        phone: {
          area_code: "52",
          number: 5549737300
        },
        address: {
          zip_code: "03940",
          street_name: "Insurgentes sur",
          street_number: 1602
        }
      },
      payment_methods: {
        excluded_payment_methods: [
          {
            id: "amex"
          }
        ],
        excluded_payment_types: [{ id: "atm" }],
        installments: 6, 
        default_installments: 6
      },
      notification_url: "https://desanlesr95-mp-commerce-nodejs.herokuapp.com/webhook",
      auto_return: "approved"
    };

 

    mercadopago.preferences.create(preference)
    .then(function(response){
      res.redirect(response.body.init_point);
    }).catch(function(error){
      console.log(error);
    });

});


app.post('/webhook',function(req,res){
  console.log("Webhook-----");
  console.log(req);
  var body;
  req.on("data", chunk => {
    
    body += chunk.toString();
    console.log(body);  
  });
  req.on("end", () => {  
    console.log(body, "webhook response"); 
    res.end("ok");
  });
  res.status(200); 
});




app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));



app.listen(port);
console.log('Servidor correindo ' + port)
