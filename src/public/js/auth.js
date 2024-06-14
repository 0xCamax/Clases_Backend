
const google = document.getElementById('google-login')
const get_code = document.getElementById('get_code')
const registro_form = document.getElementById('registro-form')
const login_form = document.getElementById('login-form')
const logout = document.getElementById('logout')


const api = 'http://localhost:8080/api/auth'

google? google.onclick = function(){
    window.location.href = api + `/google?clientUrl=${window.location.origin}`
} : null

get_code? get_code.onclick = async function(e){
    e.preventDefault()
    const url = api + '/send_verification'
    const email = document.getElementById('username').value
    const code_msg = document.getElementById('code_msg')
    const send_code = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    })
    const data = await send_code.json()

    console.log(data)

    code_msg.innerText = data.message ? data.message : data.error
    code_msg.hidden = false

} : null

registro_form? registro_form.onsubmit = async function(e){
    e.preventDefault()
    const form = e.target
    const form_data = new FormData(form)
    const form_data_object = Object.fromEntries(form_data.entries())
    const api = form.action
    let response_msg = document.getElementById('register_response_msg')
    
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(form_data_object)
    })

    const res = await response.json()
    if(res.status === 'success'){
        window.location = window.location.origin
    } else {
        response_msg.innerText = res.error 
    }
} : null

login_form? login_form.onsubmit = async function(e){
    e.preventDefault()
    const form = e.target
    const form_data = new FormData(form)
    const form_data_object = Object.fromEntries(form_data.entries())
    const api = form.action
    let response_msg = document.getElementById('login_response_msg')
    
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(form_data_object)
    })

    const res = await response.json()
    if(res.status === 'success'){
        window.location = window.location.origin + '/perfil'
    } else {
        response_msg.innerText = res.error 
    }
} : null

logout? logout.onclick = async function(){
    const api = 'http://localhost:8080/api/auth/logout'
    const response = await fetch(api, {
        method: 'GET',
    })
    const res = await response.json()
    if(res.status === 'success') window.location = window.location.origin
} : null