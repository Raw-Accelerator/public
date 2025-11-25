import { useState } from 'react';
import './App.css';
import GridOverlay from './GridOverlay';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    otherType: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.type) {
      newErrors.type = 'Please select an option';
    }

    if (formData.type === 'Other' && !formData.otherType.trim()) {
      newErrors.otherType = 'Please specify';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Thank you for your support!');
      // Reset form
      setFormData({ name: '', email: '', type: '', otherType: '' });
      setErrors({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="app">
      <img src="/bg.svg" alt="Background" className="app-background" />

      <div className="collage-elements">
        <img src="/smiley.svg" alt="" className="collage-smiley" />
        <img src="/dice.svg" alt="" className="collage-dice" />
        <img src="/caution.svg" alt="" className="collage-caution" />
        <img src="/circles.svg" alt="" className="collage-circles" />
        <img src="/path.svg" alt="" className="collage-path" />
        <img src="/crack.svg" alt="" className="collage-crack" />
        <img src="/chevron.svg" alt="" className="collage-chevron" />
        <img src="/checkers.svg" alt="" className="collage-checkers" />
        <img src="/tree.svg" alt="" className="collage-tree" />
        <img src="/drips.svg" alt="" className="collage-drips" />
        <img src="/barcode.svg" alt="" className="collage-barcode" />
        <img src="/ducttape.svg" alt="" className="collage-ducttape" />
      </div>

      <div className="form-overlay">
        <div className="form-wrapper">
          <div className="form-container">
            <img src="/tantape.svg" alt="" className="collage-tantape" />
            <form className="support-form" onSubmit={handleSubmit}>
          <img src="/rawlogo.svg" alt="Raw Logo" className="form-logo" />
          <p className="form-subheadline">We killed the old playbook — this is where founders get forged, sharpened, and unleashed.</p>

          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>What are you?*</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Startup"
                  checked={formData.type === 'Startup'}
                  onChange={handleInputChange}
                />
                <span>Startup</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Investor/LP"
                  checked={formData.type === 'Investor/LP'}
                  onChange={handleInputChange}
                />
                <span>Investor/LP</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Partner/Vendor"
                  checked={formData.type === 'Partner/Vendor'}
                  onChange={handleInputChange}
                />
                <span>Partner/Vendor</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="Other"
                  checked={formData.type === 'Other'}
                  onChange={handleInputChange}
                />
                <span>Other</span>
              </label>
            </div>
            {errors.type && <span className="error-message">{errors.type}</span>}
          </div>

          {formData.type === 'Other' && (
            <div className="form-group">
              <input
                type="text"
                id="otherType"
                name="otherType"
                placeholder="Please specify"
                value={formData.otherType}
                onChange={handleInputChange}
                className={errors.otherType ? 'error' : ''}
              />
              {errors.otherType && <span className="error-message">{errors.otherType}</span>}
            </div>
          )}

          <button type="submit" className="submit-button">I SUPPORT THIS</button>
            </form>
          </div>
        </div>
      </div>

      <GridOverlay />
    </div>
  );
}

export default App;
