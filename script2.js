
$(document).ready(function () {
    $("#form").submit(function (event) {
        event.preventDefault();
        var nombreUsuario = $("#username").val();
        var password = $("#password").val();
        verificarCredenciales(nombreUsuario, password);
    });

    function verificarCredenciales(username, password) {
        $.getJSON('users.json', function (data) {
            var usuarioEncontrado = false;

            $.each(data, function (index, user) {
                if (user.username === username && user.password === password) {
                    saldo = user.saldo;
                    localStorage.setItem('saldo', saldo);
                    localStorage.setItem('username', username);
                    usuarioEncontrado = true;
                    return false; // Termina el bucle si encuentra una coincidencia
                }
            });

            if (usuarioEncontrado) {
                window.location.href = 'menu.html';
            } else {
                alert("Contraseña o usuario incorrectos");
            }
        });
    }
});



    $(".paymentForm").submit(function (event) {
        event.preventDefault();

        var amount = parseFloat($("input[name='number']").val());

        if (!isNaN(amount) && amount > 0) {
            var currentBalance = localStorage.getItem('saldo');
            var currentBalance = parseFloat(currentBalance);
            var newBalance = currentBalance + amount;

            // Actualizamos el saldo en localStorage
            localStorage.setItem('saldo', newBalance);
            document.getElementById("saldo").innerHTML = " " + newBalance;

            // Actualizamos el saldo en el archivo JSON localmente
            var username = localStorage.getItem('username');
            $.getJSON('users.json', function (data) {
                var foundUser = false;

                // Buscamos y actualizamos el saldo del usuario
                $.each(data, function (index, user) {
                    if (user.username === username) {
                        user.saldo = newBalance;
                        foundUser = true;
                        return false; // Detenemos la iteración
                    }
                });

                // Verificamos si se encontró al usuario
                if (foundUser) {
                    // Actualizamos el archivo JSON localmente
                    var updatedData = JSON.stringify(data, null, 2);

                    // Puedes guardar el archivo JSON localmente aquí, dependiendo de tu entorno
                    // Por ejemplo, si estás trabajando en un entorno con Node.js, puedes usar el módulo fs para escribir en el archivo
                    // fs.writeFileSync('users.json', updatedData);

                    console.log("Saldo actualizado localmente.");
                } else {
                    console.error("Usuario no encontrado en el archivo JSON.");
                }
            });
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    });
