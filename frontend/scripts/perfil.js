const perfil = document.getElementById("perfil-btn");
const dropdown = document.getElementsByClassName("menu-dropdown")[0];

// ADICIONADO o (event) aqui dentro dos parênteses
perfil.addEventListener("click", (event) => {
  event.stopPropagation();
  const aberto = dropdown.style.display === "block";
  dropdown.style.display = aberto ? "none" : "block";
});

window.addEventListener("click", (event) => {
  const clicouMenu = dropdown.contains(event.target);
  if (!clicouMenu) {
    dropdown.style.display = "none";
  }
});
