const { location } = window
let { href: url, pathname, origin } = window.location

const filter = document.getElementById('filtrar')
const paginas = document.getElementById('paginas')
const orden = document.getElementById('sort')
const categoria = document.getElementById('categorias')
const reset = document.getElementById('reset')
const mostrar = document.getElementById('mostrar')

paginas.addEventListener('change', (e)=>{
    e.preventDefault()
    let pag = paginas.options[paginas.selectedIndex].text
    if(url.match(/page=\d+/)) {
        url = url.replace(/(page=)\d+/, `$1${pag}`)
    } else {
        url += (url.includes('?') ? '&' : '?') + `page=${pag}`
    }
    location.assign(url)
})

filter.addEventListener('click', (e)=>{
    e.preventDefault()
    let query = categoria.options[categoria.selectedIndex].value
    let sort = orden.options[orden.selectedIndex].value
    if(url.match(/query=\w+/) && query) {
        url = url.replace(/(query=)\w+/, `$1${query}`)
    } else if (query){
        url += (url.includes('?') ? '&' : '?') + `query=${query}`
    }
    if(url.match(/sort=\w+/) && sort) {
        url = url.replace(/(sort=)\w+/, `$1${sort}`)
    } else if (sort){
        url += (url.includes('?') ? '&' : '?') + `sort=${sort}`
    }

    url != location.href ? location.assign(url) : console.error('Agrega un filtro')
})

reset.addEventListener('click', (e) => {
    e.preventDefault()
    location.assign(origin + pathname)
})

mostrar.addEventListener('click', (e) => {
    e.preventDefault()
    let limit = document.getElementById('limit').value

    if(url.match(/limit=\d+/) && limit) {
        url = url.replace(/(limit=)\d+/, `$1${limit}`)
    } else if (limit){
        url += (url.includes('?') ? '&' : '?') + `limit=${limit}`
    }
    location.assign(url)
})




