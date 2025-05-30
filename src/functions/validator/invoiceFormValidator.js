// INVOICE VALIDATION
function validateInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber.trim()) {
    return "Invoice number is required";
  }
  return true;
}

function validateInvoiceDate(invoiceDate, invoiceDueDate) {
  if (!invoiceDate.trim()) {
    return "Invoice date is required";
  }
  
  const date = new Date(invoiceDate);
  const dueDate = new Date(invoiceDueDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date format";
  }

  // Check if the date is after the due date
  if (date > dueDate) {
    return "Invoice date cannot be after the due date";
  }
  return true;
}

function validateInvoiceDueDate(invoiceDueDate) {
  if (!invoiceDueDate.trim()) {
    return "Due date is required";
  }

  const dueDate = new Date(invoiceDueDate);

  // Check if the due date is valid
  if (isNaN(dueDate.getTime())) {
    return "Invalid due date format";
  }
  return true;
}

function validateInvoiceTaxNumber(invoiceTaxNumber) {
  if (!invoiceTaxNumber.trim()) {
    return "Invoice tax number is required";
  }
  return true;
}

function validateInvoiceTax(invoiceTax) {
  if (typeof invoiceTax === "string") {
    invoiceTax = parseFloat(invoiceTax);
  }

  // Validasi input agar hanya angka dan desimal yang diperbolehkan
  if (!/^(0|[1-9]\d*)(\.\d{0,4})?$/.test(invoiceTax)) {
    return "Tax must be a valid number";
  }

  if (invoiceTax < 0 || isNaN(invoiceTax)) {
    return "Tax must be a positive number";
  }
  return true;
}

// INVOICE DETAIL VALIDATION
function validateItemName(itemName) {
  if (!itemName.trim()) {
    return "Item name is required";
  }
  return true;
}

function validateItemPrice(itemPrice) {
  if(typeof itemCount === "string") {
    itemPrice = parseInt(itemPrice);
  }

  // Validasi input agar hanya angka dan desimal yang diperbolehkan
  if (!/^(0|[1-9]\d*)(\.\d{0,4})?$/.test(itemPrice)) {
    return "Price must be a valid number";
  }

  if (itemPrice <= 0 || isNaN(itemPrice)) {
    return "Price must be a positive number";
  }
  return true;
}

function validateItemCount(itemCount) {
  if(typeof itemCount === "string") {
    itemCount = parseInt(itemCount);
  }

  // Validasi input agar hanya angka yang diperbolehkan
  if (!/^\d+$/.test(itemCount)) {
    return "Item count must be a valid number";
  }

  if (itemCount <= 0 || isNaN(itemCount)) {
    return "Item count must be a positive number";
  }
  return true;
}

export function invoiceFormValidator(formData) {
  const {
    invoiceNumber,
    invoiceDate,
    dueDate: invoiceDueDate,
    taxInvoiceNumber: invoiceTaxNumber,
    tax: invoiceTax,
    items
  } = formData;

  if (validateInvoiceNumber(invoiceNumber) !== true) return validateInvoiceNumber(invoiceNumber);
  if (validateInvoiceDate(invoiceDate, invoiceDueDate) !== true) return validateInvoiceDate(invoiceDate, invoiceDueDate);
  if (validateInvoiceDueDate(invoiceDueDate) !== true) return validateInvoiceDueDate(invoiceDueDate);
  if (validateInvoiceTaxNumber(invoiceTaxNumber) !== true) return validateInvoiceTaxNumber(invoiceTaxNumber);
  if (validateInvoiceTax(invoiceTax) !== true) return validateInvoiceTax(invoiceTax);
  if (!items || items.length === 0) return "Minimal 1 item harus diisi.";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (validateItemName(item.name) !== true) return `Item #${i + 1}: ${validateItemName(item.name)}`;
    if (validateItemCount(item.usage) !== true) return `Item #${i + 1}: ${validateItemCount(item.usage)}`;
    if (validateItemPrice(item.price) !== true) return `Item #${i + 1}: ${validateItemPrice(item.price)}`;
  }
  return true;
}
