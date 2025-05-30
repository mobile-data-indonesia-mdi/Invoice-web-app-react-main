function validateInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber.trim()) {
    return "Invoice number is required";
  }
  return true;
}

function validatePaymentDate(paymentDate) {
  if (!paymentDate.trim()) {
    return "Payment date is required";
  }
  const date = new Date(paymentDate);

  if (isNaN(date.getTime())) {
    return "Invalid due date format";
  }
  return true;
}

function validateAmountPaid(amountPaid) {
    if (!/^\d+(\.\d{1,2})?$/.test(amountPaid)) {
        return "Amount paid must be a valid number";
    } else if (isNaN(Number(amountPaid)) || Number(amountPaid) <= 0) {
        return "Amount paid must be a number greater than 0";
    }
    return true;
}

function validateClientName(clientName) {
    console.log("Validating client name:", clientName);
  if (!clientName.trim()) {
    return "Client name is required";
  }
  return true;
}

function validateProofOfTransfer(proofOfTransfer) {
    if (!proofOfTransfer) {
        return "Proof of transfer is required";
    }
    return true;
}

export function paymentFormValidator(formData) {
  const {
    invoiceNumber,
    paymentDate,
    amountPaid,
    clientName,
    proofFile: proofOfTransfer
  } = formData;

  if (validateInvoiceNumber(invoiceNumber) !== true) return validateInvoiceNumber(invoiceNumber);
  if (validatePaymentDate(paymentDate) !== true) return validatePaymentDate(paymentDate);
  if (validateAmountPaid(amountPaid) !== true) return validateAmountPaid(amountPaid);
  if (validateClientName(clientName) !== true) return validateClientName(clientName);
  if (validateProofOfTransfer(proofOfTransfer) !== true) return validateProofOfTransfer(proofOfTransfer);

  return true;
}