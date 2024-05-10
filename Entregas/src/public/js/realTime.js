const socket = io()


socket.on("agregar", (data) => {
    let detalle = []
    Object.entries(data).forEach(([k,v]) => {
        if(k == "status"|| k == "__v") {
            return
        }
        if(k == "_id"){
            k = k.replace(/_/, "").toUpperCase()
            detalle.splice(0, 0, `<p>${k}: ${v}</p>`)
            return 
        }
        detalle.push(`<p>${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}</p>`)
    })
    let htmllist = detalle.join("")
    let producto = document.createElement("li")
    producto.innerHTML = htmllist
    producto.id = data._id
    let lista = document.getElementById("lista")
    lista.append(producto)
})

socket.on("eliminar", data => {
    document.getElementById(data._id) ? document.getElementById(data._id).remove() : console.log("No existe")
})

