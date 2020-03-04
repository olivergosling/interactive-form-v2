window.addEventListener('DOMContentLoaded', () => {

	const nameInput = document.querySelector('#name').focus();

	// Other job title input
	const titleOtherInput = document.querySelector('#user-title-other');

	const showTitleOtherField = () => { titleOtherInput.style.display = 'block' };
	const hideTitleOtherField = () => { titleOtherInput.style.display = 'none' };

	hideTitleOtherField();

	const titleSelect = document.querySelector('#title');
	titleSelect.addEventListener('change', (e) => {
		if(e.target.selectedOptions[0].value == 'other'){
			showTitleOtherField();
		}
		else{
			hideTitleOtherField();
		}
	});

	const colorSelect = document.querySelector('#color');
	const colorSelectOptions = colorSelect.querySelectorAll('#color option');
	const designSelect = document.querySelector('#design');

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

	emptySelectOptions(colorSelect, 'Please select a T-shirt theme');

	
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


	const activities = document.querySelectorAll('.activities input[type="checkbox"]');

	activities.forEach( (activity) => {
		activity.addEventListener('click', (event) => {
			const checkbox = event.currentTarget;

			if(checkbox.checked){
				conflictingEvents(checkbox, true);
			}
			else{

				conflictingEvents(checkbox, false);
			}
		});

		event.preventDefault();
	});

	/**
	 * Determines whether any other events conflict with the supplied event
	 * @param {HTMLInputElement} Checkbox activity to test for conflicting events
	 * @param {boolean} Specify whether to disable the checkbox
	 */
	const conflictingEvents = (chosenEventCheckbox, disable) => {
		const dateAndTimeStr = chosenEventCheckbox.dataset.dayAndTime;
		const dateAndTimeResults = dateAndTimeStr.match(/^([\w]+).([\w-]+)/);
		const day = dateAndTimeResults[1];
		const time = dateAndTimeResults[2];

		let conflict = false;
		let conflicts = [];

		activities.forEach( (activity) => {
			if(activity !== chosenEventCheckbox && activity.name !== 'all'){
				const dateAndTimeStr = activity.dataset.dayAndTime;
				const sameDay = dateAndTimeStr.includes(day);
				const sameTime = dateAndTimeStr.includes(time);
				
				if(sameDay && sameTime && disable){
					activity.disabled = true;
				}
				else if(sameDay && sameTime && !disable){
					activity.disabled = false;
				}
			}
		});
	};
});