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
				// ensure any selected state is removed
				el.selected = '';
				filteredOptions.push(el);
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
		console.log(e.target.selectedOptions[0].value);

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
});