const socket = io()

let url = 'http://localhost:8080/api/producto'
let limit = 5
let page = 1
let sort = null
let query = null

socket.on('productos', async ()=>{
    let resultado = await fetch(url, {
        method: 'GET'
    })
    let data = await resultado.json()
    io.emit('filter', data)
})

const filter = document.getElementById('filtrar')
filter.addEventListener('click', async (e)=>{
    const categorias = document.getElementById('categorias')
    let seleccionCategoria= categorias.options[categorias.selectedIndex].value
    const sort = document.getElementById('sort')
    let seleccionSort = sort.options[sort.selectedIndex].value
    if (seleccionSort != 'none') {
        url = url + `?sort=${seleccionSort}`
    }
    if (seleccionCategoria != "TODAS") {
        seleccionSort != 'none' ? url = url + `?query=${seleccionCategoria}`: url = url + `&query=${seleccionCategoria}`
    }
    let resultado = await fetch(url, {
        method: 'GET'
    })
    let data = await resultado.json()
    socket.emit('filter', data)
})


let resultado = await fetch(url, {
    method: 'GET'
})



