function validateClientName(name) {
	// Only allow letters and spaces, no numbers
	if (!/^[a-zA-Z\s]+$/.test(name)) {
		return "Name should only contain letters and spaces";
	}
	return true;
}

function validateClientStreetAddress(streetAddress) {
	if (!streetAddress.trim()) {
		return "Street address is required";
	}
	return true;
}

function validateClientPostCode(postCode) {
	if (!(/^\d{5}(-\d{4})?$/.test(postCode) || // US
		/^\d{5}$/.test(postCode) ||          // ID/Malaysia
		/^\d{6}$/.test(postCode) ||          // Singapore/China
		/^(?=.*\d)[a-zA-Z0-9\- ]{3,10}$/.test(postCode) // Lainnya
	)
	) {
		return "Please enter a valid post code \n(e.g., 12345 (ID), \n12345-6789 (US), \n123456 (SG/China))";
	}
	return true;
}

function validateClientCountry(country) {
	if (!country.trim()) {
		return "Country is required";
	} else if (country.length < 2 || country.length > 50) {
		return "Country name should be between 2 and 50 characters";
	} else if (!/^[a-zA-Z\s]+$/.test(country)) {
		return "Country should only contain letters and spaces";
	}
	return true;
}

function validateClientPhone(phone) {
	if (!/^\+?[0-9\s\-()]+$/.test(phone)) {
		return "Please enter a valid phone number \n(e.g., +62 812-3456-7890, \n0812-3456-7890, \n08123456789)";
	}
	return true;
}

export function clientFormValidator(formData) {
	const {
		client_name,
		client_address,
		postal_code,
		country,
		client_phone
	} = formData;

	if (validateClientName(client_name) !== true) return validateClientName(client_name);
	if (validateClientCountry(country) !== true) return validateClientCountry(country);
	if (validateClientStreetAddress(client_address) !== true) return validateClientStreetAddress(client_address);
	if (validateClientPostCode(postal_code) !== true) return validateClientPostCode(postal_code);
	if (validateClientPhone(client_phone) !== true) return validateClientPhone(client_phone);
	return true;
}