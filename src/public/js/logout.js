const logoutButton = document.getElementById("loguotButton");

// Agrega un event listener al botón de logout
logoutButton.addEventListener("click", function () {
  // Realiza una petición POST al endpoint de logout
  fetch("/api/sessions/logout", {
    method: "POST",
  })
  .then((response) => {
    if (response.ok) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        title: `Cerrando sesión...`,
        icon: "success",
      });
  
      setTimeout(() => {
        window.location.replace("/login");
      }, 2000);
    }
  })
    .catch((error) => {
      console.error("Error al realizar la petición:", error);
    });
});