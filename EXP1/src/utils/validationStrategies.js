/**
 * Validation strategies using the Strategy Design Pattern.
 * Each strategy is a function that validates content and returns { isValid, errorMessage }.
 * This makes the system open for extension (easy to add new platforms) and closed for modification.
 */
export const validationStrategies = {
  twitter: (text) => {
    const limit = 280;
    if (text.length > limit) {
      return {
        isValid: false,
        errorMessage: `Twitter content exceeds the limit of ${limit} characters (current: ${text.length}).`
      };
    }
    return { isValid: true, errorMessage: null };
  },

  linkedin: (text) => {
    const limit = 3000;
    if (text.length > limit) {
      return {
        isValid: false,
        errorMessage: `LinkedIn content exceeds the limit of ${limit} characters (current: ${text.length}).`
      };
    }
    return { isValid: true, errorMessage: null };
  },

  instagram: (text) => {
    const limit = 2200;
    const hasHashtag = text.includes('#');

    if (text.length > limit) {
      return {
        isValid: false,
        errorMessage: `Instagram content exceeds the limit of ${limit} characters (current: ${text.length}).`
      };
    }

    if (!hasHashtag && text.length > 0) {
      return {
        isValid: false,
        errorMessage: 'Instagram content requires at least one hashtag (e.g., #nature).'
      };
    }

    return { isValid: true, errorMessage: null };
  }
};

/**
 * Gets the validation strategy for the selected platform, defaulting to a basic check.
 */
export const getValidationStrategy = (platform) => {
  return validationStrategies[platform] || ((text) => ({ isValid: true, errorMessage: null }));
};
