const canvas = document.querySelector(".binary-background");
const context = canvas.getContext("2d");
const loadingScreen = document.querySelector(".loading-screen");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = themeToggle.querySelector(".theme-label");
const themeIcon = themeToggle.querySelector(".theme-icon");
const navMenuToggle = document.querySelector(".nav-menu-toggle");
const navLinks = document.querySelector(".nav-links");
const fontSize = 16;
let columns = 0;
let drops = [];
let animationFrame;

function finishLoading() {
	if (!loadingScreen || loadingScreen.classList.contains("is-hidden")) return;
	loadingScreen.classList.add("is-hidden");
	loadingScreen.setAttribute("aria-hidden", "true");
	window.setTimeout(() => loadingScreen.remove(), 500);
}

if (document.readyState === "complete") {
	window.setTimeout(finishLoading, 450);
} else {
	window.addEventListener("load", () => window.setTimeout(finishLoading, 450), { once: true });
}
window.setTimeout(finishLoading, 2600);

function setTheme(theme, persist = false) {
	const nextTheme = theme === "dark" ? "light" : "dark";
	document.body.dataset.theme = theme;
	themeLabel.textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
	themeIcon.textContent = theme === "dark" ? "☼" : "◐";
	themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
	themeToggle.setAttribute("aria-pressed", String(theme === "light"));

	if (persist) {
		try {
			localStorage.setItem("portfolio-theme", theme);
		} catch {}
	}
}

let savedTheme = "dark";
try {
	savedTheme = localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
} catch {}
setTheme(savedTheme);
themeToggle.addEventListener("click", () => {
	setTheme(document.body.dataset.theme === "dark" ? "light" : "dark", true);
});

function setMobileMenuOpen(isOpen) {
	navLinks.classList.toggle("is-open", isOpen);
	navMenuToggle.setAttribute("aria-expanded", String(isOpen));
	navMenuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
	navMenuToggle.setAttribute("title", isOpen ? "Close navigation" : "Open navigation");
}

navMenuToggle.addEventListener("click", () => {
	setMobileMenuOpen(!navLinks.classList.contains("is-open"));
});

navLinks.querySelectorAll("a").forEach(link => {
	link.addEventListener("click", () => setMobileMenuOpen(false));
});

document.addEventListener("keydown", event => {
	if (event.key === "Escape") setMobileMenuOpen(false);
});

window.addEventListener("resize", () => {
	if (window.innerWidth > 760) setMobileMenuOpen(false);
});

const chatLauncher = document.querySelector(".chat-launcher");
const chatModal = document.querySelector(".chat-modal");
const chatClose = chatModal.querySelector("[data-close-chat]");
const chatMessages = chatModal.querySelector(".chat-messages");
const chatForm = chatModal.querySelector(".chat-form");
const chatInput = chatForm.querySelector("input");
let launcherDrag = null;
let suppressLauncherClick = false;

function openChat() {
	chatModal.hidden = false;
	chatLauncher.setAttribute("aria-expanded", "true");
	chatInput.focus({ preventScroll: true });
}

function closeChat() {
	chatModal.hidden = true;
	chatLauncher.setAttribute("aria-expanded", "false");
	chatLauncher.focus({ preventScroll: true });
}

function addChatMessage(message, className) {
	const bubble = document.createElement("div");
	bubble.className = className;
	bubble.textContent = message;
	chatMessages.append(bubble);
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getChatReply(message) {
	const question = message.toLowerCase();
	if (/study|education|school|course/.test(question)) {
		return "Lorraine is a second-year Computer Science student at Lipa City Colleges and a DOST SEI scholar.";
	}
	if (/skill|tool|language|technology/.test(question)) {
		return "Her toolkit includes PHP, JavaScript, Python, SQL, HTML and CSS, database development, Supabase, Git, GitHub, Canva, and VS Code.";
	}
	if (/contact|email|reach/.test(question)) {
		return "You can reach Lorraine at lorrainecabatic.aine@gmail.com.";
	}
	if (/project|work|payroll|bhw/.test(question)) {
		return "Her featured work includes an LCC Payroll System and a Barangay Health Worker Records system. Scroll to Projects to explore them.";
	}
	return "I can help with Lorraine’s studies, skills, projects, and contact details. Try one of the quick questions below.";
}

function sendChatMessage(message) {
	const text = message.trim();
	if (!text) return;
	addChatMessage(text, "user-message");
	window.setTimeout(() => addChatMessage(getChatReply(text), "bot-message"), 250);
}

chatClose.addEventListener("click", closeChat);
chatLauncher.addEventListener("click", event => {
	if (suppressLauncherClick) {
		event.preventDefault();
		suppressLauncherClick = false;
		return;
	}
	if (chatModal.hidden) openChat();
	else closeChat();
});

chatForm.addEventListener("submit", event => {
	event.preventDefault();
	sendChatMessage(chatInput.value);
	chatInput.value = "";
});

chatModal.querySelectorAll("[data-question]").forEach(button => {
	button.addEventListener("click", () => sendChatMessage(button.dataset.question));
});

document.addEventListener("keydown", event => {
	if (event.key === "Escape" && !chatModal.hidden) closeChat();
});

chatLauncher.addEventListener("pointerdown", event => {
	if (event.button !== 0) return;

	const bounds = chatLauncher.getBoundingClientRect();
	launcherDrag = {
		pointerId: event.pointerId,
		startX: event.clientX,
		startY: event.clientY,
		left: bounds.left,
		top: bounds.top,
		moved: false,
	};
	chatLauncher.setPointerCapture(event.pointerId);
});

chatLauncher.addEventListener("pointermove", event => {
	if (!launcherDrag || event.pointerId !== launcherDrag.pointerId) return;

	const deltaX = event.clientX - launcherDrag.startX;
	const deltaY = event.clientY - launcherDrag.startY;
	if (!launcherDrag.moved && Math.hypot(deltaX, deltaY) < 4) return;
	launcherDrag.moved = true;

	const bounds = chatLauncher.getBoundingClientRect();
	const left = Math.max(0, Math.min(window.innerWidth - bounds.width, launcherDrag.left + deltaX));
	const top = Math.max(0, Math.min(window.innerHeight - bounds.height, launcherDrag.top + deltaY));
	chatLauncher.style.left = `${left}px`;
	chatLauncher.style.top = `${top}px`;
	chatLauncher.style.right = "auto";
	chatLauncher.style.bottom = "auto";
});

function finishLauncherDrag(event) {
	if (!launcherDrag || event.pointerId !== launcherDrag.pointerId) return;
	if (launcherDrag.moved) {
		suppressLauncherClick = true;
		window.setTimeout(() => {
			suppressLauncherClick = false;
		}, 0);
	}
	launcherDrag = null;
}

chatLauncher.addEventListener("pointerup", finishLauncherDrag);
chatLauncher.addEventListener("pointercancel", finishLauncherDrag);

window.addEventListener("resize", () => {
	if (!chatLauncher.style.left) return;
	const bounds = chatLauncher.getBoundingClientRect();
	chatLauncher.style.left = `${Math.min(bounds.left, window.innerWidth - bounds.width)}px`;
	chatLauncher.style.top = `${Math.min(bounds.top, window.innerHeight - bounds.height)}px`;
});

document.querySelectorAll("[data-open-dialog]").forEach(trigger => {
	const dialog = document.getElementById(trigger.dataset.openDialog);
	trigger.addEventListener("click", () => dialog.showModal());
	if (trigger.getAttribute("role") === "button") {
		trigger.addEventListener("keydown", event => {
			if (event.key !== "Enter" && event.key !== " ") return;
			event.preventDefault();
			dialog.showModal();
		});
	}
});

document.querySelectorAll(".education-dialog").forEach(dialog => {
	dialog.querySelector(".education-dialog-close").addEventListener("click", () => dialog.close());
	dialog.addEventListener("click", event => {
		if (event.target === dialog) dialog.close();
	});
});

document.querySelectorAll("[data-gallery]").forEach(gallery => {
	const track = gallery.querySelector(".education-gallery-track");
	const slides = [...track.querySelectorAll(".education-gallery-slide")];
	const dots = [...gallery.querySelectorAll("[data-gallery-page]")];
	const previous = gallery.querySelector("[data-gallery-previous]");
	const next = gallery.querySelector("[data-gallery-next]");
let activePage = 0;
let scrollFrame = 0;

	function updatePage(page) {
		activePage = Math.max(0, Math.min(slides.length - 1, page));
		dots.forEach((dot, index) => {
			if (index === activePage) dot.setAttribute("aria-current", "true");
			else dot.removeAttribute("aria-current");
		});
		previous.disabled = activePage === 0;
		next.disabled = activePage === slides.length - 1;
	}

	function goToPage(page) {
		const targetPage = Math.max(0, Math.min(slides.length - 1, page));
		track.scrollTo({ left: targetPage * track.clientWidth, behavior: "smooth" });
		updatePage(targetPage);
	}

	dots.forEach(dot => {
		dot.addEventListener("click", () => goToPage(Number(dot.dataset.galleryPage)));
	});
	previous.addEventListener("click", () => goToPage(activePage - 1));
	next.addEventListener("click", () => goToPage(activePage + 1));
	track.addEventListener("scroll", () => {
		window.cancelAnimationFrame(scrollFrame);
		scrollFrame = window.requestAnimationFrame(() => {
			updatePage(Math.round(track.scrollLeft / track.clientWidth));
		});
	}, { passive: true });
	updatePage(0);
});

function resizeCanvas() {
	const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = Math.floor(window.innerWidth * pixelRatio);
	canvas.height = Math.floor(window.innerHeight * pixelRatio);
	canvas.style.width = `${window.innerWidth}px`;
	canvas.style.height = `${window.innerHeight}px`;
	context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

	const nextColumns = Math.ceil(window.innerWidth / fontSize);
	drops = Array.from({ length: nextColumns }, (_, index) => drops[index] ?? Math.random() * -40);
	columns = nextColumns;
}

// Background-binary

function drawBinaryRain() {
	const isLight = document.body.dataset.theme === "light";
	context.fillStyle = isLight ? "rgb(237 244 232 / 18%)" : "rgb(7 19 15 / 13%)";
	context.fillRect(0, 0, window.innerWidth, window.innerHeight);
	context.font = `${fontSize}px monospace`;

	for (let index = 0; index < columns; index += 1) {
		const digit = Math.random() > 0.5 ? "1" : "0";
		const x = index * fontSize;
		const y = drops[index] * fontSize;
		const isBright = Math.random() > 0.96;
		context.fillStyle = isLight
			? isBright ? "rgb(15 80 40)" : "rgb(38 110 61)"
			: isBright ? "rgb(210 255 222)" : "rgb(105 150 105)";
		context.fillText(digit, x, y);

		if (y > window.innerHeight && Math.random() > 0.975) {
			drops[index] = Math.random() * -30;
		} else {
			drops[index] += 0.45 + Math.random() * 0.35;
		}
	}

	animationFrame = window.requestAnimationFrame(drawBinaryRain);
}

resizeCanvas();
drawBinaryRain();
window.addEventListener("resize", resizeCanvas);

window.addEventListener("pagehide", () => {
	window.cancelAnimationFrame(animationFrame);
});
