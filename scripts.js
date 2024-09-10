


document.getElementById('localizacaoLink').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    document.getElementById('mapaSection').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('sobreLink').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    document.getElementById('barbearia-info').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('servicosLink').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    document.getElementById('servicos').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('contatosLink').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    document.getElementById('footer-contact').scrollIntoView({ behavior: 'smooth' });
});




// Modal
var modal = document.getElementById("agendarHorarioModal");

// Botão que abre o modal
var btn = document.getElementById("agendarHorarioBtn");

// Botão para fechar o modal
var span = document.getElementsByClassName("close")[0];

// Abrir o modal ao clicar no botão
btn.onclick = function() {
    modal.style.display = "block";
}

// Fechar o modal ao clicar no X
span.onclick = function() {
    modal.style.display = "none";
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Código JavaScript existente para modal
var modal = document.getElementById("agendarHorarioModal");
var btn = document.getElementById("agendarHorarioBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Código para agendamento via WhatsApp
document.getElementById('agendarForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    var nome = document.getElementById('nomeCompleto').value;
    var data = document.getElementById('data').value;
    var unidade = document.getElementById('unidade').value;
    var horario = document.querySelector('.horario-buttons button.active').textContent;

    var mensagem = encodeURIComponent(`Agendamento solicitado:
    Nome: ${nome}
    Data: ${data}
    Unidade: ${unidade}
    Horário: ${horario}
    `);

    var numeroWhatsApp = "5519995618697"; 
    var linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;

    window.location.href = linkWhatsApp; // Redireciona para o WhatsApp
});

// Adiciona a classe active ao botão de horário selecionado
var horarioButtons = document.querySelectorAll('.horario-buttons .horario-btn');

horarioButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        horarioButtons.forEach(btn => btn.classList.remove('active')); // Remove a classe de todos
        button.classList.add('active'); // Adiciona a classe ao botão clicado
    });
});

document.getElementById('menuToggle').addEventListener('click', function () {
    var menu = document.getElementById('navMenu');
    menu.classList.toggle('show');
});
