let github = document.getElementById('github-login')
let google = document.getElementById('google-login')



github.onclick = async function(){
    window.location.href = `http://localhost:8080/api/auth/github?clientUrl=${window.location.origin}`
}

google.onclick = function(){
    window.location.href = `http://localhost:8080/api/auth/google?clientUrl=${window.location.origin}`
}
