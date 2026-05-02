const btn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem("theme");

if (currentTheme === 'dark') {
    document.body.classList.add('dark');
} else if (currentTheme === null) {
    document.body.classList.add('dark');
}

btn.addEventListener("click", () => {
    console.log("clicou");
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
