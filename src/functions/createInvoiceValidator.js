export function validateSenderStreetAddress(streetAddress) {
  if (!streetAddress.trim()) {
    return "Street address is required";
  }
  return true;
}

export function validateSenderCity(city) {
  if (!city.trim()) {
    return "City is required";
  }
  return true;
}

export function validateSenderPostCode(postCode) {
  // Basic post code validation (US format as an example)
  if (!/^\d{5}(-\d{4})?$/.test(postCode)) {
    return "Please enter a valid post code (e.g., 12345 or 12345-6789)";
  }
  return true;
}

export function validateSenderCountry(country) {
  if (!country.trim()) {
    return "Country is required";
  }
  return true;
}

export function validateClientName(name) {
  // Only allow letters and spaces, no numbers
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return "Name should only contain letters and spaces";
  }
  return true;
}

export function validateClientEmail(email) {
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return true;
}

export function validateClientStreetAddress(streetAddress) {
  if (!streetAddress.trim()) {
    return "Street address is required";
  }
  return true;
}

export function validateClientCity(city) {
  if (!city.trim()) {
    return "City is required";
  }
  return true;
}

export function validateClientPostCode(postCode) {
  // Basic post code validation (US format as an example)
  if (!/^\d{5}(-\d{4})?$/.test(postCode)) {
    return "Please enter a valid post code (e.g., 12345 or 12345-6789)";
  }
  return true;
}

export function validateClientCountry(country) {
  if (!country.trim()) {
    return "Country is required";
  }
  return true;
}

export function validateItemName(itemName) {
  if (!itemName.trim()) {
    return "Item name is required";
  }
  return true;
}

export function validateItemPrice(itemPrice) {
  if (itemPrice <= 0 || isNaN(itemPrice)) {
    return "Price must be a positive number";
  }
  return true;
}

export function validateItemCount(itemCount) {
  if (itemCount <= 0 || isNaN(itemCount)) {
    return "Item count must be a positive number";
  }
  return true;
}
