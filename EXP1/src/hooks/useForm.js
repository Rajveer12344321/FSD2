import { useState, useEffect } from 'react';
import { getValidationStrategy } from '../utils/validationStrategies';

/**
 * Custom React Hook for form management and validation.
 * Encapsulates input values, change handling, real-time validation, and reset states.
 */
export const useForm = (initialValues = { content: '', platform: 'twitter' }) => {
  const [values, setValues] = useState(initialValues);
  const [validation, setValidation] = useState({ isValid: true, errorMessage: null });

  // Run validation whenever content or platform changes
  useEffect(() => {
    const validateContent = () => {
      const strategy = getValidationStrategy(values.platform);
      const result = strategy(values.content);
      setValidation(result);
    };

    validateContent();
  }, [values.content, values.platform]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  const loadValues = (newValues) => {
    setValues(newValues);
  };

  return {
    values,
    handleChange,
    setFieldValue,
    isValid: validation.isValid,
    errorMessage: validation.errorMessage,
    reset,
    loadValues
  };
};
