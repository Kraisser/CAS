import loadingSpinner from '../../assets/icons/video-loader.svg';

import {disablePageScroll, enablePageScroll} from 'scroll-lock';

const slideTriggers = document.querySelectorAll('.cases-slide-item');
const modalOverflow = document.querySelector('.slider-modal-overflow');
const modalWrapper = document.querySelector('.slider-modal-wrapper');
const modalCloseIcon = modalOverflow.querySelector('.modal-close-icon');

let activePlayer;

slideTriggers.forEach((item) => {
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
		modalOverflow.classList.add('slider-modal-opened');
		disablePageScroll(modalWrapper);
		loadVideojs()
			.then((videojs) => (activePlayer = setupVideo(videojs, target)))
			.then(() => {
				modalWrapper.querySelector('.slide-video-wrapper').classList.add('opened');
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

		modalOverflow.classList.remove('slider-modal-opened');
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

function setupVideo(videojsModule, target) {
	const specAspectRatio = target.dataset.aspectRatio;
	const fullSrc = target.dataset.videoSrc.split('.');
	const [videoName, videoExt] = [fullSrc[0], fullSrc[1]];

	if (specAspectRatio) {
		const videoPath = `${videoName}${specAspectRatio}.${videoExt}`;
		videoInsert(videoPath);
	} else {
		const aspectRatio = countAspectRatio();
		const videoPath = `${videoName}${aspectRatio}.${videoExt}`;
		videoInsert(videoPath);
	}

	const activePlayer = videojsModule('video-js-modal', {
		width: modalWrapper.clientWidth,
		height: modalWrapper.clientHeight,
		controls: true,
		autoplay: false,
		preload: 'auto',
		controlBar: {
			pictureInPictureToggle: false,
		},
		fill: true,
		disablePictureInPicture: true,
		notSupportedMessage: 'There was an error uploading the video, please try again later',
	});

	return activePlayer;
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

function countAspectRatio() {
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;
	const aspectRatio = Math.abs(screenWidth / screenHeight);

	if (aspectRatio < 0.68) {
		return '9x16';
	} else if (aspectRatio >= 0.68 && aspectRatio < 0.9) {
		return '4x5';
	} else if (aspectRatio >= 0.9 && aspectRatio < 1.39) {
		return '1x1';
	} else {
		return '16x9';
	}
}

function videoInsert(videoPath) {
	modalWrapper.innerHTML = `
	<div class="slide-video-wrapper">
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
