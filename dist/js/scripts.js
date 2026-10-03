// swiperGallery
const swiper = window.Swiper
	? new Swiper('.swiperGallery', {
		loop: true,
		slidesPerView: 1,
		autoplay: {
			delay: 5000,
			speed: 1011,
		},
		speed: 1011,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			addIcons: false,
		},
	})
	: null;

const swiperС = window.Swiper
	? new Swiper('.swiperCertificates', {
		breakpoints: {
			1200: {
				slidesPerView: 2,
			},
			1600: {
				slidesPerView: 3,
			},
			1920: {
				slidesPerView: 4,
			},
		},
		spaceBetween: 60,
		touchEventsTarget: "container",
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	})
	: null;


//smth-logo
//url-cleaner
function cleanUrl() {
	history.replaceState(null, '', window.location.pathname + window.location.search);
}

window.addEventListener('DOMContentLoaded', function () {
	const hash = window.location.hash;
	if (!hash) return;

	const target = document.querySelector(hash);

	if (target) {
		setTimeout(() => {
			target.scrollIntoView({ behavior: 'smooth' });
			cleanUrl();
		}, 100);
	} else {
		cleanUrl();
	}
});

const logo = document.querySelector('.header__logo');

logo?.addEventListener('click', function (e) {
	const isHomePage =
		window.location.pathname.endsWith('/index.html') ||
		window.location.pathname.endsWith('/');

	if (isHomePage) {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
		cleanUrl();
	}
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener('click', function (e) {
		const href = this.getAttribute('href');
		const target = document.querySelector(href);
		if (!target) return;

		e.preventDefault();
		target.scrollIntoView({ behavior: 'smooth' });
		cleanUrl();
	});
});


//burger-menu
function toggleMenu() {
	const burger = document.querySelector('.header__burger');
	const nav = document.querySelector('.header__nav');
	const overlay = document.querySelector('.header__overlay');
	const body = document.body;

	burger.classList.toggle('active');
	nav.classList.toggle('active');
	overlay.classList.toggle('active');
	body.classList.toggle('menu-open');
}

function closeMenu() {
	const burger = document.querySelector('.header__burger');
	const nav = document.querySelector('.header__nav');
	const overlay = document.querySelector('.header__overlay');
	const body = document.body;

	burger.classList.remove('active');
	nav.classList.remove('active');
	overlay.classList.remove('active');
	body.classList.remove('menu-open');
}


document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeMenu();
	}
});


window.addEventListener('resize', function () {
	if (window.innerWidth > 768) {
		closeMenu();
	}
});



//order__form-settings
document.querySelector('form').reset();

const input = document.querySelector('input[name="phone"]');
const nameInput = document.querySelector('input[name="name"]');


input.addEventListener('focus', () => {
	if (!input.value) {
		input.value = '+380';
	}
});

input.addEventListener('blur', () => {
	if (input.value === '+380') {
		input.value = '';
	}
});

input.addEventListener('input', () => {
	input.value = input.value.replace(/[^+\d]/g, '');
});

nameInput.addEventListener('input', () => {
	nameInput.value = nameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]/g, '');
});