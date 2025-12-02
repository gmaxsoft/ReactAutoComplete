import React, { useState } from 'react';
import AutoComplete from './AutoComplete';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
  });
  const [errors, setErrors] = useState({});

  // Obsługa zmian w polach tekstowych
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa wyboru z AutoComplete (przekazujemy callback)
 const handleCityChange = (newCity) => {
    setFormData((prev) => ({ ...prev, city: newCity }));
  };

  // Walidacja
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Imię jest wymagane';
    if (!formData.email) newErrors.email = 'Email jest wymagany';
    if (!formData.city) newErrors.city = 'Miasto jest wymagane';
    return newErrors;
  };

  // Obsługa submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    console.log('Dane formularza:', formData);
    alert('Formularz wysłany!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="name">Imię:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          id="name"
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor='email'>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          id="email"
          style={{ width: '100%', padding: '8px' }}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="city">Miasto:</label>
        <AutoComplete value={formData.city} onChange={handleCityChange} /> {/* Przekazujemy callback do wyboru */}
        {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}
      </div>

        <button type="submit" className='btn btn-primary'>
          Wyślij
        </button>
    </form>
  );
};

export default Form;