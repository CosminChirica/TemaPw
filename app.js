const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const cookieParser=require('cookie-parser');
const session=require('express-session');
const fs = require('fs');

const app = express();

const port = 6789;

app.use(cookieParser());


// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/css', express.static(__dirname + 'public/css'))

app.use( express.static( "magazin" ) );

app.use(session({
	name:'sid',
	secret:'secret',
	resave:false,
	saveUninitialized:false,
	cookie:{
	maxAge:120000
	}}));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => {
	res.render('index',{req: req});
});


let rawdata = fs.readFileSync('intrebari.json');
const listaIntrebari = JSON.parse(rawdata);

let rawusers = fs.readFileSync('utilizatori.json');
const utilizatori = JSON.parse(rawusers);

const redirectLogin = (req,res,next) =>
{
	if(!req.session.user)
	{
		res.redirect('/');
	}
	else
	{
		next();
	}
}


// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar',redirectLogin, (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('chestionar', {intrebari: listaIntrebari, req: req});
});

app.get('/home', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('index', {req:req});
});

app.get('/magazin', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('magazin', {req:req});
});

app.get('/joc', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('joc', {req:req});
});

app.get('/caini', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('caini', {req:req});
});

app.get('/pisici', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('pisici', {req:req});
});

app.get('/hamsteri', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('hamsteri', {req:req});
});

app.get('/autentificare', (req, res) => {
	
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	
	res.render('autentificare', {cookies: req.cookies});
	

});

app.post('/rezultat-chestionar',redirectLogin, (req, res) => {
	
	res.render('rezultat-chestionar',{raspunsuri: req.body, intrebari: listaIntrebari, req:req })
});

app.post('/verificare-autentificare', (req, res) => {
	
	const date = req.body;
	var err = 1;
	utilizatori.forEach(function(util, i){
		if(date.utilizator == util.utilizator && date.parola == util.parola)
		{
			err=0;
			req.session.user = util.utilizator;
			req.session.nume = util.nume;
			req.session.prenume = util.prenume;
			req.session.varsta = util.varsta;
			req.session.animal_preferat = util.animal_preferat;
			req.session.rasa_preferata = util.rasa_preferata;
			return false;
		}
	});
	if(err==1)
	{
		res.cookie('mesajEroare','date gresite');
		res.redirect('http://localhost:6789/autentificare');
	}
	else{
		
		res.redirect('http://localhost:6789/');
	}
	
	// res.render('verificare-autentificare',{date: req.body});
});



app.post('/logout',redirectLogin, (req, res) => {
	req.session.destroy(err =>
		{
			if(err){
				return res.redirect('/');
			}
		});
	res.clearCookie('sid');
	res.clearCookie('mesajEroare');
	res.redirect('/');
});

app.listen(port, () => console.log("Serverul rulează la adresa http://localhost:" + port));


let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('/views/pisici.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
};





