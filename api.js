var express = require('express')
var app = express()
var similarity = require("similarity")
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
var port = process.env.PORT || 4000
var host = 'localhost'
var router = express.Router()
app.use(express.static("public"))

router.use(function(req, res, next) {
    next()
})

app.get('/', function(req, res, next){
    let tab = []
    tab = getTab()
    tab.shift()
    res.render('index', {title : 'Stars Wars', tab : tab})
})

app.post('/', function(req, res){
  let tab = []
  tab = getTab()
  console.log(req.body)
  let i = checkName(tab, req.body.name)
  if(i == tab.length){
    tab = autocomplete(tab, req.body.name)
    if(!tab)
      tab = 'Aucun personnage trouvé'
  }
  else{
    tab = show(ftab[i], 20)
    tab = JSON.stringify(tab)
  }
  res.send(tab)
})
app.get('/:name', function(req, res){
  let tab = []
  tab = getTab()
  let i = checkName(tab, req.params.name)
  if(i == tab.length){
    var html = "<p><b>Personnage trouvé :</b></p>"
    tab = autocomplete(tab, req.params.name)
    if(tab == null)
      html += 'Aucun personnage trouvé'
    else{
      for(let i in tab)
	html+= "<li><a href="+tab[i].replace(' ', '').replace(' ', '')+">"+tab[i]+"</a></li>"
    }
  }
  else
    tab = show(ftab[i], 5)
  if(html)
    res.send(html)
  else
    res.json(tab)
})

app.set('view engine', 'pug')
app.use('/', router)
app.listen(port)
console.log('Running on http://'+host+':'+port)

function getTab(){
  let tab1 = []
  let i = 1
  while(i < tab.length)
    tab1[i] = tab[i++].name
  return(tab1)
}

function checkName(tab, req){
  let i = 1 
  while(i < tab.length){
    if(tab[i].toUpperCase() == req.toUpperCase() || tab[i].split(' ').join('').toUpperCase() == req.split(' ').join('').toUpperCase())
      break;
  i++
  }
  return(i)
}
function autocomplete (tab, name) {
  let i = 1
  let j = 0
  let tab1 = []
  var res = auto(tab, name)
  if(res.length == 0){
    while(i < tab.length){
      res = similarity(tab[i], name)
      if(res > 0.4){
	tab1[j++] = tab[i]
      }
      i++
    }
    if(tab1.length > 0)
      return(tab1)
    else
      res = null
  }
  return(res)
}

function show(tab, k){
  let i = 1
  let j = 0
  let tab1 = []
  while(i <= k){
    tab1[j] = tab[i]
    i++
    j++
  }
  return(tab1)
}

function auto(tab, input) {
  return tab.filter(e =>e.toLowerCase().includes(input.toLowerCase()))
}
