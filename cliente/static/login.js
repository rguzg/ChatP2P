const main = document.querySelector('#main');
const username_input = document.querySelector('#username');
const server_address = 'http://localhost:4000';

const getToken = async (username) => {
    let response = await fetch(`${server_address}/user/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'user_name': username
        })
    });

    let json = await response.json();

    if(response.ok){
        return json.message
    } else {
        throw new Error('Error al iniciar sesión');
    }
}

main.addEventListener('click', async () => {
    let username = username_input.value;

    if(username.trim()){
        let response = await fetch(`${server_address}/user/signin`, {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'user_name': username
            })
        });

        let json = await response.json();

        if(response.status === 500 || json.message === "Campos Incorrectos"){
            username_input.value = "";
            alert('Ya existe un usuario con este nombre');
        }

        if(response.status === 200 && json.message === "Usuario Creado Correctamente"){
            try {
                let token = await getToken(username);
                sessionStorage.setItem('token', token);
                window.location.href = 'index.html';
            } catch {
                username_input.value = "";
                alert("Ocurrió un error al iniciar sesión. Vuelve a intentarlo.")
            }
        }
    }
});