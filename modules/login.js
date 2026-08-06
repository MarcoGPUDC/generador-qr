

document.getElementById("signup-btn").addEventListener("click", async () => {
    document.getElementById("singupContainer").style.display = "block";
})

const signupSubmitBtn = document.getElementById("signup-submit-btn");
signupSubmitBtn.addEventListener("click", async () => {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const email = document.getElementById("signup-email").value;
    const { data, error } = await bbdd.auth.signUp({
        email: email,
        password: password, // Pasas la clave cruda. Supabase la hashea en su servidor.
        display: username
    })
    if (error) {
        console.error(error);
        alert("Error al registrarse: " + error.message);
    } else {
        alert("Usuario registrado correctamente");
        document.getElementById("singupContainer").style.display = "none";
        document.getElementById("signup-username").value = "";
        document.getElementById("signup-password").value = "";
        document.getElementById("signup-email").value = "";
    }
});

const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", async () => {
    const passwordInput = document.getElementById("password");
    const usernameInput = document.getElementById("username");
    const { data, error } = await bbdd.auth.signInWithPassword({
        email: usernameInput.value,
        password: passwordInput.value, // Supabase comprueba el hash internamente
    })
    if (!error) {
        alert("Usuario logueado correctamente");
        const btnLogout = document.getElementById("logout-btn");
        const btnSingup = document.getElementById("signup-btn");
        const btnSaveQr = document.getElementById("save-qr-btn");
        btnSingup.style.display = "none";
        btnLogout.style.display = "inline-block";
        btnSaveQr.style.display = "inline-block";
        loginBtn.style.display = "none";
        usernameInput.style.display = "none";
        passwordInput.style.display = "none";
        mostrarGenerados(await userAllCodes(data.user.id));
        passwordInput.value = "";
        const btnGuardarQr = document.getElementById("save-qr-btn");
        btnGuardarQr.addEventListener("click", async () => {
            await guardarQr(data.user.id);
            mostrarGenerados(await userAllCodes(data.user.id));
        });
    } else {
        console.log(error);
        alert("Usuario o contraseña incorrectos");
    }
});

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", async () => {
    const { error } = await bbdd.auth.signOut()

    if (error) {
        console.error("Error al cerrar sesión:", error.message)
    } else {
        console.log("Sesión cerrada correctamente")
    }
    const btnSingup = document.getElementById("signup-btn");
    const btnLogout = document.getElementById("logout-btn");
    const loginBtn = document.getElementById("login-btn");
    const btnSaveQr = document.getElementById("save-qr-btn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const generadosContainer = document.getElementById("generados-container");
    
    generadosContainer.style.display = "none";
    generadosContainer.innerHTML = "";
    btnSingup.style.display = "inline-block";
    btnLogout.style.display = "none";
    loginBtn.style.display = "inline-block";
    usernameInput.style.display = "inline-block";
    passwordInput.style.display = "inline-block";
    btnSaveQr.style.display = "none";
});