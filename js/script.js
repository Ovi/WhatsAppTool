window.addEventListener('offline', () => {
	Toastify({
		text: 'Ops! We are offline',
		...toastifyConfig
	}).showToast();
});
window.addEventListener('online', () => {
	Toastify({
		text: 'Back Online',
		...toastifyConfig
	}).showToast();
});

const toastifyConfig = {
	close: true,
	duration: 1500,
	backgroundColor: 'rgb(255, 60, 0)',
	position: 'center',
	gravity: 'bottom',
	stopOnFocus: true
};

const form = document.querySelector('#form');
form.addEventListener('submit', e => {
	e.preventDefault();

	const number = form.full_number.value;
	const message = form.message.value;

	if (!number) {
		Toastify({
			text: 'Number can not be empty',
			...toastifyConfig
		}).showToast();

		return;
	}

	if (number.match(/[a-z]/i)) {
		Toastify({
			text: 'Number can not contain alphabets',
			...toastifyConfig
		}).showToast();

		return;
	}

	const numberWithoutPlus = number.substr(1);

	const link = `https://wa.me/${numberWithoutPlus}?text=${
		message ? message : ''
	}&source=https://muhammadovi.com`;

	openInNewTab(link);
	form.reset();
});

function openInNewTab(href) {
	Object.assign(document.createElement('a'), {
		target: '_blank',
		href
	}).click();
}
