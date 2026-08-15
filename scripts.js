const btn = document.getElementById("generar-btn");
const btnDinamico = document.getElementById("generar-dinamico-btn");
const qrContainer = document.getElementById("qrcode"); 

const bbdd = window.supabase.createClient(
    "https://bfxsiqkicxetuwrygtij.supabase.co",
    "sb_publishable_LXqdCSrppPPfRVTX0EmdbQ_TNjOhmNh"
);

alreadyLogged();


const params = new URLSearchParams(window.location.search);
const codigo = params.get("qr");
//const codigo = window.location.pathname.substring(1);
async function redirigir() {
    const { data, error } = await bbdd
        .from("generados")
        .select("url")
        .eq("uri", codigo)
        .single();
    if (data) {
        window.location.replace(data.url);
    }
}

if (codigo) {
    redirigir();
}

async function userAllCodes(id) {
    const { data, error } = await bbdd
    .from("generados")
    .select("*")
    .eq("user_id", id);
    if (error) {
        console.error(error);
    } else {
        return data;
    }
}

async function generarQr(uri) {
    var url = "";
    qrContainer.innerHTML = "";
    const codeQr = Math.random().toString(36).substring(2, 10);
    url = "https://marcogpudc.github.io/generador-qr/" + "?qr=" + codeQr;
    new QRCode(qrContainer, {
        text: url,
        width: 512,
        height: 512
    });
    guardarQr(await bbdd.auth.getUser().then(res => res.data.user.id), codeQr);
}

async function verQr(url) {
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url,
        width: 512,
        height: 512
    });
}

async function generarQrEstatico(url) {
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: url,
        width: 512,
        height: 512
    });
}
btn.addEventListener("click", () => {

    const url = document
        .getElementById("url-input")
        .value;

    generarQrEstatico(url);

});

btnDinamico.addEventListener("click", async () => {
    const { data: { session } } = await bbdd.auth.getSession();
    if (session) { 
        const url = document
        .getElementById("url-input")
        .value;

    generarQr(url);
    } else {
        alert("Debes iniciar sesión para generar un QR dinámico.");
    }
});


function mostrarGenerados(data) {
    const generadosContainer = document.getElementById("generados-container");
    generadosContainer.innerHTML = "";
    const list = document.createElement("ul");
    if (data && data.length > 0) {
        data.forEach(item => {
            const itemUrl = window.location.pathname + "?qr=" + item.uri;
            const listItem = document.createElement("li");
            listItem.textContent = `URL: ${item.url}, URI: ${item.uri}`;
            listItem.innerHTML += `<button id="btn-verqr" onclick="verQr('${itemUrl}')">Ver QR</button> <button id="btn-editar" onclick="editarQr('${item.id}')">Editar</button> <button id="btn-eliminar" onclick="eliminarQr('${item.id}')">X</button>`;
            list.appendChild(listItem);
        });
    }
    generadosContainer.appendChild(list);
    generadosContainer.style.display = "block";
}

async function editarQr(id) {
    const { data, error } = await bbdd
        .from("generados")
        .select("*")
        .eq("id", id)
        .single();
    if (data) {
        const newUrl = prompt("Ingrese la nueva URL:", data.url);
        if (newUrl) {
            const { error } = await bbdd
                .from("generados")
                .update({ url: newUrl })
                .eq("id", id);
            if (error) {
                console.error(error);
            } else {
                mostrarGenerados(await userAllCodes(data.user_id));
                alert("URL actualizada correctamente");
            }

        }
    } else {
        console.error(error);
    }
};

async function guardarQr(id, uri) {
    const { data, error } = await bbdd
        .from("generados")
        .insert([
            { 
                uri: uri || Math.random().toString(36).substring(2, 10), 
                user_id: id,
                url: document.getElementById("url-input").value
            }
            ])
        .select('uri')
    if (error) {
        console.error(error);
    }else {
        mostrarGenerados(await userAllCodes(id));
        alert("QR guardado correctamente");
    }
}

async function eliminarQr(id) {
    const { data, error } = await bbdd
        .from("generados")
        .delete()
        .eq("id", id)
        .select("user_id");
    if (error) {
        console.error(error);
    } else {
        alert("QR eliminado correctamente");
        mostrarGenerados(await userAllCodes(data[0].user_id));
    }
}

const botonGuardarQr = document.getElementById("save-qr-btn");

async function alreadyLogged() {
    try {
    // El await es crucial aquí. Obliga a JS a esperar a que Supabase 
    // termine de acceder al disco y cargar la información.
    const { data, error } = await bbdd.auth.getSession();

    if (error) {
        console.error("Error al obtener sesión:", error);
        return;
    }

    if (data.session) {
        const btnLogout = document.getElementById("logout-btn");
        const btnSingup = document.getElementById("signup-btn");
        const btnSaveQr = document.getElementById("save-qr-btn");
        const qrContainer = document.getElementById("qrcode");
        const passwordInput = document.getElementById("password");
        const usernameInput = document.getElementById("username");
        const loginBtn = document.getElementById("login-btn");
        btnSingup.style.display = "none";
        btnLogout.style.display = "inline-block";
        btnSaveQr.style.display = "inline-block";
        loginBtn.style.display = "none";
        usernameInput.style.display = "none";
        passwordInput.style.display = "none";
        qrContainer.innerHTML = "";
        passwordInput.value = "";
        mostrarGenerados(await userAllCodes(data.session.user.id));
    }
    } catch (err) {
        console.error("Error inesperado:", err);
    }
};