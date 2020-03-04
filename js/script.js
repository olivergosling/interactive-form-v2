window.addEventListener('DOMContentLoaded', () => {

	const nameInput = document.querySelector('#name').focus();
	const titleOtherInput = document.querySelector('#user-title-other');
	const titleSelect = document.querySelector('#title');
	const activitiesContainer = document.querySelector('.activities');
	const activities = document.querySelectorAll('.activities input[type="checkbox"]');
	const colorSelect = document.querySelector('#color');
	const colorSelectOptions = colorSelect.querySelectorAll('#color option');
	const designSelect = document.querySelector('#design');

	let runningTotalAmount = 0.00;

	const showTitleOtherField = () => { titleOtherInput.style.display = 'block' };
	const hideTitleOtherField = () => { titleOtherInput.style.display = 'none' };

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

	hideTitleOtherField();

	titleSelect.addEventListener('change', (e) => {
		if(e.target.selectedOptions[0].value == 'other'){
			showTitleOtherField();
		}
		else{
			hideTitleOtherField();
		}
	});

	emptySelectOptions(colorSelect, 'Please select a T-shirt theme');

	designSelect.addEventListener('change', (e) => {
		if (e.target.selectedOptions[0].value == ''){
			emptySelectOptions(colorSelect, 'Please select a T-shirt theme');
		}
		else if(e.target.selectedOptions[0].value == 'js puns'){
			populateSelect(colorSelect, filteredSelectOptions('JS Puns shirt only', colorSelectOptions));
		}
		else if (e.target.selectedOptions[0].value == 'heart js') {
			populateSelect(colorSelect, filteredSelectOptions('I ♥ JS shirt only', colorSelectOptions));
		}
	});

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

	addRunningTotal();
});