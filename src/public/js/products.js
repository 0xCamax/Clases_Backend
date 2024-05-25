


//elementos doc
let categorias = document.getElementById('categorias')
let sort = document.getElementById('sort')
let renderProducts = document.getElementById('renderProducts')
let pagina = document.getElementById('page')
let paginaSelect = document.getElementById('paginas')
let carrito = document.getElementById('carrito-btn').value


//con eventos
let filtrarBtn = document.getElementById('filtrar') // agregar query/sort
let resetBtn = document.getElementById('reset') //api link
let paginasBtn = document.getElementById('paginas') //agregar page
let prevPageBtn = document.getElementById('prevBtn')
let nextPageBtn = document.getElementById('nextBtn')
let showBtn = document.getElementById('mostrar') //agregar limit

//apilink
let location = "http://localhost:8080/api/producto"


async function filtrar(e){
    e.preventDefault()
    let query = categorias.options[categorias.selectedIndex].value
    let orden = sort.options[sort.selectedIndex].value
    let url = location

    if(url.match(/query=\w+/) && query && !url.includes(query)) {
        url = url.replace(/\s/g, '')
        url = url.replace(/(query=)\w+/, `$1${query}`)
    } else if (query && !url.includes(query)){
        url = url.replace(/\s/g, '')
        url += (url.includes('?') ? '&' : '?') + `query=${query}`
    }
    if(url.match(/sort=\w+/) && orden && !url.includes(orden)) {
        url = url.replace(/(sort=)\w+/, `$1${orden}`)
    } else if (orden && !url.includes(orden)){
        url += (url.includes('?') ? '&' : '?') + `sort=${orden}`
    }
    if(url.match(/page=\d+/)) {
        url = url.replace(/(page=)\d+/, `$1${1}`)
    }

    if(url != location) {
        try {
            await render(e, url)
            location = url
        } catch (err) {
            console.log(err)
        }
    } else {
        console.error('Agrega un filtro')
    }
}
async function reset(e){
    try {
        let url = "http://localhost:8080/api/producto"
        await render(e, url)
        location = url
        categorias.selectedIndex = 0 
        sort.selectedIndex = 0
    } catch (err) {
        console.log(err)
    }
}

async function paginas(e){
    e.preventDefault()
    let pag = paginaSelect.options[paginaSelect.selectedIndex].text
    let url = location
    if(url.match(/page=\d+/)) {
        url = url.replace(/(page=)\d+/, `$1${pag}`)
    } else {
        url += (url.includes('?') ? '&' : '?') + `page=${pag}`
    }
    try {
        await render(e, url)
        location = url.replace(/\s/g, "+")
    } catch (err) {
        console.log(err)
    }
}
async function show(e){
    e.preventDefault()
    let limit = document.getElementById('limit').value
    let url = location
    if(url.match(/page=\d+/)) {
        url = url.replace(/(page=)\d+/, `$1${1}`)
    }
    if(url.match(/limit=\d+/) && limit) {
        url = url.replace(/(limit=)\d+/, `$1${limit}`)
    } else if (limit){
        url += (url.includes('?') ? '&' : '?') + `limit=${limit}`
    }
    try {
        await render(e, url)
        location = url 
    } catch (err) {
        console.log(err)
    }
}


async function agregar () {
    try {
        let pid = this.value
        let cantidad = this.previousElementSibling.value
        console.log(!carrito)
        if (!carrito) {
            window.location.href = "http://localhost:8080/login"
            return 
        }
        const api = `http://localhost:8080/api/carrito/${carrito}/producto/${pid}`
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cantidad: cantidad
            })
        }
        let response = await fetch(api, req)
        let data = await response.json()
        if(data.status === "success") alert(`Se agregaro al carrito!`)
    } catch (err) {
        console.error(err)
    }
}


async function render (e, url) {
    e.preventDefault()
    let call = url ? url : this.value

    let getProducts = await fetch(call, {
        method: 'GET'
    })

    const { payload, totalPages, page, totalDocs, prevLink, nextLink, limit, hasNextPage, hasPrevPage } = await getProducts.json()
    
    let pages = [`<option></option>`]
    for (let i = 1; i <= totalPages; i++) {
        let option = `<option value=${i}>${i}</option>`
        pages.push(option)
    }
    paginaSelect.innerHTML = pages.join('') 
    
    hasNextPage ? nextPageBtn.hidden = false : nextPageBtn.hidden = true
    hasPrevPage ? prevPageBtn.hidden = false : prevPageBtn.hidden = true

    let from = (page - 1) * limit + 1
    let to = from + payload.length - 1
    
    pagina.innerText = page
    prevPageBtn.value = prevLink
    nextPageBtn.value = nextLink
    
    let options = document.createElement('div')
    options.innerHTML = 
    `<p>Mostrando: ${from}-${to} de ${totalDocs}</p>
    <label for="show">Show:</label>
    <input name="show" type="number" min="1" max="${totalDocs}" step="1" id="limit" value="${limit}">`
    let button = document.createElement('button')
    button.onclick = show
    button.id = 'mostrar'
    button.innerHTML = `<span>&#128269</span>`
    options.append(button)

    let list = document.createElement('ul')
    for( let productos of payload) {
        let li = document.createElement('li')
        li.innerHTML = 
        `<p>ID: ${productos.id}</p>
        <p>Titulo: ${productos.titulo}</p>
        <p>Descripcion: ${productos.descripcion}</p>
        <p>Categoria: ${productos.categoria}</p>
        <p>Imagen: ${productos.imagen}</p>
        <p>Precio: $ ${productos.precio}</p>
        <p>Codigo: ${productos.codigo}</p>
        <p>Stock: ${productos.stock}</p>
        <label for="cantidad" >Cantidad</label>
        <input name="cantidad" type="number" min="1" max="${productos.stock}" class="cantidad">`
        let buttonAdd = document.createElement('button')
        buttonAdd.onclick = agregar
        buttonAdd.value = productos.id
        buttonAdd.innerText = 'Agregar'
        li.append(buttonAdd)
        list.append(li)
    }
    renderProducts.replaceChildren(options, list)
}

prevPageBtn.onclick = render 
nextPageBtn.onclick = render
filtrarBtn.onclick = filtrar 
resetBtn.onclick = reset
paginasBtn.onchange = paginas
showBtn.onclick = show
