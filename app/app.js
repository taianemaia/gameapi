//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Conexão com o MongoDB
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/testeapi';
console.log(mongoaddr);
mongo.connect(mongoaddr);

var platformListSchema = mongo.Schema({
    descricao: { type: String }
});
 
//Esquema da collection do Mongo
var gameListSchema = mongo.Schema({
    nome: { type: String },
    ano: { type: Number },
	plataforma : [
        platformListSchema
    ], 
	descricao : { type: String },
    url_imagem: { type: String },
	updated_at: { type: Date, default: Date.now },
});
//Model da aplicação
var Model = mongo.model('Game', gameListSchema);


//GET - Retorna todos os registros existentes no banco
app.get("/api/game", function (req, res) {
	Model.find(function(err, todos) {
		if (err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

//GET param - Retorna o registro correspondente da ID informada
app.get("/api/game/:nome?", function (req, res) {
	var nome = req.params.nome;
	Model.find({'nome': nome}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

app.get("/api/game/plataforma/:descricao?", function (req, res) {
	var descricao = req.params.descricao;
	Model.find({'plataforma.descricao': descricao}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

//POST - Adiciona um registro
app.post("/api/game", function (req, res) {
	var register = new Model({
		'nome' : req.body.nome,
		'ano' : req.body.ano,
        'plataforma': req.body.plataforma,
        'descricao': req.body.descricao,
        'url_imagem': req.body.url_imagem
	});
	register.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		}
	});
	res.send(register);
	res.end();
});

//PUT - Atualiza um registro
app.put("/api/game/:id", function (req, res) {
	Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err)  {
    	return next(err);
    } else {
    	res.json(post);	
    }
  });
});

//DELETE - Deleta um registro
app.delete("/api/game/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});	

//Porta de escuta do servidor
app.listen(8080, function() {
	console.log('Funcionando');
});

