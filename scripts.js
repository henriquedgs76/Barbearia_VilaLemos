document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("agendarHorarioModal");
    const openBtn = document.getElementById("agendarHorarioBtn");
    const closeBtn = document.querySelector(".close-modal");
    const chips = document.querySelectorAll('.h-chip');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

themeToggle.onclick = () => {
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        // Se estiver no tema CLARO, mostra o SOL
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        // Se estiver no tema ESCURO, mostra a LUA
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
};

// Manter o tema salvo ao carregar a página
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

    // Abrir/Fechar Modal
    openBtn.onclick = () => modal.style.display = "flex";
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };

    // Menu Mobile
    menuToggle.onclick = () => navMenu.classList.toggle('active');

    // Fechar menu ao clicar em links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.onclick = () => navMenu.classList.remove('active');
    });

    // Bloquear datas passadas
    const dataInput = document.getElementById('data');
    if(dataInput) dataInput.min = new Date().toISOString().split("T")[0];

    // Seleção de Horário
    chips.forEach(chip => {
        chip.onclick = () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedTime = chip.textContent;
        };
    });

    // Envio WhatsApp
    document.getElementById('agendarForm').onsubmit = (e) => {
        e.preventDefault();
        if(!selectedTime) {
            alert("Por favor, selecione um horário.");
            return;
        }

        const nome = document.getElementById('nomeCompleto').value;
        const data = dataInput.value;
        
        const texto = `*NOVO AGENDAMENTO*\n\n` +
                      `💈 *Cliente:* ${nome}\n` +
                      `📅 *Data:* ${data}\n` +
                      `⏰ *Horário:* ${selectedTime}\n` +
                      `📍 *Unidade:* Vila Lemos`;

        window.open(`https://wa.me/5519995618697?text=${encodeURIComponent(texto)}`, '_blank');
        modal.style.display = "none";
    };
});