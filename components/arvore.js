function obterDados (endpoint) {
  fetch(endpoint)
  .then(function (response) { return response.json() })
  .then(function (data) { return fragmentarDados(data) })
  .then(function () { this.ouvirEventos() })
  .catch(function (e) { console.log('Erro: ' + e.message) })
}

function criarListaDeItens (item, list = '#arvore') {
  for (i in item) {
    const elementId = '_'.concat(item['id']),
          selectorId = '#'.concat(elementId)

    if (i === 'name') {
      criarElemento('li').set('id', elementId).append(document.querySelector(list))
      criarElemento('input').set('type', 'checkbox').set('id', elementId.concat('_')).set('name', 'n_'.concat(elementId)).append(document.querySelector(selectorId))
      criarElemento('label').set('for', elementId.concat('_')).text(item['name']).append(document.querySelector(selectorId))
    } 

    if (item[i].constructor === Object && Object.entries(item[i]).length > 0) {
      criarElemento('ul').append(document.querySelector(selectorId))
      fragmentarDados(item[i], selectorId.concat(' ul'))
    }

    if (item[i].constructor === Object && Object.entries(item[i]).length === 0) {
      document.querySelector(selectorId).setAttribute('class', 'ultimo')
    }
  }
}

function fragmentarDados (subItem, subList) {
  for (el in subItem) criarListaDeItens(subItem[el], subList)
}

function criarElemento (name) {
  const element = document.createElement(name)
  const append = function (node) { return node.appendChild(element) }
  const set = function (key, value) { return element.setAttribute(key, value) }
  const text = function (value) { return element.textContent = value }
  const result = { append, set (key, value) { set(key, value); return result }, text (value) { text(value); return result } }

  return result
}

function ouvirEventos () {
  addEventListener('change', observarMudanca)

  document.querySelectorAll('li').forEach(function (e) {
    e.addEventListener('click', alternarVisibilidade)
  })
}

function alternarVisibilidade (e) {
  e.stopPropagation()
  e.srcElement.classList.toggle('visible')
}

function observarMudanca ({target}) {
  if (target.type !== 'checkbox') return

  atualizarFilhos(target)
  atualizarAncestrais(target)
}

function atualizarFilhos (el) {
  const {checked} = el

  obterFilhos(el).forEach(function (child) {
    child.checked = checked
    child.indeterminate = false
  })
}

function atualizarAncestrais (parent) {
  while (parent = obterAncestrais(parent)){
    let children = obterFilhos(parent)
    let checked = [ ...children ].filter(function (child) { return child.checked}).length

    parent.checked = checked === children.length
    parent.indeterminate = checked && ! parent.checked
  }
}

function obterFilhos (el) {
  el = el.closest('li')
  el = el && el.querySelector('ul')
  return el && el.querySelectorAll('input[type="checkbox"]') || []
}

function obterAncestrais(el) {
  el = el.closest('ul')
  el = el && el.closest('li')
  return el && el.querySelector('input[type="checkbox"]')
}

document.addEventListener('DOMContentLoaded', obterDados('server/data.json'))
