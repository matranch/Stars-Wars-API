const axios = require('axios')

async function parseTab(tab){
  let i = 1
  let l = 0
  let bool = true
  let tabp = []
  let tabs = []
  tabp = await parsePAndS(tabp, "https://swapi.co/api/planets")
  tabs = await parsePAndS(tabs, "https://swapi.co/api/species")
  let url = "https://swapi.co/api/people/"
  while(bool)
  {
    const {data} = await axios(url)
      if(i == 1){
	tab[0] = {_id : 0, count: data.count}}
    do{
      while(i <= tab[0].count + 1){
	if(!(data.results[l])){
	  url = data.next
	  l = 0
	  break
	}
	tab[i] = {
	  _id: i,
	  name : data.results[l].name,
	  height: checkNumber(data.results[l].height),
	  planet: checkString(data.results[l].homeworld, tabp),
	  age : checkNumber(data.results[l].birth_year.split('BBY').join('')),
	  species: checkString(data.results[l].species[0], tabs),
	  eye: data.results[l].eye_color,
	  mass: checkNumber(data.results[l].mass)
	  } 
	i++
	l++
      }
      if(data.next == undefined){
	bool = false
	break
      }
    }while(data.next == undefined)
  }
  return(tab)
}

function checkNumber(index)
{
  index = parseInt(index)
  if(index !== index)
    index = 0
  return(index)
}
function checkString(string, tab){
  let i = 0
  i = parse(string)
  if(i == 0)
    tab[i] == 'unknown'
  return(tab[i])
  
}
function parse(data)
{
  let i = 0
  let j = 0
  
  if(data){
    while(i < (data.length - 2))
      i++
    if(data.length > 31){
      while(j < (data.length - 3))
	j++
      i = data[j] + data[i]
    }
    else
      i = data[i]
  }
  else
    i = 0
  return(parseInt(i))
}

async function parsePAndS(tab, url){
  let bool = true
  let i = 2
  let j = 0
  while(bool){
  var res = await axios(url)
    while(i <= (res.data.count + 1)){
      if(!(res.data.results[j])){
	url = res.data.next
	j = 0
	break
      }
      tab[i] = res.data.results[j].name
      j++
      i++
    }
    if(i == res.data.count + 2){
      bool = false
      break
    }
  }
  // for put species and planet in good place
  tab[1] = tab[i - 2]
  tab[i - 2] = tab[i - 1]
  tab[i - 1] = null
  return(tab)
}

module.exports = {
    parseTab : parseTab
}
