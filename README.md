# Barbearia Vila Lemos - Tradicao e Estilo

![Status](https://img.shields.io/badge/Status-Online-gold?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-blue?style=for-the-badge)

Landing page institucional da **Barbearia Vila Lemos** (Campinas/SP) com foco em experiencia premium e agendamento rapido via WhatsApp.

## Destaques da versao atual

- Design premium com tema escuro/claro e visual de **poligrafismo**.
- Animacoes de entrada em textos, secoes e cards.
- Bloco de diferenciais rapidos e secao "Como funciona" para aumentar clareza da oferta.
- Prova social com indicadores de resultado e depoimentos de clientes.
- CTA fixa no mobile para aumentar conversao de agendamento.
- Contraste refinado entre tema escuro/claro para manter leitura confortavel.
- FAQ interativo com schema (`FAQPage`) para melhorar SEO.
- Botao de voltar ao topo e efeitos de scroll para navegacao mais fluida.
- Modal de agendamento com:
  - validacao de nome, servico, data e horario;
  - validacao de telefone opcional com mascara;
  - bloqueio de domingo (atendimento seg-sex 10:30-18:00 e sab 07:30-17:00);
  - bloqueio de horarios com menos de 30 min de antecedencia no dia atual;
  - envio automatico para WhatsApp com mensagem formatada.
- Acessibilidade reforcada:
  - skip link;
  - foco visivel;
  - modal com foco preso (focus trap);
  - navegacao com `aria-*` e destaque de secao ativa.
- Melhorias tecnicas:
  - metadados SEO e Open Graph;
  - JSON-LD (`Barbershop`);
  - links externos com `noopener noreferrer`;
  - ano dinamico no rodape.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6)
- Font Awesome
- Google Fonts (Oswald + Montserrat)

## Estrutura

- `index.html`: estrutura semantica e SEO.
- `styles.css`: tema, layout responsivo, animacoes e poligrafismo.
- `scripts.js`: interacoes, acessibilidade e fluxo de agendamento.
- `img/`: assets visuais.

## Como executar localmente

1. Clone o repositorio.
2. Abra `index.html` no navegador.

Opcional: use um servidor local para testes mais realistas (ex.: Live Server no VS Code).

## Licenca

Este projeto esta sob a licenca MIT. Consulte o arquivo [LICENSE](LICENSE).
