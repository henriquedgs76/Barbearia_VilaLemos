document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("agendarHorarioModal");
    const openBtn = document.getElementById("agendarHorarioBtn");
    const closeBtn = document.querySelector(".close-modal");
    const chips = document.querySelectorAll('.h-chip');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    let selectedTime = "";

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