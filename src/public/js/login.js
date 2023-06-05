const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  const response = await fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "content-type": "application/json",
    },
  });
  const resposeData = await response.json();
  if (resposeData.status === "succes") {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      title: `Logueado`,
      icon: "success",
    });
    window.location.replace("/");
  } else {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      title: `Usuario o clave incorrectos`,
      icon: "error",
    });
  }
});