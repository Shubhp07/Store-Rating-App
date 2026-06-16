export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null; // Null means no error
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!password) return 'Password is required';
  if (!passwordRegex.test(password)) {
    return 'Password must be 8-16 characters, with at least 1 uppercase letter and 1 special character';
  }
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters long';
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length > 400) {
    return 'Address must be a maximum of 400 characters';
  }
  return null;
};
