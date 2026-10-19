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
		a11y: {
			enabled: true,
			prevSlideMessage: 'Попередній слайд',
			nextSlideMessage: 'Наступний слайд',
			firstSlideMessage: 'Це перший слайд',
			lastSlideMessage: 'Це останній слайд',
		},
	})
	: null;

// swiperCertificates
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
		a11y: {
			enabled: true,
			paginationBulletMessage: 'Перейти до слайда {{index}}',
			firstSlideMessage: 'Це перший слайд',
			lastSlideMessage: 'Це останній слайд',
		},
	})
	: null;


//smth-logo
//url-#cleaner
function cleanUrl() {
	history.replaceState(null, '', window.location.pathname + window.location.search);
}

const isSafari = navigator.vendor && navigator.vendor.includes('Apple');

let scrollRafId = null;

function cancelScroll() {
	if (scrollRafId !== null) {
		cancelAnimationFrame(scrollRafId);
		scrollRafId = null;
	}
}

function smoothScrollTo(targetY, duration = 600) {
	cancelScroll();

	const el = document.scrollingElement || document.documentElement;
	const startY = el.scrollTop;
	const diff = targetY - startY;

	if (Math.abs(diff) < 1) {
		el.scrollTop = targetY;
		return;
	}

	let startTime = null;

	const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

	function step(timestamp) {
		if (!startTime) startTime = timestamp;
		const progress = Math.min((timestamp - startTime) / duration, 1);
		el.scrollTop = startY + diff * ease(progress);

		if (progress < 1) {
			scrollRafId = requestAnimationFrame(step);
		} else {
			el.scrollTop = targetY;
			scrollRafId = null;
		}
	}

	scrollRafId = requestAnimationFrame(step);
}

window.addEventListener('wheel', cancelScroll, { passive: true });
window.addEventListener('touchstart', cancelScroll, { passive: true });

function scrollToElement(target) {
	const isSafariOnly = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Chromium');
	if (isSafariOnly) {
		target.scrollIntoView({ behavior: 'smooth' });
		return;
	}

	const marginTop =
		parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
	const y = target.getBoundingClientRect().top + window.scrollY - marginTop;
	smoothScrollTo(y);
}

function scrollToTop() {
	const isSafariOnly = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Chromium');
	if (isSafariOnly) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		return;
	}
	smoothScrollTo(0);
}

window.addEventListener('DOMContentLoaded', function () {
	const hash = window.location.hash;
	if (!hash) return;

	const target = document.querySelector(hash);

	if (target) {
		setTimeout(() => {
			scrollToElement(target);
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
		scrollToTop();
		cleanUrl();
	}
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener('click', function (e) {
		const href = this.getAttribute('href');
		const target = document.querySelector(href);
		if (!target) return;

		e.preventDefault();
		scrollToElement(target);
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
	if (window.innerWidth > 1032) {
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

input.addEventListener('beforeinput', (e) => {
	if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
		const val = input.value;
		if (val === '+380' || val.length <= 4) {
			e.preventDefault();
		}
	}
});

input.addEventListener('input', () => {
	let val = input.value.replace(/[^+\d]/g, '');
	if (!val.startsWith('+380')) {
		val = '+380' + val.replace('+380', '');
	}
	if (val === '+') val = '+380';
	input.value = val;
});

nameInput.addEventListener('input', () => {
	nameInput.value = nameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]/g, '');
});


//objects shown
document.querySelectorAll("img").forEach((img) => {
	if (img.complete) {
		img.classList.add("is-loaded");
	} else {
		img.addEventListener("load", () => img.classList.add("is-loaded"));
	}
});

document.fonts.ready.then(() => {
	document.body.classList.add("fonts-loaded");
});

// form-toast
const uiLang = 'uk';

const UI = {
	uk: { notFound: 'Нічого не знайдено', chooseService: 'Вибрати...', success: 'Заявку надіслано!', error: 'Помилка сервера' },
};

function showFormToast(message, isSuccess = true) {
	const toast = document.getElementById('form-toast');
	const text = document.getElementById('form-toast-text');
	if (!toast || !text) return;
	text.textContent = message;
	toast.classList.remove('is-success', 'is-error', 'is-visible');
	toast.classList.add(isSuccess ? 'is-success' : 'is-error', 'is-visible');
	setTimeout(() => hideFormToast(), 5000);
}

function hideFormToast() {
	const toast = document.getElementById('form-toast');
	if (!toast) return;
	toast.classList.remove('is-visible');
}

const form = document.querySelector('form');
if (form) {
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const submitBtn = form.querySelector('.form__card-submit');
		if (submitBtn) submitBtn.disabled = true;

		try {
			const formData = new FormData(form);
			const res = await fetch(form.action || 'https://api.web3forms.com/submit', {
				method: 'POST',
				body: formData,
			});

			if (res.ok) {
				showFormToast(UI[uiLang].success, true);
				form.reset();
			} else {
				showFormToast(UI[uiLang].error + ': ' + res.status, false);
			}
		} catch (err) {
			showFormToast(UI[uiLang].error + ': ' + err, false);
		} finally {
			if (submitBtn) submitBtn.disabled = false;
		}
	});
}