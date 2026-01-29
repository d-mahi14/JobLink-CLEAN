export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('Please select a file');
    return errors;
  }

  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    errors.push('File size must be less than 5MB');
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push('Only PDF and Word documents are allowed');
  }

  return errors;
};

export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('Please select an image');
    return errors;
  }

  // Check file size (2MB max for images)
  if (file.size > 2 * 1024 * 1024) {
    errors.push('Image size must be less than 2MB');
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPG, PNG, and WebP images are allowed');
  }

  return errors;
};
