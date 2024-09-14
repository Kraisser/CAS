import loadingSpinner from '../../assets/icons/video-loader.svg';

import {disablePageScroll, enablePageScroll} from 'scroll-lock';

const modalOverflow = document.querySelector('.video-modal-overflow');
const modalWrapper = document.querySelector('.video-modal-wrapper');
const modalCloseIcon = modalOverflow.querySelector('.modal-close-icon');

const tnailVideoTrigger = document.querySelectorAll('.tnails-slide-item-content');

const tnailPlayElement = `
<div class="tnails-video-review-but">
	<svg
		width="22"
		height="28"
		viewBox="0 0 22 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M21.5618 13.1544C22.1461 13.5302 22.1461 14.4698 21.5618 14.8456L1.31474 27.8677C0.730412 28.2435 1.90735e-06 27.7738 1.90735e-06 27.0221L0 0.977861C0 0.226223 0.730412 -0.243549 1.31474 0.132269L21.5618 13.1544Z"
			fill="white"
		/>
	</svg>
	<span>Watch video</span>
</div>`;

let activePlayer;

tnailVideoTrigger.forEach((item) => {
	if (item.dataset.videoSrc) {
		const itemFooter = item.querySelector('.tnails-slide-footer');

		if (itemFooter) {
			itemFooter.insertAdjacentHTML('beforeend', tnailPlayElement);
		}

		item.addEventListener('click', () => openModal(item));
	}
});

modalCloseIcon.addEventListener('click', (e) => closeModal(e));
modalOverflow.addEventListener('click', (e) => {
	if (e.target === modalOverflow) {
		closeModal(e);
	}
});

function openModal(target) {
	modalOverflow.classList.add('video-modal-opened');
	disablePageScroll(modalWrapper);
	loadVideojs()
		.then((videojs) => (activePlayer = setupVideo(videojs, target)))
		.then(() => {
			modalWrapper.querySelector('.vjs-video-wrapper').classList.add('opened');
			modalWrapper.addEventListener(
				'transitionend',
				() => {
					activePlayer.play();
				},
				{once: true}
			);
		})
		.catch((errorMessage) => {
			modalWrapper.innerHTML = `<div class="custom-error-modal">${errorMessage}</div>`;
			modalWrapper.addEventListener('click', (e) => closeModal(e));
		});
}

function closeModal(e) {
	if (activePlayer) {
		activePlayer.dispose();
	}

	modalOverflow.classList.remove('video-modal-opened');
	enablePageScroll(modalWrapper);

	modalOverflow.addEventListener(
		'transitionend',
		() => {
			modalWrapper.innerHTML = loadingSpinner;
		},
		{once: true}
	);
}

function setupVideo(videojsModule, target) {
	const targetType = target.dataset.videoType;
	const videoSrc = target.dataset.videoSrc;

	if (targetType === 'tnails') {
		modalOverflow.classList.add('tnails-video-mod');
		const tnailData = getTnailData(target);
		const tnailEl = createTnailEl(tnailData);
		videoInsert(videoSrc, 'vjs-tnails-video-wrapper', tnailEl);
		return setupTnailVideo(videojsModule);
	} else if (targetType === 'slider') {
		return;
	}
}

function loadVideojs() {
	return import('video.js')
		.then(({default: videojs}) => {
			return videojs;
		})
		.catch((error) => {
			const errorMessage = 'Unable to load videoPlayer. ' + error.message;
			console.log(error);

			throw new Error(errorMessage);
		});
}

function videoInsert(videoPath, vjsClass, additEl) {
	modalWrapper.innerHTML = `
		<div class="vjs-video-wrapper ${vjsClass}">
			<video class="vjs-modal-custom video-js" id="video-js-modal">
				<source
					src="${videoPath}"
					type="video/mp4"
				/>
				<p>Your browser does not support HTML5 video</p>
			</video>
		</div>
	${additEl ? additEl : ''}
	`;
}

function setupTnailVideo(videojsModule) {
	const activePlayer = videojsModule('video-js-modal', {
		width: modalWrapper.clientWidth,
		height: modalWrapper.clientHeight,
		controls: true,
		autoplay: true,
		preload: 'auto',
		controlBar: {
			remainingTimeDisplay: false,
			pictureInPictureToggle: false,
		},
		fluid: true,
		disablePictureInPicture: true,
		notSupportedMessage: 'There was an error uploading the video, please try again later',
	});

	return activePlayer;
}

function getTnailData(wrapper) {
	const img = wrapper.querySelector('.tnails-slide-footer img');

	return {
		faceSrc: wrapper.querySelector('.tnails-slide-header img').src,
		name: wrapper.querySelector('.tnails-slide-header h5').innerHTML,
		pos: wrapper.querySelector('.tnails-slide-header span').innerHTML,
		img,
	};
}

function createTnailEl(data) {
	const companyImg = data.img
		? `<img class="tnails-video-company-img" src="${data.img.src}" alt="${data.img.alt}">`
		: null;

	return `
	<div class="tnails-video-wrapper">
		<div class="tnails-video-header">
			<img src="${data.faceSrc}" alt="${data.imgAlt}">
			<div class="tnails-video-name-pos">
				<h5>${data.name}</h5>
				<span>${data.pos}</span>
			</div>
		</div>
		${companyImg}	
	</div>
	`;
}
