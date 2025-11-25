import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (formData.type === 'Partner/Vendor' || formData.type === 'Other') {
      const canvas = document.getElementById('network-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 80;
      const maxDistance = 150;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1
        });
      }

      function animate() {
        ctx.fillStyle = 'rgba(245, 247, 250, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.fillStyle = '#0EA5E9';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
              ctx.strokeStyle = `rgba(14, 165, 233, ${1 - distance / maxDistance})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(animate);
      }

      animate();

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [formData.type]);

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
    <div className={`app ${formData.type === 'Investor/LP' ? 'investor-mode' : ''} ${(formData.type === 'Partner/Vendor' || formData.type === 'Other') ? 'partner-mode' : ''}`}>
      {formData.type === 'Investor/LP' ? (
        <video
          src="/austin.mp4"
          className="app-background"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (formData.type === 'Partner/Vendor' || formData.type === 'Other') ? (
        <div className="network-background">
          <canvas id="network-canvas" className="app-background"></canvas>
        </div>
      ) : (
        <img src="/bg.svg" alt="Background" className="app-background" />
      )}

      {(formData.type === 'Startup' || formData.type === '') && (
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
      )}

      <div className="form-overlay">
        {formData.type === 'Investor/LP' && (
          <div className="hero-text">
            <h1>Uniting investors, corporates, and founders in a 24-month experiment to build the next wave of Austin-born, globally scaled companies.</h1>
            <p>We turn early teams into investable companies through structured validation, measurable traction, and predictable progress.</p>
            <div className="hero-cta">JOIN THE MOVEMENT.</div>
          </div>
        )}
        <div className="form-wrapper">
          <div className="form-container">
            {(formData.type === 'Startup' || formData.type === '') && (
              <img src="/tantape.svg" alt="" className="collage-tantape" />
            )}
            <form className="support-form" onSubmit={handleSubmit}>
          <img
            src={
              formData.type === 'Investor/LP' ? '/rawcorp.svg' :
              (formData.type === 'Partner/Vendor' || formData.type === 'Other') ? '/bluelogo.svg' :
              '/rawlogo.svg'
            }
            alt="Raw Logo"
            className="form-logo"
          />
          {(formData.type === 'Partner/Vendor' || formData.type === 'Other') ? (
            <p className="form-subheadline">Join the ecosystem accelerating Austin's most ambitious founders.</p>
          ) : formData.type === 'Investor/LP' ? (
            <p className="form-subheadline">Building Austin's next generation of globally scaled companies.</p>
          ) : (
            <p className="form-subheadline">We killed the old playbook — this is where founders get forged, sharpened, and unleashed.</p>
          )}

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
