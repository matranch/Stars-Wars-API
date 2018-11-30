var _ = require('lodash')

async function compareTab(res, i, tab, tabc){
  let j = 1
  let percent = 0
  tabc[i] = []
  while(j < res.length)
  {
    percent = 0
    percent = compare(tab[i].species, res[j].species, percent, 30, 0)
    percent = compare(tab[i].planet, res[j].planet, percent, 5, 0)
    percent = compare(tab[i].eye, res[j].eye, percent, 20, 'unknown')
    percent = compare2(tab[i].age, res[j].age, percent, 5)
    percent = compare2(tab[i].height, res[j].height, percent, 17)
    percent = compare2(tab[i].mass, res[j].mass, percent, 23)
    percent = Math.round(percent * 10) / 10
    tabc[i][j-1] = {name : res[j].name, species : res[j].species, planet : res[j].planet, age : res[j].age,   percent : percent}
    j++
  }
  tabc = _.sortBy(tabc[i], [function(o){return o.percent}])
  tabc = tabc.reverse()
  return(tabc)
}

function compare(tab, tab1, percent, number, last)
{
  if(tab == last || tab1 == last)
    percent = percent
  else if(tab == tab1)
    percent = percent + number
  return(percent)
}
function compare2(tab, tab1, percent, number)
{
  if(tab == 0 || tab1 == 0)
    percent = percent
  else
    percent = calculPercent(number, percent, tab, tab1)
  return(percent)
}

function calculPercent(j, percent, tab, tab1){
  let i = 0
  if(tab >= tab1)
    i = tab - tab1
  else
    i = tab1 - tab
  if(i == 0)
    i = j
  else if(i >= 100)
    i = 0
  else{
    i = i * (j / 100)
    i = j - i
  }
  percent = percent + i
  return(percent)
}

module.exports = {
  compareTab : compareTab
}
