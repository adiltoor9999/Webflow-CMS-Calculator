import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calculator.css'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://proxy-server-deiy9dw6c-wasay778s-projects.vercel.app';
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const SuccessPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Success!</h2>
        <p>Your order has been submitted successfully.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};


const Calculator = () => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState({}); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryPrices, setCategoryPrices] = useState({});
  const [selectedServices, setSelectedServices] = useState({});
const [selectedAddons, setSelectedAddons] = useState({});

const [isPopupOpen, setIsPopupOpen] = useState(false);



const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});




  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venue: ''
  });

  const calculateTotal = () => {
    const categoriesTotal = selectedCategories.reduce((total, category) => {
      const categoryPrice = categoryPrices[category];
      const categoryHours = hours[category] || categoryPrice?.min || 0;
      return total + (categoryPrice?.unitPrice || 0) * categoryHours;
    }, 0);
  
    const servicesTotal = Object.values(selectedServices).reduce((total, service) => total + (service.price || 0), 0);
    const addonsTotal = Object.values(selectedAddons).reduce((total, addon) => total + (addon.price || 0), 0);
  
    return categoriesTotal + servicesTotal + addonsTotal;
  };
  
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
   // Prepare the order summary
   const orderSummary = {
    event: selectedEvent,
    categories: selectedCategories.map(category => ({
      name: category,
      hours: hours[category] || categoryPrices[category]?.min || 0,
      price: (categoryPrices[category]?.unitPrice || 0) * (hours[category] || categoryPrices[category]?.min || 0)
    })),
    services: Object.values(selectedServices),
    addons: Object.values(selectedAddons),
    total: calculateTotal()
  };
  
    // Prepare the data to be sent
    const dataToSend = {
      clientEmail: formData.email,
      adminEmail: 'adiltoor007@gmail.com',
      clientName: formData.name,
      clientPhone: formData.phone,
      venue: formData.venue,
      orderSummary: orderSummary
    };
  
    try {
      // Send the data to your backend
      const response = await axios.post(`${API_BASE_URL}/api/send-emails`, dataToSend);
      
      if (response.data.success) {
        setIsPopupOpen(true);
        // Reset the form or navigate to a thank you page
      } else {
        alert('There was an error submitting your order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    window.location.reload(); // Reload the page after closing the popup
  };

  useEffect(() => {
    if (step >= 1 && step <= 5) {
      fetchData();
    }
    
    if (step === 4) {
      fetchCategoryPrices();
    }
  }, [step, selectedCategories]);

  const fetchCategoryPrices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb765fda/items`);
      const items = response.data.items;
      const prices = {};
  
      items.forEach(item => {
        prices[item.name] = {
          min: item["min-value"],
          max: item["max-value"],
          unitPrice: item["unit-price"],
        };
      });
  
      setCategoryPrices(prices);
    } catch (error) {
      console.error('Error fetching category prices:', error);
    }
  };

  const fetchData = async () => {
    try {
      if (step === 1) {
        const response = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb765fbb/items`);
        setEvents(response.data.items);
      } else if (step === 2) {
        const response = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb765ff3/items`);
        setCategories(response.data.items.filter(item => item.listed === true));
      } else if (step === 3) {
        // Fetch services from the "services-3" collection
        const servicesResponse = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb766012/items`);
        const allServices = servicesResponse.data.items.map(service => ({
          ...service,
          price: service['base-price']
        }));
  
        // Fetch categories data to get the "services-3" array
        const categoriesResponse = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb765ff3/items`);
        const categoriesData = categoriesResponse.data.items;
  
        // Filter services based on selected categories and "services-3" array
        const filteredServices = selectedCategories.map(category => {
          const categoryData = categoriesData.find(cat => cat.name === category);
          if (categoryData && categoryData["services-3"]) {
            const categoryServices = allServices.filter(service => 
              categoryData["services-3"].includes(service._id)
            );
            return {
              category: category,
              services: categoryServices
            };
          }
          return {
            category: category,
            services: []
          };
        });
  
        console.log('Filtered services:', filteredServices);
        setServices(filteredServices);
      } else if (step === 5) {
        // Fetch add-ons from the step 5 collection
        const addonsResponse = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb765dee/items`);
        const allAddons = addonsResponse.data.items;
  
        // Fetch categories data to get the "add-ons" array
        const categoriesResponse = await axios.get(`${API_BASE_URL}/api/collection/65fa009d15525496cb765ff3/items`);
        const categoriesData = categoriesResponse.data.items;
  
        // Filter add-ons based on selected categories and "add-ons" array
        const filteredAddons = allAddons.filter(addon => 
          selectedCategories.some(category => {
            const categoryData = categoriesData.find(cat => cat.name === category);
            return categoryData && categoryData["add-ons"] && categoryData["add-ons"].includes(addon._id);
          })
        );
  
        console.log('Filtered add-ons:', filteredAddons);
        setServices(filteredAddons); // We'll reuse the services state for add-ons
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set an empty array if there's an error to prevent undefined
      if (step === 3 || step === 5) {
        setServices([]);
      }
    }
  };
  
 
  
  // Helper function to get image URL
  const getImageUrl = (item) => {
    const possibleImageFields = ['main image', 'main-image', 'mainImage', 'image', 'bg-img', 'bgImg', 'background-image', 'backgroundImage'];
    
    for (let field of possibleImageFields) {
      if (item[field]) {
        if (typeof item[field] === 'object' && item[field].url) {
          return item[field].url;
        }
        if (typeof item[field] === 'string') {
          return item[field];
        }
      }
    }
  
    console.log('No image found for item:', item.name);
    return 'https://via.placeholder.com/150';
  }
  
  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
    setStep(2); // Automatically move to step 2 when an event is selected
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== value));
    }
  };

  const handleRadioChange = (event, basePrice) => {
    const { name, value } = event.target;
    const category = name.split('-')[1];
    
    setSelectedOptions(prevOptions => {
      const newOptions = prevOptions.filter(option => !option.startsWith(category));
      return [...newOptions, `${category}:${value}`];
    });
  
    setSelectedServices(prevServices => ({
      ...prevServices,
      [category]: { name: value, price: parseFloat(basePrice) || 0 }
    }));
  };
  
  const handleCheckboxChange = (event, price) => {
    const { value, checked } = event.target;
  
    if (checked) {
      setSelectedOptions(prevOptions => [...prevOptions, value]);
      setSelectedAddons(prevAddons => ({
        ...prevAddons,
        [value]: { name: value, price: parseFloat(price) || 0 }
      }));
    } else {
      setSelectedOptions(prevOptions => prevOptions.filter(option => option !== value));
      setSelectedAddons(prevAddons => {
        const { [value]: removed, ...rest } = prevAddons;
        return rest;
      });
    }
  };

  const handleHoursChange = (category, value) => {
    setHours(prevHours => ({
      ...prevHours,
      [category]: value
    }));
  };

  const handleNextStep = () => {
    if (step === 2 && selectedCategories.length > 0) {
      setStep(step + 1);
    } else if (step === 3 && selectedOptions.length > 0) {
      setStep(step + 1);
    } else if (step === 4) {
      setStep(step + 1);
    } else if (step === 5) {
      setStep(step + 1);
    }
  };
return (
  <div className="calculator-wrapper">
     <div className="left-image">
         
         <img src="https://i.ibb.co/5Tf5Vbf/exporttt.png" alt="Background" className="background-image" />
       </div>
       <div className="main-wrapper">
    <header className="calculator-header">
      <h1 className='header '>Get A Quote</h1>
    </header>
    <div className="calculator-main-wrapper">
   
    <div className="calculator-container">
      <div className="calculator-container-2">
        <div className="tab-container">
          <input type="radio" name="tab" id="tab1" className="tab tab--1" checked={step === 1} readOnly />
          <label className="tab_label" htmlFor="tab1">Step 1</label>
          <input type="radio" name="tab" id="tab2" className="tab tab--2" checked={step === 2} readOnly />
          <label className="tab_label" htmlFor="tab2">Step 2</label>
          <input type="radio" name="tab" id="tab3" className="tab tab--3" checked={step === 3} readOnly />
          <label className="tab_label" htmlFor="tab3">Step 3</label>
          <input type="radio" name="tab" id="tab4" className="tab tab--4" checked={step === 4} readOnly />
          <label className="tab_label" htmlFor="tab4">Step 4</label>
          <input type="radio" name="tab" id="tab5" className="tab tab--5" checked={step === 5} readOnly />
          <label className="tab_label" htmlFor="tab5">Step 5</label>
          <input type="radio" name="tab" id="tab6" className="tab tab--6" checked={step === 6} readOnly />
          <label className="tab_label" htmlFor="tab6">Step 6</label>
          <div className="indicator"></div>
        </div>

        <div className="content-area">
        {step === 1 && (
  <div className="item" id="content-1">
    <h2 className="tab-title tab-primary">SELECT EVENT</h2>
    <form>
      <div className="Optionss">
        {events.map(event => (
          <label key={event._id} className={`relative cursor-pointer ${selectedEvent === event.name ? 'selected' : ''}`}>
            <input
              type="radio"
              name="event"
              value={event.name}
              className="sr-only"
              onChange={handleEventChange}
              checked={selectedEvent === event.name}
            />
            <div className="bg-img" style={{ backgroundImage: event.image ? `url('${event.image.url}')` : 'none' }}>
              <span>{event.name}</span>
            </div>
          </label>
        ))}
      </div>
    </form>
  </div>
)}
{step === 2 && (
  <div className="item" id="content-2">
    <h2 className="tab-title tab-success">Select Categories</h2>
    <form>
      <div className="Optionss">
        {categories.map(category => {
          const imageUrl = getImageUrl(category);
          console.log(`Category ${category.name} image URL:`, imageUrl); // Log each category's image URL
          return (
            <label key={category._id} className={`relative cursor-pointer ${selectedCategories.includes(category.name) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                name="categories"
                value={category.name}
                className="checkbox"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes(category.name)}
              />
              <div 
                className="bg-img" 
                style={{ backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none' }}
              >
                <span>{category.name}</span>
              </div>
            </label>
          );
        })}
      </div>
    </form>
  </div>
)}
{step === 3 && (
  <div className="item" id="content-3">
    <h2 className="tab-title tab-default">Step 3: Select Services</h2>
    {services && services.length > 0 ? (
      <form>
        <div className="Optionss">
          {services.map((categoryServices, index) => (
            <div key={`category-${index}`} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <h3>{categoryServices.category}</h3>
              {categoryServices.services && categoryServices.services.length > 0 ? (
                categoryServices.services.map((service, serviceIndex) => (
                  <label 
                    key={`service-${serviceIndex}`} 
                    className={`relative cursor-pointer ${selectedOptions.includes(`${categoryServices.category}:${service.name}`) ? 'selected' : ''}`}
                  >
                    <input
  type="radio"
  name={`options-${categoryServices.category}`}
  value={service.name}
  className="sr-only"
  onChange={(e) => handleRadioChange(e, service['base-price'])}
  checked={selectedOptions.includes(`${categoryServices.category}:${service.name}`)}
/>
<div 
  className="bg-img" 
  style={{ backgroundImage: service.img ? `url('${service.img.url}')` : 'none' }}
>
  <span>{service.name} - ${service['base-price']}</span>
</div>
                  </label>
                ))
              ) : (
                <p>No services available for this category.</p>
              )}
            </div>
          ))}
        </div>
      </form>
    ) : (
      <p>Loading services...</p>
    )}
  </div>
)}

{step === 4 && (
  <div className="step-four-container" id="content-4">
    <h2 className="tab-title tab-warning">Step 4: Set Hours for Selected Categories</h2>
    <form>
      <div className="options-container">
        {selectedCategories.map(category => {
          const categoryPrice = categoryPrices[category];
          const minHours = categoryPrice?.min || 0;
          const maxHours = categoryPrice?.max || 10;
          const currentHours = hours[category] || minHours;
          const fillPercentage = ((currentHours - minHours) / (maxHours - minHours)) * 100;
          
          return (
            <div key={category} className="option-item">
              <label htmlFor={category} className="option-label">
                {category} (Min: {minHours}h, Max: {maxHours}h)
              </label>
              <div className={`range-slider-container ${fillPercentage > 50 ? 'filled' : ''}`}>
                <div className="range-fill" style={{ width: `${fillPercentage}%` }}></div>
                <input
                  type="range"
                  id={category}
                  min={minHours}
                  max={maxHours}
                  value={currentHours}
                  className="range-slider"
                  onChange={(e) => handleHoursChange(category, parseInt(e.target.value, 10))}
                />
                <span className="range-value">{currentHours} hours</span>
              </div>
            </div>
          );
        })}
      </div>
    </form>
  </div>
)}
{step === 5 && (
  <div className="item" id="content-5">
    <h2 className="tab-title tab-warning">Step 5: Add-ons</h2>
    {services.length === 0 ? (
      <p className="loading-message">Loading add-ons...</p>
    ) : (
      <form>
        <div className="Optionss">
          {services.map((addon, index) => {
            const imageUrl = getImageUrl(addon);
            return (
              <label key={addon._id} className={`relative cursor-pointer ${selectedOptions.includes(addon.name) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="addons"
                  value={addon.name}
                  className="checkbox"
                  onChange={(e) => handleCheckboxChange(e, addon['prices-4'])}
                  checked={selectedOptions.includes(addon.name)}
                />
                <div 
                  className="bg-img" 
                  style={{ 
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '10px',
                    minHeight: '100px'
                  }}
                >
                  <span style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '5px',
                    borderRadius: '5px'
                  }}>
                    {addon.name} - ${addon['prices-4']}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </form>
    )}
  </div>
)}
{step === 6 && (
  <div className="step-six-container" id="content-6">
    <h2 className="step-title">Step 6: Contact Details</h2>
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={formData.phone}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="venue">Venue Name</label>
        <input 
          type="text" 
          id="venue" 
          name="venue" 
          value={formData.venue}
          onChange={handleInputChange}
          required 
        />
      </div>
    
    </form>
  </div>
)}

<div className="order-summary">
<div className="button-container">
  {step > 1 && step < 6 && (
    <>
      <button className="prev-button" onClick={() => setStep(step - 1)}>Previous</button>
      <button className="next-button" onClick={handleNextStep}>Next</button>
    </>
  )}
  {step === 6 && (
    <button className="submit-button" onClick={handleSubmit}>Submit</button>
  )}
</div>
      <h2>Order Summary</h2>
      <div className="summary-content">
        <div className="summary-item">
          <div className="icon-container">
            <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white"/>
            </svg>
          </div>
          <div className="item-content">
            <h3>Event:</h3>
            <p>{selectedEvent}</p>
          </div>
        </div>
        <div className="connector"></div>
        <div className="summary-item">
          <div className="icon-container">
            <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white"/>
            </svg>
          </div>
          <div className="item-content">
            <h3>Selected Categories:</h3>
            <ul>
              {selectedCategories.map(category => {
                const categoryPrice = categoryPrices[category];
                const categoryHours = hours[category] || categoryPrice?.min || 0;
                const categoryTotal = (categoryPrice?.unitPrice || 0) * categoryHours;
                return (
                  <li key={category}>
                    {category}: {categoryHours} hours - ${categoryTotal.toFixed(2)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="connector"></div>
        <div className="summary-item">
          <div className="icon-container">
            <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white"/>
            </svg>
          </div>
          <div className="item-content">
            <h3>Selected Services:</h3>
            <ul>
              {Object.entries(selectedServices).map(([category, service]) => (
                <li key={category}>{category}: {service.name} - ${service.price.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="connector"></div>
        <div className="summary-item">
          <div className="icon-container">
            <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white"/>
            </svg>
          </div>
          <div className="item-content">
            <h3>Selected Add-ons:</h3>
            <ul>
              {Object.values(selectedAddons).map(addon => (
                <li key={addon.name}>{addon.name} - ${addon.price.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="total">
        <h3>Total:</h3>
        <p>${calculateTotal().toFixed(2)}</p>
      </div>
    </div>
      </div>
      </div>
      </div>

     
      
      </div></div>
      <SuccessPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
};

const OrderSummary = ({ selectedEvent, selectedCategories, hours, categoryPrices, selectedServices, selectedAddons }) => {
  const calculateTotal = () => {
    const categoriesTotal = selectedCategories.reduce((total, category) => {
      const categoryPrice = categoryPrices[category];
      const categoryHours = hours[category] || categoryPrice?.min || 0;
      return total + (categoryPrice?.unitPrice || 0) * categoryHours;
    }, 0);
  
    const servicesTotal = Object.values(selectedServices).reduce((total, service) => total + (service.price || 0), 0);
    const addonsTotal = Object.values(selectedAddons).reduce((total, addon) => total + (addon.price || 0), 0);
  
    return categoriesTotal + servicesTotal + addonsTotal;
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <p><strong>Event:</strong> {selectedEvent}</p>
      <div className="selected-categories">
        <h3>Selected Categories:</h3>
        {selectedCategories.map(category => {
          const categoryPrice = categoryPrices[category];
          const categoryHours = hours[category] || categoryPrice?.min || 0;
          const categoryTotal = (categoryPrice?.unitPrice || 0) * categoryHours;
          return (
            <p key={category}>
              {category}: {categoryHours} hours - ${categoryTotal.toFixed(2)}
            </p>
          );
        })}
      </div>
      <div className="selected-services">
        <h3>Selected Services:</h3>
        {Object.entries(selectedServices).map(([category, service]) => (
          <p key={category}>{category}: {service.name} - ${service.price.toFixed(2)}</p>
        ))}
      </div>
      <div className="selected-addons">
        <h3>Selected Add-ons:</h3>
        {Object.values(selectedAddons).map(addon => (
          <p key={addon.name}>{addon.name} - ${addon.price.toFixed(2)}</p>
        ))}
      </div>
      <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
    </div>
  );
};

export default Calculator;