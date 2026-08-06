const btn = document.getElementById("generar-btn");
const qrContainer = document.getElementById("qrcode"); 

const bbdd = window.supabase.createClient(
    "https://bfxsiqkicxetuwrygtij.supabase.co",
    "sb_publishable_LXqdCSrppPPfRVTX0EmdbQ_TNjOhmNh"
);

const params = new URLSearchParams(window.location.search);
const codigo = params.get("qr");
//const codigo = window.location.pathname.substring(1);
console.log(codigo)
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

function generarQr(uri) {
    qrContainer.innerHTML = "";
    const url = window.location.origin + "/?qr=" + uri;
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

    generarQr(url);

});

function mostrarGenerados(data) {
    const generadosContainer = document.getElementById("generados-container");
    generadosContainer.innerHTML = "";
    const list = document.createElement("ul");
    if (data && data.length > 0) {
        data.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `URL: ${item.url}, URI: ${item.uri}`;
            listItem.innerHTML += `<button id="btn-verqr" onclick="generarQr('${item.uri}')">Ver QR</button> <button id="btn-editar" onclick="editarQr('${item.id}')">Editar</button> <button id="btn-eliminar" onclick="eliminarQr('${item.id}')">X</button>`;
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

async function guardarQr(id) {
    const { data, error } = await bbdd
        .from("generados")
        .insert([
            { 
                uri: Math.random().toString(36).substring(2, 10), 
                user_id: id,
                url: document.getElementById("url-input").value
            }
            ])
        .select()
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
