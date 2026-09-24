const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.querySelector('.chat-form');
const chatInput = chatForm.querySelector('input');
const chatLauncher = document.querySelector('.chat-launcher');
const chatModal = document.querySelector('.chat-modal');
const chatCloseButtons = document.querySelectorAll('[data-close-chat]');

themeToggle.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	const isDark = document.body.classList.contains('dark');
	themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
	themeToggle.querySelector('.theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
});

menuToggle.addEventListener('click', () => {
	const isOpen = navLinks.classList.toggle('open');
	menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach((link) => {
	link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function setChatOpen(isOpen) {
	chatModal.hidden = !isOpen;
	chatLauncher.setAttribute('aria-expanded', isOpen);
	chatLauncher.classList.toggle('chat-open', isOpen);

	if (isOpen) {
		chatInput.focus();
	}
}

chatLauncher.addEventListener('click', () => setChatOpen(true));
chatCloseButtons.forEach((button) => {
	button.addEventListener('click', () => setChatOpen(false));
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !chatModal.hidden) {
		setChatOpen(false);
		chatLauncher.focus();
	}
});

const answers = {
    'Hi!': "Hello, I'm Lorraine. What do you want to know about me?",
	'what do you study?': `I'm studying, with a focus on web development, design, and practical problem-solving.`,
	'what are your skills?': 'My current toolkit includes HTML, CSS, JavaScript, and responsive web design.',
	'how can i contact you?': 'You can email me at lorrainecabatic.aine@gmail.com, or use the message form in the contact section.',
};

function addMessage(text, type) {
	const message = document.createElement('div');
	message.className = `${type}-message`;
	message.textContent = text;
	chatMessages.appendChild(message);
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerQuestion(question) {
	const normalized = question.trim().toLowerCase();
	const answer = answers[normalized] || 'I’m still learning that one. Try asking about my studies, skills, or contact details.';
	addMessage(question, 'user');
	window.setTimeout(() => addMessage(answer, 'bot'), 250);
}

document.querySelectorAll('[data-question]').forEach((button) => {
	button.addEventListener('click', () => answerQuestion(button.dataset.question));
});

chatForm.addEventListener('submit', (event) => {
	event.preventDefault();
	if (chatInput.value.trim()) {
		answerQuestion(chatInput.value);
		chatInput.value = '';
	}
});

document.querySelector('.contact-form').addEventListener('submit', (event) => {
	event.preventDefault();
	event.currentTarget.querySelector('.form-note').textContent = 'Thanks! This sample form is ready to connect to a backend.';
	event.currentTarget.reset();
});
