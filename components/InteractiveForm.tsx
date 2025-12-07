import React, { useState, useCallback, useMemo } from 'react';
import { FormState, FormErrors } from '../types';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from './Icons';
import InputField from './InputField';


const InteractiveForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = useCallback((name: keyof FormState, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return value.trim() ? undefined : 'Name is required.';
      case 'email':
        if (!value) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format.';
        return undefined;
      case 'phone':
        if (!value) return 'Phone number is required.';
        if (!/^\d{10,15}$/.test(value.replace(/\s+/g, ''))) return 'Phone must be 10 to 15 digits.';
        return undefined;
      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters long.';
        if (!/[a-z]/.test(value)) return 'Must contain a lowercase letter.';
        if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter.';
        if (!/\d/.test(value)) return 'Must contain a number.';
        if (!/[@$!%*?&]/.test(value)) return 'Must contain a special character (@$!%*?&).';
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof FormState; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof FormState; value: string };
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const isFormValid = useMemo(() => {
    const hasAllFields = Object.values(formData).every(value => value.trim() !== '');
    if (!hasAllFields) return false;

    const currentErrors = Object.keys(formData).reduce((acc, key) => {
        const fieldKey = key as keyof FormState;
        const error = validate(fieldKey, formData[fieldKey]);
        if (error) {
            acc[fieldKey] = error;
        }
        return acc;
    }, {} as FormErrors);

    return Object.keys(currentErrors).length === 0;
  }, [formData, validate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const allTouched = { name: true, email: true, phone: true, password: true };
    setTouched(allTouched);

    const validationErrors = Object.keys(formData).reduce((acc, key) => {
        const fieldKey = key as keyof FormState;
        const error = validate(fieldKey, formData[fieldKey]);
        if (error) {
            acc[fieldKey] = error;
        }
        return acc;
    }, {} as FormErrors);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted successfully:', formData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', password: ''});
    setErrors({});
    setTouched({});
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center transform transition-all duration-500 scale-100">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submission Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300">Thank you for submitting your information. We'll be in touch shortly.</p>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Create Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="name"
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : undefined}
          placeholder="John Doe"
        />
        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          placeholder="you@example.com"
        />
        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone ? errors.phone : undefined}
          placeholder="1234567890"
        />
        <InputField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          placeholder="••••••••"
        >
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </InputField>
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full px-4 py-2.5 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default InteractiveForm;
