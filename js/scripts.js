window.initSwipers = function () {
	if (window.swiperGalleryInit) return;
	window.swiperGalleryInit = true;

	if (!window.Swiper) return;

	var gallery = document.querySelector('.swiperGallery');
	if (gallery) {
		new Swiper('.swiperGallery', {
			loop: true,
			slidesPerView: 1,
			observer: false,
			observeParents: false,
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
		});
	}

	var certs = document.querySelector('.swiperCertificates');
	if (certs) {
		new Swiper('.swiperCertificates', {
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
			observer: false,
			observeParents: false,
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
		});
	}
};

//smth-logo
//url-#cleaner
//raf-anim
(() => {
	let scrollRafId = null;
	let restoreScrollBehavior = null;
	let scrollCompletion = null;

	function cleanUrl() {
		history.replaceState(null, '', window.location.pathname + window.location.search);
	}

	function restoreNativeScrollBehavior() {
		if (restoreScrollBehavior) {
			restoreScrollBehavior();
			restoreScrollBehavior = null;
		}
	}

	function cancelScroll() {
		if (scrollRafId !== null) {
			cancelAnimationFrame(scrollRafId);
			scrollRafId = null;
			restoreNativeScrollBehavior();
			const onComplete = scrollCompletion;
			scrollCompletion = null;
			onComplete?.();
		}
	}

	function smoothScrollTo(targetY, duration = 600, target = null, marginTop = 0, onComplete = null) {
		cancelScroll();

		const el = document.scrollingElement || document.documentElement;
		const root = document.documentElement;
		const previousValue = root.style.getPropertyValue('scroll-behavior');
		const previousPriority = root.style.getPropertyPriority('scroll-behavior');
		root.style.setProperty('scroll-behavior', 'auto', 'important');
		restoreScrollBehavior = () => {
			if (previousValue) {
				root.style.setProperty('scroll-behavior', previousValue, previousPriority);
			} else {
				root.style.removeProperty('scroll-behavior');
			}
		};

		const getDestinationY = () => {
			const maxY = Math.max(0, el.scrollHeight - window.innerHeight);
			const currentTargetY = target
				? target.getBoundingClientRect().top + el.scrollTop - marginTop
				: targetY;
			return Math.min(Math.max(currentTargetY, 0), maxY);
		};
		const startY = el.scrollTop;
		const diff = getDestinationY() - startY;

		if (Math.abs(diff) < 1) {
			el.scrollTop = getDestinationY();
			restoreNativeScrollBehavior();
			onComplete?.();
			return;
		}

		scrollCompletion = onComplete;
		let startTime = null;
		const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

		function step(timestamp) {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const destinationY = getDestinationY();
			el.scrollTop = startY + (destinationY - startY) * ease(progress);

			if (progress < 1) {
				scrollRafId = requestAnimationFrame(step);
			} else {
				el.scrollTop = getDestinationY();
				scrollRafId = null;
				restoreNativeScrollBehavior();
				const completion = scrollCompletion;
				scrollCompletion = null;
				completion?.();
			}
		}

		scrollRafId = requestAnimationFrame(step);
	}

	window.addEventListener('wheel', cancelScroll, { passive: true });
	window.addEventListener('touchstart', cancelScroll, { passive: true });

	function scrollToElement(target, onComplete) {
		requestAnimationFrame(() => {
			const marginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
			const el = document.scrollingElement || document.documentElement;
			const y = target.getBoundingClientRect().top + el.scrollTop - marginTop;
			smoothScrollTo(y, 600, target, marginTop, onComplete);
		});
	}

	function scrollToTop(onComplete) {
		smoothScrollTo(0, 600, null, 0, onComplete);
	}

	window.addEventListener('DOMContentLoaded', function () {
		const hash = window.location.hash;
		if (!hash) return;

		const target = document.getElementById(hash.slice(1));
		if (!target) {
			cleanUrl();
			return;
		}

		const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
		fontsReady.then(() => {
			scrollToElement(target, cleanUrl);
		});
	});

	const logo = document.querySelector('.header__logo');

	logo?.addEventListener('click', function (e) {
		const isHomePage =
			window.location.pathname.endsWith('/index.html') ||
			window.location.pathname.endsWith('/');

		if (isHomePage) {
			e.preventDefault();
			scrollToTop(cleanUrl);
		}
	});

	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', function (e) {
			const href = this.getAttribute('href');
			const target = document.getElementById(href.slice(1));
			if (!target) return;

			e.preventDefault();
			scrollToElement(target, cleanUrl);
		});
	});
})();

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


let resizeTimer;
window.addEventListener('resize', function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(function () {
		if (window.innerWidth > 1032) {
			closeMenu();
		}
	}, 150);
});



//order__form-settings
const form = document.querySelector('form');
const input = document.querySelector('input[name="phone"]');
const nameInput = document.querySelector('input[name="name"]');

if (form) form.reset();

if (input) {
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
}

if (nameInput) {
	nameInput.addEventListener('input', () => {
		nameInput.value = nameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]/g, '');
	});
}


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
				console.error('Server error:', res.status);
				showFormToast(UI[uiLang].error, false);
			}
		} catch (err) {
			console.error('Form submit error:', err);
			showFormToast(UI[uiLang].error, false);
		} finally {
			if (submitBtn) submitBtn.disabled = false;
		}
	});
}

window.initMap = function () {
	if (window.mapInit) return;
	window.mapInit = true;

	var mapContainer = document.querySelector('.contacts__map');
	if (!mapContainer) return;

	var iframe = document.createElement('iframe');
	iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2647.8210776352394!2d22.718579877085062!3d48.42157923134618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4739adcca2d1bf13%3A0x10af86c105bc26a2!2z0KLQntCSICLQkS7Qmi7Ql9Cw0LrQsNGA0L_QsNGC0YLRjyI!5e0!3m2!1sru!2scz!4v1783876687220!5m2!1sru!2scz';
	iframe.title = 'Карта розташування БК Закарпаття';
	iframe.width = '504';
	iframe.height = '504';
	iframe.allowFullscreen = '';
	iframe.referrerPolicy = 'no-referrer-when-downgrade';
	iframe.style.border = '0';

	mapContainer.appendChild(iframe);
};

if ('IntersectionObserver' in window) {
	var mapObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				mapObserver.unobserve(entry.target);
				window.initMap();
			}
		});
	}, { rootMargin: '300px' });

	var mapContainers = document.querySelectorAll('.contacts__map');
	if (mapContainers.length > 0) {
		mapContainers.forEach(function (el) {
			mapObserver.observe(el);
		});
	} else {
		window.initMap();
	}
} else {
	window.initMap();
}