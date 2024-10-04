import smoothScroll from '../modules/smooth-scroll';
import activeLinksController from '../modules/active-links-controller';
import menuDotCtrl from '../modules/menu-dot-anim';
import burger from '../modules/burger-menu';
import observerNav from '../modules/observer-nav';

import debounce from '../modules/debounce';

// Burger
const burgerBut = document.querySelector('.burger-icon');
const mobileMenuWrapper = document.querySelector('.mobile-menu-overlay');
burger(mobileMenuWrapper, burgerBut);

const header = document.querySelector('.desc-wrapper');

const navSelectorList = [
	document.querySelector('.menu-list'),
	document.querySelector('.mobile-menu-list'),
];

const smoothLinks = document.querySelectorAll('a[href^="#"]');
const linkList = ['home', 'cases', 'testimonials', 'prices', 'contacts'];
let currPage = 0;

const backgroundWrapper = document.querySelector(`.video-wrapper`);

const tnailsNavShadows = document.querySelectorAll('.tnails-nav-but');

// PageNavEvent
function pageSwitchEvent(pageId) {
	const event = new CustomEvent('pageSwitch', {
		detail: {pageId: pageId},
	});

	window.dispatchEvent(event);
}

function pageSwitchInit(allAnchorLinks) {
	if (allAnchorLinks && allAnchorLinks.length > 0) {
		allAnchorLinks.forEach((item) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();

				const id = item.getAttribute('href').slice(1);

				if (id) {
					pageSwitchEvent(id);
				}
			});
		});
	}
}

pageSwitchInit(smoothLinks);

function pageSwitchCallback(id) {
	activeLinksControl(id);
	descDotCallback(id);
	mobileDotCallback(id);
	pagesNavSwitch(id);
	setLinkIndex(id);
	smoothScroll(id);
}

const pagesNavSwitch = (id) => {
	tnailsNavShadows.forEach((item) => item.classList.remove('tnails-nav-visible'));

	switch (id) {
		case 'home':
			backgroundWrapper.classList.remove('cases-active', 'contacts-active', 'bg-video-hidden');
			break;
		case 'cases':
			backgroundWrapper.classList.add('cases-active', 'bg-video-hidden');
			backgroundWrapper.classList.remove('contacts-active');
			break;
		case 'testimonials':
			tnailsNavShadows.forEach((item) => item.classList.add('tnails-nav-visible'));
			backgroundWrapper.classList.add('bg-video-hidden');
			backgroundWrapper.classList.remove('cases-active', 'contacts-active');
			break;
		case 'contacts':
			backgroundWrapper.classList.add('contacts-active');
			backgroundWrapper.classList.remove('cases-active', 'bg-video-hidden');
			break;
		default:
			backgroundWrapper.classList.add('bg-video-hidden');
			backgroundWrapper.classList.remove('cases-active', 'contacts-active');
			break;
	}
};

// Observer Mobile
const mobileCallback = (id) => {
	if (window.innerWidth < 768) {
		activeLinksControl(id);
		mobileDotCallback(id);
		setLinkIndex(id);
		mobileVideoOpacityController(id);
	}
};

observerNav(linkList, mobileCallback);

// mobile video opacity controller
function mobileVideoOpacityController(id) {
	if (id === 'home') {
		backgroundWrapper.classList.remove('bg-video-hidden');
	} else {
		backgroundWrapper.classList.add('bg-video-hidden');
	}
}

// DotController
const dot = document.querySelector('#desc-menu-dot');
const navWrapper = document.querySelector('.desc-menu-wrapper');
const descDotCallback = menuDotCtrl(dot, navWrapper);

const mobileDot = document.querySelector('#mobile-menu-dot');
const mobileNavWrapper = document.querySelector('.mobile-menu-list');
const mobileDotCallback = menuDotCtrl(mobileDot, mobileNavWrapper, true);

// Class controller
const activeLinksControl = activeLinksController(navSelectorList, 'active');

function setLinkIndex(id) {
	currPage = linkList.indexOf(id);
}

function pageDown() {
	if (currPage >= linkList.length - 1) {
		return;
	}
	currPage++;
}

function pageUp() {
	if (currPage <= 0) {
		return;
	}
	currPage--;
}

const swipeForbidEl = {
	forbid: [...document.querySelectorAll('.mobile-menu-overlay')],
	scroll: [...document.querySelectorAll('.tnail-review')],
};

// Mouse wheel controller
function wheelHandler(e, forbidEls) {
	if (forbidEls.scroll.includes(e.target) && e.target.scrollHeight > e.target.clientHeight) {
		return;
	}

	if (e.wheelDelta < 0) {
		pageDown();
	} else {
		pageUp();
	}

	pageSwitchEvent(linkList[currPage]);
}

// debounce functions
const debouncePageCorrection = debounce(() => {
	if (window.innerWidth > 768) {
		pageSwitchEvent(linkList[currPage]);
	}
}, 100);

const debounceScrollController = debounce(() => {
	const scrollY = window.scrollY;

	if (scrollY > 400) {
		header.classList.add('scrolled');
	} else {
		header.classList.remove('scrolled');
	}
}, 20);

const debounceWheel = debounce((e) => {
	wheelHandler(e, swipeForbidEl);
}, 150);

// event listeners
window.addEventListener(
	'load',
	() => {
		setTimeout(() => {
			pageSwitchEvent(linkList[currPage]);
		}, 1);
	},
	{once: true}
);

window.addEventListener('pageSwitch', (e) => {
	const id = e.detail.pageId;

	if (id) {
		pageSwitchCallback(id);
	}
});

if ('onwheel' in document) {
	window.addEventListener('wheel', debounceWheel);
} else if ('onmousewheel' in document) {
	window.addEventListener('mousewheel', debounceWheel);
}

window.addEventListener('resize', debouncePageCorrection);

window.addEventListener('scroll', debounceScrollController);
