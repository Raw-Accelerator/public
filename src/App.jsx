import { useState, useEffect } from 'react';
import './App.css';
import GridOverlay from './GridOverlay';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Startup',
    otherType: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.type === 'Partner/Vendor') {
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

  useEffect(() => {
    if (formData.type === 'Other') {
      const canvas = document.getElementById('dvd-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const img = new Image();
      img.src = '/question.svg';

      const colors = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

      const logos = [
        {
          x: Math.random() * (canvas.width - 150),
          y: Math.random() * (canvas.height - 150),
          vx: 2,
          vy: 2,
          width: 150,
          height: 150,
          colorIndex: 0
        },
        {
          x: Math.random() * (canvas.width - 150),
          y: Math.random() * (canvas.height - 150),
          vx: -2,
          vy: 2,
          width: 150,
          height: 150,
          colorIndex: 2
        },
        {
          x: Math.random() * (canvas.width - 150),
          y: Math.random() * (canvas.height - 150),
          vx: 2,
          vy: -2,
          width: 150,
          height: 150,
          colorIndex: 4
        }
      ];

      function animate() {
        ctx.fillStyle = '#413c4a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        logos.forEach(logo => {
          // Move logo
          logo.x += logo.vx;
          logo.y += logo.vy;

          // Bounce off edges and change color
          if (logo.x <= 0 || logo.x + logo.width >= canvas.width) {
            logo.vx *= -1;
            logo.colorIndex = (logo.colorIndex + 1) % colors.length;
          }
          if (logo.y <= 0 || logo.y + logo.height >= canvas.height) {
            logo.vy *= -1;
            logo.colorIndex = (logo.colorIndex + 1) % colors.length;
          }

          // Draw logo with color filter
          ctx.save();
          ctx.filter = `hue-rotate(${logo.colorIndex * 60}deg) saturate(150%)`;
          ctx.drawImage(img, logo.x, logo.y, logo.width, logo.height);
          ctx.restore();
        });

        requestAnimationFrame(animate);
      }

      img.onload = () => {
        animate();
      };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
          alert('Thank you for your support!');
          // Reset form
          setFormData({ name: '', email: '', type: 'Startup', otherType: '' });
          setErrors({});
        } else {
          throw new Error(data.error || 'Submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
      }
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
    <div className={`app ${formData.type === 'Investor/LP' ? 'investor-mode' : ''} ${formData.type === 'Partner/Vendor' ? 'partner-mode' : ''} ${formData.type === 'Other' ? 'other-mode' : ''}`}>
      {formData.type === 'Investor/LP' ? (
        <video
          src="/austin.mp4"
          className="app-background"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : formData.type === 'Partner/Vendor' ? (
        <div className="network-background">
          <canvas id="network-canvas" className="app-background"></canvas>
        </div>
      ) : formData.type === 'Other' ? (
        <div className="dvd-background">
          <canvas id="dvd-canvas" className="app-background"></canvas>
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
          <img src="/rocket.svg" alt="" className="collage-rocket" />
        </div>
      )}

      <div className="form-overlay">
        {formData.type === 'Investor/LP' && (
          <div className="hero-text">
            <h1>Uniting investors, corporates, and founders in a 24-month hands-on, no BS, hardcore company-building experiment to launch the next wave of Austin-born, globally scaled companies.</h1>
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
              formData.type === 'Partner/Vendor' ? '/bluelogo.svg' :
              formData.type === 'Other' ? '/rawquestion.svg' :
              '/rawlogo.svg'
            }
            alt="Raw Logo"
            className="form-logo"
          />
          {formData.type === 'Partner/Vendor' ? (
            <p className="form-subheadline">Become a true partner, and let's push the ATX ecosystem to new heights.</p>
          ) : formData.type === 'Other' ? (
            <p className="form-subheadline">Don't really fit into one of the predefined categories? It's ok. Neither do we, <strong><u>and that's by design</u></strong>.</p>
          ) : formData.type === 'Investor/LP' ? (
            <p className="form-subheadline">Building Austin's next generation of globally scaled companies.</p>
          ) : (
            <p className="form-subheadline">FUNDING UPFRONT. NO BS. BRUTAL WORK ETHIC. ALL-IN OR NOT AT ALL.</p>
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
                <span>Partner/Vendor/Gov</span>
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

          <button type="submit" className="submit-button">
            {formData.type === 'Investor/LP' ? "COUNT ME IN - LET'S CHAT" : formData.type === 'Startup' ? 'I WANT THIS' : 'I SUPPORT THIS'}
          </button>
            </form>
          </div>
        </div>
      </div>

      <GridOverlay />
    </div>
  );
}

export default App;
