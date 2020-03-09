window.addEventListener('DOMContentLoaded', () => {

	const confForm = document.querySelector('form');

	const nameInput = document.querySelector('#name');
	const emailInput = document.querySelector('#mail');
	const titleOtherInput = document.querySelector('#user-title-other');
	const titleSelect = document.querySelector('#title');

	const colorSelectContainer = document.querySelector('#colors-js-puns');
	const colorSelect = document.querySelector('#color');
	const colorSelectOptions = colorSelect.querySelectorAll('#color option');
	const designSelect = document.querySelector('#design');

	const activitiesContainer = document.querySelector('.activities');
	const activities = document.querySelectorAll('.activities input[type="checkbox"]');

	const paymentSelect = document.querySelector('#payment');
	const creditCardOption = document.querySelector('#credit-card');
	const paypalOption = document.querySelector('#paypal');
	const bitCoinOption = document.querySelector('#bitcoin');

	const creditCardInput = document.querySelector('#cc-num');
	const zipInput = document.querySelector('#zip');
	const cvvInput = document.querySelector('#cvv');

	let runningTotalAmount = 0.00;

	const showColorSelect = () => { colorSelectContainer.style.display = 'block' };
	const hideColorSelect = () => { colorSelectContainer.style.display = 'none' };

	const showTitleOtherField = () => { titleOtherInput.style.display = 'block' };
	const hideTitleOtherField = () => { titleOtherInput.style.display = 'none' };

	const showCreditCardOption = () => { creditCardOption.style.display = 'block' };
	const hideCreditCardOption = () => { creditCardOption.style.display = 'none' };

	const showPayPalOption = () => { paypalOption.style.display = 'block' };
	const hidePayPalOption = () => { paypalOption.style.display = 'none' };

	const showBitCoinOption = () => { bitCoinOption.style.display = 'block' };
	const hideBitCoinOption = () => { bitCoinOption.style.display = 'none' };

	/**
	 * Validator functions
	 */ 
	const isValidName = (name) => {
		return /^[\w ]+$/.test(name)
	}

	const isValidEmail = (email) => {
		return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
	}

	const isValidCardNumber = (number) => {
		return /^[\d]{13,16}$/g.test(number);
	}

	const isValidCardNumber2 = (number) => {
		return !/^$/g.test(number);
	}

	const isValidZIP = (zip) => {
		return /^[\d]{5}$/.test(zip);
	}

	const isValidCVV = (cvv) => {
		return /^[\d]{3}$/.test(cvv);
	}

	const hasSelectedActivity = () => {
		const selectedActivities = document.querySelectorAll('.activities input[type="checkbox"]:checked');
		return selectedActivities.length > 0;
	}

	/**
	 * Add or hide error message for given input element
	 * @param {HTMLInput} input element
	 * @param {boolean} specify whether to show or hide error
	 * @param {string} error message to display
	 */
	const showOrHideError = (inputEl, showError, errorMessage) => {
		let error = inputEl.nextElementSibling;
		inputEl.classList.remove('error');
		if(error && error.classList.contains('error')){
			inputEl.parentElement.removeChild(error);
		}

		if(showError){
			error = document.createElement('p');
			error.classList.add('error');
			error.innerHTML = errorMessage;
			inputEl.classList.add('error');
			inputEl.parentElement.insertBefore(error, inputEl.nextSibling);
		}
	}

	/**
	 * Remove option elements from select element and replace with default message
	 * @param {HTMLSelectElement} Select element to remove options from
	 * @param {string} Optional default message to show
	 */
	const emptySelectOptions = (select, defaultMessage) => {
		const options = select.querySelectorAll('option')
		if(options.length){
			options.forEach( (option) => {
				option.remove();
			});
		}
		
		if(defaultMessage){
			const defaultOption = document.createElement('option');
			defaultOption.innerText = defaultMessage;
			select.appendChild(defaultOption);
		}
	};

	/**
	 * Returns a filtered list of options
	 * @param {string} Search term
	 * @param {NodeList} List of option elements to filter
	 */
	const filteredSelectOptions = (search, options) => {
		const filteredOptions = [];
		colorSelectOptions.forEach( (el) => {
			if(el.innerText.includes(search)){
				let newOption = el.cloneNode(true);
				// ensure any selected state is removed
				newOption.selected = '';
				// remove the search term in brackets
				newOption.innerText = el.innerText.replace(`(${search})`, "");
				filteredOptions.push(newOption);
			}
		});
		return filteredOptions;
	};

	/**
	 * Populates a select element with provided options
	 * @param {HTMLSelectElement} Select element to populate
	 * @param {NodeList} List of option elements
	 */
	const populateSelect = (select, options) => {
		emptySelectOptions(select);

		options.forEach( (el) => {
			select.appendChild(el);
		});
	};

	/**
	 * Determines whether any other activities conflict with the supplied activity
	 * and enables or disables the matching checkboxes
	 * @param {HTMLInputElement} Checkbox activity to test for conflicting events
	 * @param {boolean} Specify whether to disable the checkbox
	 */
	const conflictingActivities = (chosenEventCheckbox, disable) => {

		// Main conference doesn't conflict with any activity
		if(chosenEventCheckbox.name == 'all'){
			return true;
		}

		const dateAndTimeStr = chosenEventCheckbox.dataset.dayAndTime;
		const dateAndTimeResults = dateAndTimeStr.match(/^([\w]+).([\w-]+)/);
		const day = dateAndTimeResults[1];
		const time = dateAndTimeResults[2];

		let conflict = false;
		let conflicts = [];

		// for all activities check if it conflicts with chosen activity
		activities.forEach( (activity) => {
			if(activity !== chosenEventCheckbox && activity.name !== 'all'){
				const dateAndTimeStr = activity.dataset.dayAndTime;
				const sameDay = dateAndTimeStr.includes(day);
				const sameTime = dateAndTimeStr.includes(time);
				
				if(sameDay && sameTime || activity.name == 'all'){
					activity.disabled = disable;
				}
			}
		});
	};

	/**
	 * Add a running total of costs below the activities list
	 */
	const addRunningTotal = () => {
		const runningTotal = document.createElement('p');
		const runningTotalAmountSpan = document.createElement('span');
		runningTotalAmountSpan.id = 'runningTotal';
		const runningTotalTitle = document.createTextNode('Total: $');
		runningTotalAmountSpan.innerText = "0";
		runningTotal.appendChild(runningTotalTitle);
		runningTotal.appendChild(runningTotalAmountSpan);
		activitiesContainer.appendChild(runningTotal);
	};

	/**
	 * Update the running total by the amount specified. Negative numbers
	 * will reduce the total.
	 *
	 * @param {integer} and amount to increase/descrease the total by
	 */
	const updateRunningTotal = (value) => {
		const runningTotalSpan = document.querySelector('#runningTotal');
		let runningTotal = parseInt(runningTotalSpan.innerText);
		runningTotalSpan.innerText = (runningTotal + value);
	};

	/**
	 * Display given array of errors at top of form
	 * @param {array} an array of error strings
	 */
	 const showErrors = (errors) => {

	 	let errorContainer = document.querySelector('.error-list');
	 	if(!errorContainer){
	 		errorContainer = document.createElement('div');
	 		errorContainer.classList.add('error-list');
	 	}

		while (errorContainer.firstChild) {
			errorContainer.removeChild(errorContainer.lastChild);
		}

	 	errors.forEach( (err) => {
	 		let errLi = document.createElement('li');
	 		errLi.innerText = err;
	 		errorContainer.appendChild(errLi);
	 	});

	 	confForm.insertBefore(errorContainer, confForm.firstChild);
	}

	/**
	 * Remove all errors
	 */
	const clearErrors = () => {
		const errorList = document.querySelector('.error-list');
		if(errorList){
			errorList.parentNode.removeChild(errorList);
		}

		const errorMessages = document.querySelectorAll('p.error');
		errorMessages.forEach( (el) => {
			el.parentNode.removeChild(el);
		});

		const errorInputs = document.querySelectorAll('.error');
		errorInputs.forEach( (el) => {
			el.classList.remove('error');
		});
	}

	// initially focus name input field
	nameInput.focus();

	// initially hide other job role field
	hideTitleOtherField();

	// show/hide other job role field based on select option
	titleSelect.addEventListener('change', (e) => {
		if(e.target.selectedOptions[0].value == 'other'){
			showTitleOtherField();
		}
		else{
			hideTitleOtherField();
		}
	});

	// remove color options from select element
	emptySelectOptions(colorSelect, 'Please select a T-shirt theme');
	// initially hide color select element
	hideColorSelect();
	
	// populate t-shirt theme select options according to selected theme
	designSelect.addEventListener('change', (e) => {
		if (e.target.selectedOptions[0].value == ''){
			emptySelectOptions(colorSelect, 'Please select a T-shirt theme');
			hideColorSelect();
		}
		else if(e.target.selectedOptions[0].value == 'js puns'){
			populateSelect(colorSelect, filteredSelectOptions('JS Puns shirt only', colorSelectOptions));
			showColorSelect();
		}
		else if (e.target.selectedOptions[0].value == 'heart js') {
			populateSelect(colorSelect, filteredSelectOptions('I ♥ JS shirt only', colorSelectOptions));
			showColorSelect();
		}
	});

	// check for activity conflicts when selecting an activity
	activities.forEach( (activity) => {
		activity.addEventListener('click', (event) => {
			const checkbox = event.currentTarget;
			const cost = checkbox.dataset.cost;

			if(checkbox.checked){
				conflictingActivities(checkbox, true);
				updateRunningTotal(parseInt(cost));
			}
			else{
				conflictingActivities(checkbox, false);
				updateRunningTotal(parseInt(cost)*-1);
			}
		});
	});

	// add a running total below checkboxes
	addRunningTotal();

	// select credit card option by default
	paymentSelect.querySelector('option[value="credit card"]').selected = 'selected';

	// hide other payment methods
	hidePayPalOption()
	hideBitCoinOption();

	// show/hide fields on change select payment method
	paymentSelect.addEventListener('change', (e) => {
		switch (e.target.selectedOptions[0].value) {

			case 'select method':
				alert('Please select a payment option');
				e.target.selectedIndex = 1;

			case 'credit card':
				hidePayPalOption()
				hideBitCoinOption();
				showCreditCardOption();
			break;

			case 'paypal':
				hideCreditCardOption()
				hideBitCoinOption();
				showPayPalOption();
			break;

			case 'bitcoin':
				hidePayPalOption()
				hideCreditCardOption();
				showBitCoinOption();
			break;

		}
	});

	// create listener for email input to detect validity in real-time
	const createListener = (validator) => {
	  return e => {
	    const text = e.target.value;
	    const valid = validator(text);
	    const showError = text !== "" && !valid;
	    showOrHideError(e.target, showError, 'Please enter a valid email address');
	  };
	}

	emailInput.addEventListener("input", createListener(isValidEmail));

	// on form submit, check for errors
	confForm.addEventListener('submit', function(e) {
		e.preventDefault();
		clearErrors();

		let errors = [];

		if(!isValidName(nameInput.value)){
			const errMsg = 'Please enter a valid name'
			errors.push(errMsg)
			showOrHideError(nameInput, true, errMsg);
		}

		if(!isValidEmail(emailInput.value)){
			const errMsg = 'Please enter a valid email';
			errors.push(errMsg)
			showOrHideError(emailInput, true, errMsg);
		}

		if(!hasSelectedActivity()){
			const errMsg = 'Please choose at least one activity';
			errors.push(errMsg)
			showOrHideError(activitiesContainer, true, errMsg);
		}

		if(paymentSelect.options[paymentSelect.selectedIndex].value == 'credit card'){
			if(!isValidCardNumber2(creditCardInput.value)){
				const errMsg = 'Please enter a card number';
				errors.push(errMsg)
				showOrHideError(creditCardInput, true, errMsg);
			}
			else if(!isValidCardNumber(creditCardInput.value)){
				const errMsg = 'Please enter a valid credit card number between 13 and 16 digits';
				errors.push(errMsg)
				showOrHideError(creditCardInput, true, errMsg);
			}

			if(!isValidZIP(zipInput.value)){
				const errMsg ='Please enter a valid ZIP code consiting of five digits';
				errors.push(errMsg)
				showOrHideError(zipInput, true, errMsg);
			}

			if(!isValidCVV(cvvInput.value)){
				const errMsg ='Please enter a valid three digit CVV code';
				errors.push(errMsg)
				showOrHideError(cvvInput, true, errMsg);
			}
		}

		if(errors.length > 0){
			showErrors(errors);
		}
	});
});