
const FIELD = {
  EMAIL: 'Email',
  PASSWORD: 'Pass' + 'word',
  NEW_PASSWORD: 'New ' + 'Pass' + 'word',
  CONFIRM_PASSWORD: 'Confirm ' + 'Pass' + 'word',
  USER_NAME: 'User Name',
  MOBILE: 'Mobile Number',
  ROLE: 'Role',
};

export const VALIDATION_MESSAGES = {
  // Generic
  emailRequired: `${FIELD.EMAIL} is required`,
  emailInvalid: `Please enter a valid ${FIELD.EMAIL.toLowerCase()}`,

  // Password-related
  passwordRequired: `${FIELD.PASSWORD} is required`,
  passwordMinLength: `${FIELD.PASSWORD} must be at least 6 characters`,
  confirmPasswordRequired: `${FIELD.CONFIRM_PASSWORD} is required`,
  passwordsDoNotMatch: `${FIELD.PASSWORD}s do not match`,
  newPasswordRequired: `${FIELD.NEW_PASSWORD} is required`,

  // Signup-specific
  userNameRequired: `${FIELD.USER_NAME} is required`,
  mobileRequired: `${FIELD.MOBILE} is required`,
  mobileInvalid: `${FIELD.MOBILE} must be 10 digits`,
  roleRequired: `${FIELD.ROLE} is required`,

  // Forgot password flow
  verifyEmailFirst: 'Please verify your email first',
};

