
const btn = document.getElementById("generar-btn");
const qrContainer = document.getElementById("qrcode");

btn.addEventListener("click", () => {

    const url = document
    .getElementById("url-input")
    .value;

    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
    text: url,
    width: 256,
    height: 256
    });

});