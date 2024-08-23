import smoothScroll from '../modules/smooth-scroll';
import activeLinksController from '../modules/active-links-controller';
import menuDotCtrl from '../modules/menu-dot-anim';

const navSelectorList = [
	document.querySelector('.menu-list'),
	// document.querySelector('.main-burger-menu'),
];

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
		backgroundVideo.style.opacity = 1;
		backgroundWrapper.classList.remove('cases-active');
		backgroundWrapper.classList.remove('contacts-active');
	} else if (id === 'cases') {
		backgroundVideo.style.opacity = 0;
		backgroundWrapper.classList.add('cases-active');
		backgroundWrapper.classList.remove('contacts-active');
	} else if (id === 'contacts') {
		backgroundVideo.style.opacity = 1;
		backgroundWrapper.classList.add('contacts-active');
		backgroundWrapper.classList.remove('cases-active');
	} else {
		backgroundVideo.style.opacity = 0;
		backgroundWrapper.classList.remove('cases-active');
		backgroundWrapper.classList.remove('contacts-active');
	}
};

const pagesNavSwitch = switchingFooter(messengerWrapper, sliderCtrlWrapper);

const startVal = 'home';

// DotController
const dot = document.querySelector('#desc-menu-dot');
const navWrapper = document.querySelector('.desc-menu-wrapper');
const dotCallback = menuDotCtrl(dot, navWrapper);

// Class controller
const activeLinksControl = activeLinksController(navSelectorList, 'active');

const navigationsCallbacks = [activeLinksControl, dotCallback, pagesNavSwitch, switchingBack];
navigationsCallbacks.forEach((func) => func(startVal)); //Nav init

// Smoothscroll
const smoothLinks = document.querySelectorAll('a[href^="#"]');
// smoothScroll(startVal, smoothLinks, navigationsCallbacks);

window.addEventListener('load', () => {
	smoothScroll(startVal, smoothLinks, navigationsCallbacks);
});
