import smoothScroll from '../modules/smooth-scroll';
import activeLinksController from '../modules/active-links-controller';
import menuDotCtrl from '../modules/menu-dot-anim';
import observerNav from '../modules/observer-nav';
import burger from '../modules/burger-menu';
import swipeController from '../modules/swipe-controller';

import debounce from '../modules/debounce';

// Burger
const burgerBut = document.querySelector('.burger-icon');
const mobileMenuWrapper = document.querySelector('.mobile-menu-overlay');
burger(mobileMenuWrapper, burgerBut);

const navSelectorList = [
	document.querySelector('.menu-list'),
	document.querySelector('.mobile-menu-list'),
];

const smoothLinks = document.querySelectorAll('a[href^="#"]');
const linkList = ['home', 'cases', 'testimonials', 'prices', 'contacts'];
let currPage = 0;

const backgroundWrapper = document.querySelector(`.video-wrapper`);
const backgroundVideo = document.querySelector('.background-video');

const tnailsNavShadows = document.querySelectorAll('.tnails-nav-but');

// PageNavEvent
function pageSwitchEvent(pageId) {
	const event = new CustomEvent('pageSwitch', {
		detail: {pageId: pageId},
	});

	window.dispatchEvent(event);
}

const pagesNavSwitch = (id) => {
	tnailsNavShadows.forEach((item) => item.classList.remove('tnails-nav-visible'));

	switch (id) {
		case 'home':
			// backgroundVideo.classList.remove('hidden');
			backgroundWrapper.classList.remove('cases-active', 'contacts-active', 'bg-video-hidden');
			break;
		case 'cases':
			// backgroundVideo.classList.add('hidden');
			backgroundWrapper.classList.add('cases-active', 'bg-video-hidden');
			backgroundWrapper.classList.remove('contacts-active');
			break;
		case 'testimonials':
			tnailsNavShadows.forEach((item) => item.classList.add('tnails-nav-visible'));
			// backgroundVideo.classList.add('hidden');
			backgroundWrapper.classList.add('bg-video-hidden');
			backgroundWrapper.classList.remove('cases-active', 'contacts-active');
			break;
		case 'contacts':
			// backgroundVideo.classList.remove('hidden');
			backgroundWrapper.classList.add('contacts-active');
			backgroundWrapper.classList.remove('cases-active', 'bg-video-hidden');
			break;
		default:
			backgroundWrapper.classList.add('bg-video-hidden');
			backgroundWrapper.classList.remove('cases-active', 'contacts-active');
			break;
	}
};

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

//Nav callbacks
const navigationsCallbacks = [
	activeLinksControl,
	descDotCallback,
	mobileDotCallback,
	pagesNavSwitch,
	setLinkIndex,
	pageSwitchEvent,
];

//PageSmoothInit
const smoothNavigate = smoothScroll(smoothLinks, navigationsCallbacks);

// Swipe Controller
const swipeSettings = {
	minTime: 150,
	maxTime: 1000,
	minMove: 30,
	maxMove: 800,
};

function pageDown() {
	if (currPage >= linkList.length - 1) {
		return;
	}

	currPage++;
	smoothNavigate(linkList[currPage], navigationsCallbacks);
}

function pageUp() {
	if (currPage <= 0) {
		return;
	}

	currPage--;
	smoothNavigate(linkList[currPage], navigationsCallbacks);
}

const swipeCallbacks = {
	toTop: pageDown,
	toBot: pageUp,
};

const swipeForbidEl = {
	forbid: [...document.querySelectorAll('.mobile-menu-overlay')],
	scroll: [...document.querySelectorAll('.tnail-review')],
};

swipeController(swipeSettings, swipeForbidEl, swipeCallbacks);

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
}

// event listeners
window.addEventListener(
	'load',
	() => {
		setTimeout(() => {
			smoothNavigate(linkList[currPage], navigationsCallbacks);
		}, 1);
	},
	{once: true}
);

const debounceScroll = debounce(() => {
	smoothNavigate(linkList[currPage], navigationsCallbacks);
}, 250);

window.addEventListener('resize', () => {
	debounceScroll();
});

const debounceWheel = debounce((e) => {
	wheelHandler(e, swipeForbidEl);
}, 150);

if ('onwheel' in document) {
	window.addEventListener('wheel', debounceWheel);
} else if ('onmousewheel' in document) {
	window.addEventListener('mousewheel', debounceWheel);
}
