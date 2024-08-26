import loadingSpinner from '../../assets/icons/video-loader.svg';

import {disablePageScroll, enablePageScroll} from 'scroll-lock';

const tnailVideoTrigger = document.querySelectorAll('.tnails-video-review-but');
const sliderVideoTrigger = document.querySelectorAll('.cases-slide-item');
const modalOverflow = document.querySelector('.video-modal-overflow');
const modalWrapper = document.querySelector('.video-modal-wrapper');
const modalCloseIcon = modalOverflow.querySelector('.modal-close-icon');

let activePlayer;

tnailVideoTrigger.forEach((item) => {
	item.addEventListener('click', () => toggleModal(item, true));
});
sliderVideoTrigger.forEach((item) => {
	item.addEventListener('click', () => toggleModal(item, true));
});

modalCloseIcon.addEventListener('click', (e) => toggleModal(e, false));
modalOverflow.addEventListener('click', (e) => {
	if (e.target === modalOverflow) {
		toggleModal(e, false);
	}
});

function toggleModal(target, opened) {
	if (opened) {
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
				modalWrapper.addEventListener('click', (e) => toggleModal(e, false));
			});
	} else {
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
}

// function selectVideoSetup(videojsModule, target, ) {}

function setupVideo(videojsModule, target) {
	console.log('target: ', target);
	const targetType = target.dataset.videoType;
	const videoSrc = target.dataset.videoSrc;
	if (targetType === 'tnails') {
		modalOverflow.classList.add('tnails-video-mod');
		videoInsert(videoSrc, 'vjs-tnails-video-wrapper');
		return setupTnailVideo(videojsModule);
	} else if (targetType === 'slider') {
		modalOverflow.classList.remove('tnails-video-mod');
		videoInsert(videoSrc, 'vjs-slider-video-wrapper');
		return setupSliderVideo(videojsModule);
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

function videoInsert(videoPath, vjsClass) {
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

function setupSliderVideo(videojsModule) {
	const activePlayer = videojsModule('video-js-modal', {
		width: modalWrapper.clientWidth,
		height: modalWrapper.clientHeight,
		controls: true,
		autoplay: true,
		preload: 'auto',
		controlBar: {
			pictureInPictureToggle: false,
		},
		fluid: true,
		disablePictureInPicture: true,
		notSupportedMessage: 'There was an error uploading the video, please try again later',
	});

	return activePlayer;
}
