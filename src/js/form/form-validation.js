import debounce from '../modules/debounce';

const fetchURL = 'https://formspree.io/f/mqkvkajy';

const form = document.querySelector('#contact-form');
const inputs = document.querySelectorAll('#contact-form .contact-input');
const sendMessageWrapper = document.querySelector('#contact-send-message');
const sendMessageText = document.querySelector('#contact-send-message .form-send-result-message');

inputs.forEach((item) => {
	item.addEventListener('change', () => checkEmptyValue(item));
	if (item.id === 'message-input') {
		return true;
	}
	item.addEventListener('input', () => debounceValidate(item));
});

function checkEmptyValue(input) {
	if (input.value) {
		input.classList.add('contact-input-filled');
	} else {
		input.classList.remove('contact-input-filled');
	}
}

function validate(item) {
	const res = validateInput(item);

	if (res) {
		item.classList.remove('contact-input-wrong');
		return res;
	}
	item.classList.add('contact-input-wrong');
	return res;
}

function validateInput(input) {
	const value = input.value;

	if (value.length <= 2) {
		return false;
	}
	if (input.id === 'email-input' && !validateEmail(value)) {
		return false;
	}
	return true;
}

const validateEmail = (value) =>
	value.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
const debounceValidate = debounce(validate, 500);

function validateAll() {
	const validateArr = [];

	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].id === 'message-input') {
			continue;
		}
		const checkResult = validate(inputs[i]);
		validateArr.push(checkResult);
	}

	if (validateArr.includes(false)) {
		return false;
	}
	return true;
}

function formReset() {
	form.reset();

	inputs.forEach((item) => {
		item.classList.remove('contact-input-wrong');
		item.classList.remove('contact-input-filled');
	});
}

function showMessage(text) {
	sendMessageText.innerHTML = text;
	form.classList.add('form-inactive');
	sendMessageWrapper.classList.add('show-message');
	setTimeout(() => {
		form.classList.remove('form-inactive');
		sendMessageWrapper.classList.remove('show-message');
	}, 3000);
}

function sendAnswerMessage(result, errorCode) {
	if (result) {
		formReset();
		showMessage('Sent successfully');
	} else {
		if (errorCode) {
			showMessage(`Error. ${errorCode}`);
		} else {
			showMessage(`Oops. There was an error`);
		}
	}
}

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const formValid = validateAll();

	if (formValid) {
		const data = new FormData(form);

		const request = fetch(fetchURL, {
			method: 'POST',
			body: data,
			headers: {
				Accept: 'application/json',
			},
		});

		request
			.then((response) => {
				sendAnswerMessage(response.ok);
			})
			.catch((error) => {
				sendAnswerMessage(false, error.code);
			});

		// try {
		// 	const requestTestPhp = fetch('./php/mailer/send-example.php', {
		// 		method: 'POST',
		// 		body: data,
		// 		headers: {
		// 			Accept: 'application/json',
		// 		},
		// 	});

		// 	requestTestPhp
		// 		.then((response) => {
		// 			console.log(response.ok);
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 		});
		// } catch (error) {
		// 	console.log(error);
		// }
	}
});
