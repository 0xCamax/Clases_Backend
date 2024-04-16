
const socket = io()


const agregarProducto = document.getElementById("agregar").onclick = (e) => {
    e.preventDefault()

    let imagenes = [...document.getElementById("imagen").files].map(f => f.name)

    let body = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        categoria:document.getElementById("categoria").value, 
        imagen: imagenes, 
        precio: document.getElementById("precio").value, 
        codigo: document.getElementById("codigo").value,
        stock: document.getElementById("stock").value
    }

    let reqbody = JSON.stringify(body)
    
    fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: reqbody
    }).then(response => {
        return response.json()
    }).then(data => {
        console.log("Respuesta del servidor: ", data)
        socket.emit("nuevoProducto", data)
    })
    .catch( err => {
        console.error("Error: ", err)
    })
}

socket.on("agregarProducto", (data) => {
    if (!data.error){
        let detalle = []
        Object.entries(data.detalle).forEach(([k,v]) => {
            if(k == "status") {
                return
            }
            detalle.push(`<p>${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}</p>`)
        })
        let htmllist = detalle.join("")
        let producto = document.createElement("li")
        producto.innerHTML = htmllist
        producto.id = data.detalle.id
        let lista = document.getElementById("lista")
        lista.appendChild(producto)
    }
})

const eliminarProducto = document.getElementById("eliminarProducto").onclick = (e) => {
    e.preventDefault()

    let id = document.getElementById("eliminar").value

    fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        console.log(data)
        socket.emit("eliminarProducto", data)
    }).catch(err => {
        console.log("Error: ", err)
    })
}

socket.on("eliminar", data => {
    document.getElementById(data.detalle.id) ? document.getElementById(data.detalle.id).remove() : console.log("No existe")
})