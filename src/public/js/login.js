let github = document.getElementById('github-login')
let google = document.getElementById('google-login')
let login = document.getElementById('login')
let registro = document.getElementById('registro')


github.onclick = async function(){
    window.location.href = `http://localhost:8080/api/user/github?url=${window.location.href}`
}

google.onclick = function(){
    
}
login.onclick = function(){
    
}
registro.onclick = function(){
    
}