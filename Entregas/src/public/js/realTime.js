const socket = io()


socket.on("agregar", (data) => {
    let detalle = []
    Object.entries(data).forEach(([k,v]) => {
        if(k == "status") {
            return
        }
        detalle.push(`<p>${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}</p>`)
    })
    let htmllist = detalle.join("")
    let producto = document.createElement("li")
    producto.innerHTML = htmllist
    producto.id = data.id
    let lista = document.getElementById("lista")
    try {
        lista.appendChild(producto)
    } catch (error) {
        lista.append(producto)
    }
})

socket.on("eliminar", data => {
    document.getElementById(data.id) ? document.getElementById(data.id).remove() : console.log("No existe")
})

