function validateClientName(name) {
  const cleaned = name.trim();

  // Cek panjang minimal
  if (cleaned.length < 2) {
    return "Name must be at least 2 characters long";
  }

  // Hanya izinkan huruf, spasi, titik, dan tanda hubung
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  if (!nameRegex.test(cleaned)) {
    return "Name contains invalid characters (only letters, spaces, '. - are allowed)";
  }

  return true;
}

function validateClientStreetAddress(streetAddress) {
  const cleaned = streetAddress.trim();

  // Minimal panjang, tidak hanya karakter aneh
  if (cleaned.length < 5) {
    return "Address must be at least 5 characters long";
  }

  // Hindari karakter tidak lazim atau berbahaya
  const unsafeChars = /[<>]/;
  if (unsafeChars.test(cleaned)) {
    return "Address contains invalid characters (e.g., < or >)";
  }

  return true;
}

function validateClientPostCode(postCode) {
  const patterns = [
    /^\d{5}(-\d{4})?$/, // US (12345 or 12345-6789)
    /^\d{5}$/, // ID, Malaysia
    /^\d{6}$/, // SG, China, India
    /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada (K1A 0B1 or K1A0B1)
    /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, // UK (SW1A 1AA, etc.)
  ];

  const isValid = patterns.some((regex) => regex.test(postCode));

  if (!isValid) {
    return `Please enter a valid postal code\nExamples:
	- 12345 (ID/US)
	- 12345-6789 (US)
	- 123456 (SG/China)
	- K1A 0B1 (Canada)
	- SW1A 1AA (UK)`;
  }

  return true;
}

const allowedCountries = [
  "Indonesia",
  "United States",
  "Singapore",
  "Malaysia",
  "United Kingdom",
  "Japan",
  "China",
  "Australia",
  "Canada",
];

function validateClientCountry(country) {
  const normalizedInput = country.trim().toLowerCase();
  const normalizedAllowed = allowedCountries.map((c) => c.toLowerCase());

  if (!normalizedAllowed.includes(normalizedInput)) {
    return `Please enter a valid country name\nExamples:
	- Indonesia
	- Singapore
	- China
	- United States`;
  }

  return true;
}
function validateClientPhone(phone) {
  // Valid: +6281234567890, 081234567890, (021)1234567, 0812-3456-7890
  const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\(?\d+\)?[\s-]?)*\d{3,}$/;

  if (!phoneRegex.test(phone)) {
    return `Please enter a valid phone number\nExamples:
 - +6281234567890 (Intl)
 - 081234567890 (ID)
 - (021)1234567 (Landline)`;
  }

  return true;
}

export function clientFormValidator(formData) {
  const { client_name, client_address, postal_code, country, client_phone } =
    formData;

  if (validateClientName(client_name) !== true)
    return validateClientName(client_name);
  if (validateClientCountry(country) !== true)
    return validateClientCountry(country);
  if (validateClientStreetAddress(client_address) !== true)
    return validateClientStreetAddress(client_address);
  if (validateClientPostCode(postal_code) !== true)
    return validateClientPostCode(postal_code);
  if (validateClientPhone(client_phone) !== true)
    return validateClientPhone(client_phone);
  return true;
}
