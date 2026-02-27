document.addEventListener("DOMContentLoaded", () => {
    const WHATSAPP_PHONE = "5519995618697";
    const CLOSED_WEEKDAY = 0; // Sunday
    const SATURDAY_WEEKDAY = 6;
    const WEEKDAY_OPEN_MINUTES = 10 * 60 + 30;
    const WEEKDAY_CLOSE_MINUTES = 18 * 60;
    const SATURDAY_OPEN_MINUTES = 7 * 60 + 30;
    const SATURDAY_CLOSE_MINUTES = 17 * 60;
    const SLOT_STEP_MINUTES = 30;

    const body = document.body;
    const modal = document.getElementById("agendarHorarioModal");
    const modalOpenTriggers = Array.from(document.querySelectorAll("[data-open-modal]"));
    const closeBtn = document.querySelector(".close-modal");
    const timeGrid = document.querySelector(".horarios-grid");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
    const dataInput = document.getElementById("data");
    const form = document.getElementById("agendarForm");
    const serviceInput = document.getElementById("servico");
    const nameInput = document.getElementById("nomeCompleto");
    const phoneInput = document.getElementById("telefone");
    const formMessage = document.getElementById("formMessage");
    const yearEl = document.getElementById("currentYear");
    const serviceCards = Array.from(document.querySelectorAll(".service-card"));
    const backToTopBtn = document.getElementById("backToTop");
    const themeColorMeta = document.querySelector("meta[name='theme-color']");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let chips = [];
    let selectedTime = "";
    let lastFocusedElement = null;

    const weekdayNames = [
        "Domingo",
        "Segunda-feira",
        "Terca-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sabado"
    ];

    const setCurrentYear = () => {
        if (!yearEl) {
            return;
        }

        yearEl.textContent = String(new Date().getFullYear());
    };

    const setFormMessage = (text, state = "info") => {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = text;
        formMessage.dataset.state = text ? state : "";
    };

    const clearFormMessage = () => {
        setFormMessage("", "");
    };

    const getTimeInMinutes = (timeText) => {
        const [hours, minutes] = String(timeText).split(":").map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return -1;
        }

        return hours * 60 + minutes;
    };

    const toIsoDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const minutesToTimeLabel = (totalMinutes) => {
        const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
        const minutes = String(totalMinutes % 60).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const getSelectedDateObject = (isoDate) => {
        const [year, month, day] = String(isoDate).split("-").map(Number);
        if (!year || !month || !day) {
            return null;
        }

        return new Date(year, month - 1, day);
    };

    const isToday = (isoDate) => {
        const selectedDate = getSelectedDateObject(isoDate);
        if (!selectedDate) {
            return false;
        }

        const now = new Date();
        return (
            selectedDate.getFullYear() === now.getFullYear() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getDate() === now.getDate()
        );
    };

    const getNextAvailableIsoDate = (baseIsoDate) => {
        const baseDate = getSelectedDateObject(baseIsoDate) || new Date();
        while (baseDate.getDay() === CLOSED_WEEKDAY) {
            baseDate.setDate(baseDate.getDate() + 1);
        }
        return toIsoDate(baseDate);
    };

    const getScheduleWindow = (weekdayNumber) => {
        if (weekdayNumber === SATURDAY_WEEKDAY) {
            return {
                start: SATURDAY_OPEN_MINUTES,
                end: SATURDAY_CLOSE_MINUTES
            };
        }

        return {
            start: WEEKDAY_OPEN_MINUTES,
            end: WEEKDAY_CLOSE_MINUTES
        };
    };

    const buildSlotsForDate = (isoDate) => {
        const selectedDate = getSelectedDateObject(isoDate);
        if (!selectedDate) {
            return [];
        }

        const weekday = selectedDate.getDay();
        if (weekday === CLOSED_WEEKDAY) {
            return [];
        }

        const window = getScheduleWindow(weekday);
        const slots = [];
        for (let minutes = window.start; minutes <= window.end; minutes += SLOT_STEP_MINUTES) {
            slots.push(minutesToTimeLabel(minutes));
        }
        return slots;
    };

    const renderTimeChips = (isoDate) => {
        if (!timeGrid) {
            return;
        }

        selectedTime = "";
        chips = [];
        timeGrid.innerHTML = "";

        if (!isoDate) {
            setFormMessage("Selecione uma data para visualizar os horarios.", "info");
            return;
        }

        if (isClosedDay(isoDate)) {
            setFormMessage("Domingo esta fechado. Escolha segunda a sexta ou sabado.", "error");
            return;
        }

        const slots = buildSlotsForDate(isoDate);
        const selectedDate = getSelectedDateObject(isoDate);
        const weekday = selectedDate ? selectedDate.getDay() : null;
        const fragment = document.createDocumentFragment();

        slots.forEach((slot) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "h-chip";
            chip.setAttribute("aria-pressed", "false");
            chip.textContent = slot;
            chip.addEventListener("click", () => selectTimeChip(chip));
            fragment.appendChild(chip);
        });

        timeGrid.appendChild(fragment);
        chips = Array.from(timeGrid.querySelectorAll(".h-chip"));

        if (weekday === SATURDAY_WEEKDAY) {
            setFormMessage("Sabado: horarios de 07:30 ate 17:00.", "info");
            return;
        }

        setFormMessage("Segunda a sexta: horarios de 10:30 ate 18:00.", "info");
    };

    const formatBrazilianPhone = (rawValue) => {
        const digits = String(rawValue).replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 2) {
            return digits;
        }
        if (digits.length <= 6) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        }
        if (digits.length <= 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    const setTheme = (theme) => {
        const isLight = theme === "light";
        body.classList.toggle("light-theme", isLight);

        if (themeIcon) {
            themeIcon.classList.toggle("fa-sun", isLight);
            themeIcon.classList.toggle("fa-moon", !isLight);
        }

        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(isLight));
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", isLight ? "#f2f2f2" : "#0d0d0d");
        }

        localStorage.setItem("theme", isLight ? "light" : "dark");
    };

    const toggleTheme = () => {
        const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
        setTheme(nextTheme);
    };

    const closeMobileMenu = () => {
        if (!menuToggle || !navMenu) {
            return;
        }

        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMobileMenu = () => {
        if (!menuToggle || !navMenu) {
            return;
        }

        const isActive = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isActive));
    };

    const setLocalMinDate = () => {
        if (!dataInput) {
            return;
        }

        const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
        dataInput.min = localDate.toISOString().split("T")[0];
    };

    const clearSelectedTime = () => {
        selectedTime = "";
        chips.forEach((chip) => {
            chip.classList.remove("active");
            chip.setAttribute("aria-pressed", "false");
        });
    };

    const selectTimeChip = (chip) => {
        chips.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });

        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        selectedTime = (chip.textContent || "").trim();
        clearFormMessage();
    };

    const formatDateBR = (isoDate) => {
        if (!isoDate) {
            return "";
        }

        const [year, month, day] = isoDate.split("-");
        if (!year || !month || !day) {
            return isoDate;
        }

        return `${day}/${month}/${year}`;
    };

    const isClosedDay = (isoDate) => {
        if (!isoDate) {
            return false;
        }

        const [year, month, day] = isoDate.split("-").map(Number);
        const checkDate = new Date(year, month - 1, day);
        return checkDate.getDay() === CLOSED_WEEKDAY;
    };

    const focusableSelector = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([type='hidden']):not([disabled])",
        "select:not([disabled])",
        "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    const trapModalFocus = (event) => {
        if (!modal || modal.style.display !== "flex" || event.key !== "Tab") {
            return;
        }

        const focusable = Array.from(modal.querySelectorAll(focusableSelector));
        if (focusable.length === 0) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
            return;
        }

        if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const openModal = (serviceName = "") => {
        if (!modal) {
            return;
        }

        lastFocusedElement = document.activeElement;
        modal.style.display = "flex";
        body.classList.add("modal-open");
        clearFormMessage();

        if (serviceInput) {
            serviceInput.value = serviceName || "";
        }

        if (dataInput) {
            if (!dataInput.value) {
                dataInput.value = getNextAvailableIsoDate(dataInput.min || "");
            }
            renderTimeChips(dataInput.value);
        }

        if (nameInput) {
            nameInput.focus();
        }
    };

    const closeModal = () => {
        if (!modal) {
            return;
        }

        modal.style.display = "none";
        body.classList.remove("modal-open");
        clearSelectedTime();
        clearFormMessage();

        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    };

    const sendWhatsAppMessage = ({ nome, telefone, servico, data, horario }) => {
        const formattedDate = formatDateBR(data);
        const selectedDate = getSelectedDateObject(data);
        const weekday = selectedDate ? weekdayNames[selectedDate.getDay()] : "";
        const message =
            `*NOVO AGENDAMENTO*\n\n` +
            `Cliente: ${nome}\n` +
            `Telefone: ${telefone || "Nao informado"}\n` +
            `Servico: ${servico}\n` +
            `Data: ${formattedDate}${weekday ? ` (${weekday})` : ""}\n` +
            `Horario: ${horario}\n` +
            `Unidade: Vila Lemos`;

        const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const setupTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        const preferredBySystem = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredBySystem);

        if (themeToggle) {
            themeToggle.addEventListener("click", toggleTheme);
        }
    };

    const setupMenu = () => {
        if (!menuToggle || !navMenu) {
            return;
        }

        menuToggle.addEventListener("click", toggleMobileMenu);

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", (event) => {
            const target = event.target;
            const clickedInsideMenu = target instanceof Node && navMenu.contains(target);
            const clickedToggle = target instanceof Node && menuToggle.contains(target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });
    };

    const setupModal = () => {
        if (!modal) {
            return;
        }

        modalOpenTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const serviceName = trigger.getAttribute("data-open-service") || "";
                openModal(serviceName);
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal);
        }

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.style.display === "flex") {
                closeModal();
            }
            trapModalFocus(event);
        });
    };

    const setupScheduleForm = () => {
        if (!form || !dataInput || !serviceInput || !nameInput) {
            return;
        }

        setLocalMinDate();

        if (!dataInput.value) {
            dataInput.value = getNextAvailableIsoDate(dataInput.min || "");
        }
        renderTimeChips(dataInput.value);

        if (phoneInput) {
            phoneInput.addEventListener("input", () => {
                phoneInput.value = formatBrazilianPhone(phoneInput.value);
            });
        }

        dataInput.addEventListener("change", () => {
            renderTimeChips(dataInput.value);
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            clearFormMessage();

            const nome = nameInput.value.trim().replace(/\s+/g, " ");
            const telefone = phoneInput ? phoneInput.value.trim() : "";
            const telefoneNumeros = telefone.replace(/\D/g, "");
            const servico = serviceInput.value;
            const data = dataInput.value;

            if (nome.length < 3) {
                setFormMessage("Informe um nome valido com pelo menos 3 caracteres.", "error");
                nameInput.focus();
                return;
            }

            if (telefone && (telefoneNumeros.length < 10 || telefoneNumeros.length > 11)) {
                setFormMessage("Informe um WhatsApp valido com DDD ou deixe o campo vazio.", "error");
                if (phoneInput) {
                    phoneInput.focus();
                }
                return;
            }

            if (!servico) {
                setFormMessage("Selecione um servico para continuar.", "error");
                serviceInput.focus();
                return;
            }

            if (!data) {
                setFormMessage("Selecione uma data para continuar.", "error");
                dataInput.focus();
                return;
            }

            if (isClosedDay(data)) {
                setFormMessage("Domingo esta fechado. Escolha segunda a sexta ou sabado.", "error");
                dataInput.focus();
                return;
            }

            if (!selectedTime) {
                setFormMessage("Por favor, selecione um horario.", "error");
                return;
            }

            if (isToday(data)) {
                const selectedMinutes = getTimeInMinutes(selectedTime);
                const now = new Date();
                const nowMinutes = now.getHours() * 60 + now.getMinutes();

                if (selectedMinutes <= nowMinutes + 30) {
                    setFormMessage("Escolha um horario com pelo menos 30 minutos de antecedencia.", "error");
                    return;
                }
            }

            sendWhatsAppMessage({ nome, telefone: telefoneNumeros ? telefone : "", servico, data, horario: selectedTime });
            setFormMessage("Redirecionando para o WhatsApp...", "success");
            closeModal();
            form.reset();
        });
    };

    const setupServiceCards = () => {
        if (!serviceCards.length) {
            return;
        }

        serviceCards.forEach((card) => {
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Agendar ${card.dataset.service || "servico"}`);

            const openWithCardService = () => {
                const serviceName = card.dataset.service || "";
                openModal(serviceName);
            };

            card.addEventListener("click", openWithCardService);
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openWithCardService();
                }
            });
        });
    };

    const setupScrollSpy = () => {
        if (!navLinks.length || !("IntersectionObserver" in window)) {
            return;
        }

        const sectionIds = navLinks
            .map((link) => (link.getAttribute("href") || "").replace("#", ""))
            .filter(Boolean);

        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((section) => section !== null);

        if (!sections.length) {
            return;
        }

        const setActiveLink = (id) => {
            navLinks.forEach((link) => {
                const href = link.getAttribute("href");
                const isActive = href === `#${id}`;
                link.classList.toggle("is-active", isActive);
                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        };

        const spyObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible.length > 0) {
                    setActiveLink(visible[0].target.id);
                }
            },
            {
                threshold: [0.2, 0.45, 0.7],
                rootMargin: "-20% 0px -55% 0px"
            }
        );

        sections.forEach((section) => spyObserver.observe(section));
    };

    const setupReveal = () => {
        const revealTargets = Array.from(
            document.querySelectorAll(
                ".section-title, .quick-item, .about-text p, .feat-item, .process-step, .service-card, .proof-subtitle, .stat-card, .testimonial-card, .faq-item, .address-text, .map-container, .footer-info, .footer-social"
            )
        );

        revealTargets.forEach((element, index) => {
            element.classList.add("reveal");
            element.style.setProperty("--reveal-delay", `${(index % 5) * 80}ms`);
        });

        if (reduceMotion) {
            revealTargets.forEach((element) => element.classList.add("in-view"));
            return;
        }

        if (!("IntersectionObserver" in window)) {
            revealTargets.forEach((element) => element.classList.add("in-view"));
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealTargets.forEach((element) => revealObserver.observe(element));
    };

    const setupScrollEffects = () => {
        if (!backToTopBtn) {
            return;
        }

        const updateScrollState = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            body.classList.toggle("has-scrolled", y > 8);
            backToTopBtn.classList.toggle("visible", y > 520);
        };

        window.addEventListener("scroll", updateScrollState, { passive: true });
        updateScrollState();

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });
    };

    setCurrentYear();
    setupTheme();
    setupMenu();
    setupModal();
    setupScheduleForm();
    setupServiceCards();
    setupScrollSpy();
    setupReveal();
    setupScrollEffects();

});
