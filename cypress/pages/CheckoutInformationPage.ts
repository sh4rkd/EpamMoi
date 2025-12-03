export type CustomerInformation = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const checkoutInformationSelectors = {
  firstName: "[data-test='firstName']",
  lastName: "[data-test='lastName']",
  postalCode: "[data-test='postalCode']",
  continueButton: "[data-test='continue']",
  cancelButton: "[data-test='cancel']",
  errorBanner: "[data-test='error']",
};

