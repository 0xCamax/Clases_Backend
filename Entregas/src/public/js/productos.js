
const filter = document.getElementById('filtrar')
const nextPage = document.getElementById('nextPage')
const prevPage = document.getElementById('prevPage')
const paginas = document.getElementById('paginas')
const orden = document.getElementById('sort')
const categoria = document.getElementById('categorias')
const reset = document.getElementById('reset')
const mostrar = document.getElementById('mostrar')
const btnAgregar = document.getElementsByClassName('agregar')



paginas.addEventListener('change', (e)=>{
    e.preventDefault()
    let pag = paginas.options[paginas.selectedIndex].text
    let location = window.location.href
    if(location.match(/page=\d+/)) {
        location = location.replace(/(page=)\d+/, `$1${pag}`)
    } else {
        location += (location.includes('?') ? '&' : '?') + `page=${pag}`
    }
    paginas.value = pag
    window.location.href = location
})

prevPage.addEventListener('click', (e) => {
    e.preventDefault()
    let location = window.location.href
    let pag = prevPage.value
    if(location.match(/page=\d+/)) {
        location = location.replace(/(page=)\d+/, `$1${pag}`)
    } else {
        location += (location.includes('?') ? '&' : '?') + `page=${pag}`
    }
    window.location.href = location
})

nextPage.addEventListener('click', (e) => {
    e.preventDefault()
    let location = window.location.href
    let pag = nextPage.value
    if(location.match(/page=\d+/)) {
        location = location.replace(/(page=)\d+/, `$1${pag}`)
    } else {
        location += (location.includes('?') ? '&' : '?') + `page=${pag}`
    }
    window.location.href = location
})

filter.addEventListener('click', (e)=>{
    e.preventDefault()
    let location = window.location.origin + window.location.pathname
    let query = categoria.options[categoria.selectedIndex].value
    let sort = orden.options[orden.selectedIndex].value
    if(location.match(/query=\w+/) && query != "null") {
        location = location.replace(/(query=)\w+/, `$1${query}`)
    } else if (query != "null"){
        location += (location.includes('?') ? '&' : '?') + `query=${query}`
    }
    if(location.match(/sort=\w+/) && sort != "null") {
        location = location.replace(/(sort=)\w+/, `$1${sort}`)
    } else if (sort != "null"){
        location += (location.includes('?') ? '&' : '?') + `sort=${sort}`
    }

    window.location.href != location ? window.location.href = location : console.error('Agrega un filtro')
})

reset.addEventListener('click', (e) => {
    e.preventDefault()
    let location = window.location.origin + window.location.pathname
    window.location.href = location
})

mostrar.addEventListener('click', (e) => {
    e.preventDefault()
    let limit = document.getElementById('limit').value
    let location = window.location.href
    if(location.match(/limit=\d+/) && limit) {
        location = location.replace(/(limit=)\d+/, `$1${limit}`)
    } else if (limit){
        location += (location.includes('?') ? '&' : '?') + `limit=${limit}`
    }
    window.location.href = location
})




