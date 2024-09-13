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

const messengerWrapper = document.querySelector('.desc-messenger-wrapper');
const sliderCtrlWrapper = document.querySelector('.desc-slider-controls');
const backgroundWrapper = document.querySelector(`.content`);
const backgroundVideo = document.querySelector('.background-video');

const switchingFooter = (messengerWrapper, sliderCtrlWrapper) => {
	return (id) => {
		if (id === 'cases') {
			messengerWrapper.classList.add('hidden');
			sliderCtrlWrapper.classList.remove('hidden');
		} else {
			messengerWrapper.classList.remove('hidden');
			sliderCtrlWrapper.classList.add('hidden');
		}
	};
};

const switchingBack = (id) => {
	if (id === 'home') {
		backgroundVideo.classList.remove('hidden');
		backgroundWrapper.classList.remove('cases-active');
		backgroundWrapper.classList.remove('contacts-active');
	} else if (id === 'cases') {
		backgroundVideo.classList.add('hidden');
		backgroundWrapper.classList.add('cases-active');
		backgroundWrapper.classList.remove('contacts-active');
	} else if (id === 'contacts') {
		backgroundVideo.classList.remove('hidden');
		backgroundWrapper.classList.add('contacts-active');
		backgroundWrapper.classList.remove('cases-active');
	} else {
		backgroundVideo.classList.add('hidden');
		backgroundWrapper.classList.remove('cases-active');
		backgroundWrapper.classList.remove('contacts-active');
	}
};

const pagesNavSwitch = switchingFooter(messengerWrapper, sliderCtrlWrapper);

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

//Nav init
const navigationsCallbacks = [
	activeLinksControl,
	descDotCallback,
	mobileDotCallback,
	pagesNavSwitch,
	switchingBack,
	setLinkIndex,
];

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
	smoothScroll(linkList[currPage], smoothLinks, navigationsCallbacks);
}

function pageUp() {
	if (currPage <= 0) {
		return;
	}

	currPage--;
	smoothScroll(linkList[currPage], smoothLinks, navigationsCallbacks);
}

const swipeCallbacks = {
	toTop: pageDown,
	toBot: pageUp,
};

const swipeForbidEl = [...document.querySelectorAll('.tnail-review')];

swipeController(swipeSettings, swipeForbidEl, swipeCallbacks);

// Mouse wheel controller
function wheelHandler(e, forbidEls) {
	const wheelDelta = e.wheelDelta;

	if (forbidEls.includes(e.target) && e.target.clientHeight !== e.target.scrollHeight) {
		return;
	}

	if (wheelDelta < 0) {
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
			smoothScroll(linkList[currPage], smoothLinks, navigationsCallbacks);
		}, 1);
	},
	{once: true}
);

const debounceScroll = debounce(() => {
	smoothScroll(linkList[currPage], smoothLinks, navigationsCallbacks);
}, 250);

window.addEventListener('resize', () => {
	debounceScroll();
});

const debounceWheel = debounce((e) => {
	wheelHandler(e, swipeForbidEl);
}, 150);

window.addEventListener('mousewheel', debounceWheel);
