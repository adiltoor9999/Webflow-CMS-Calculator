import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calculator.css'; 

const Calculator = () => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [addons, setAddons] = useState([]);
  const [error, setError] = useState([]);
  const [hours, setHours] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredServicesByCategory, setFilteredServicesByCategory] = useState({});
  const [filteredAddonsByCategory, setFilteredAddonsByCategory] = useState({});



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venue: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted', formData);
    // Here you would typically send the data to a server
  };
  useEffect(() => {
    if (step >= 1 && step <= 5) {
      fetchData();
    }
    if (step === 3 && selectedCategories.length > 0) {
      fetchFilteredServices();
      fetchFilteredAddons();
    }
  }, [step, selectedCategories]);

  const fetchData = async () => {
    let collectionId;
    try {
      switch (step) {
        case 1:
          collectionId = '65fa009d15525496cb765fbb';
          break;
        case 2:
          collectionId = '65fa009d15525496cb765ff3';
          const categoriesResponse = await axios.get(
            `http://localhost:3001/api/collection/${collectionId}/items`
          );
          const categories = categoriesResponse.data.items.filter((item) => item.listed === true);
          setCategories(categories);
          break;
        case 3:
          collectionId = '65fa009d15525496cb766012';
          break;
        case 4:
          collectionId = '65fa009d15525496cb765fa2';
          break;
        case 5:
          collectionId = '65fa009d15525496cb765dee';
          break;
        default:
          return;
      }
  
      if (step !== 2) {
        const [servicesResponse, addonsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/collection/${collectionId}/items`),
          axios.get(`http://localhost:3001/api/collection/65fa009d15525496cb765dee/items`),
        ]);
        
        const servicesItems = servicesResponse.data.items;
        const addonsItems = addonsResponse.data.items;
  
        console.log(`Step ${step} data:`, JSON.stringify(servicesItems, null, 2));
  
        if (step === 1) {
          setEvents(servicesItems);
        } else if (step === 3) {
          updateFilteredServices();
          updateFilteredAddons();
        } else {
          setServices(servicesItems);
          setAddons(addonsItems);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Display an error message to the user
      setError('Failed to fetch data. Please try again later.');
    }
  };
  const fetchFilteredServices = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/collection/65fa009d15525496cb765ff3/items`);
      const items = response.data.items;
      const filteredServicesByCategory = {};
  
      selectedCategories.forEach((category) => {
        filteredServicesByCategory[category] = items.filter((service) => {
          if (service.categories) {
            return service.categories.includes(category);
          } else {
            return false;
          }
        });
      });
  
      setFilteredServicesByCategory(filteredServicesByCategory);
    } catch (error) {
      console.error('Error fetching filtered services:', error);
    }
  };

  const fetchFilteredAddons = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/collection/65fa009d15525496cb765dee/items`);
      const items = response.data.items;
      const filteredAddonsByCategory = {};
  
      selectedCategories.forEach((category) => {
        filteredAddonsByCategory[category] = items.filter((addon) => {
          if (addon.categories) {
            return addon.categories.includes(category);
          } else {
            return false;
          }
        });
      });
  
      setFilteredAddonsByCategory(filteredAddonsByCategory);
    } catch (error) {
      console.error('Error fetching filtered addons:', error);
    }
  };
  const getImageUrl = (item) => {
    const possibleImageFields = [
      'main image',
      'main-image',
      'mainImage',
      'image',
      'bg-img',
      'bgImg',
      'background-image',
      'backgroundImage',
    ];

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
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };


  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
      updateFilteredServices(value);
      updateFilteredAddons(value);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
      updateFilteredServices(value, false);
      updateFilteredAddons(value, false);
    }
  };

  const updateFilteredServices = (categoryName, add = true) => {
    setFilteredServicesByCategory((prevState) => ({
      ...prevState,
      [categoryName]: add
        ? services.filter((service) => service.categories.includes(categoryName))
        : [],
    }));
  };
  
  const updateFilteredAddons = (categoryName, add = true) => {
    setFilteredAddonsByCategory((prevState) => ({
      ...prevState,
      [categoryName]: add
        ? addons.filter((addon) => addon.categories.includes(categoryName))
        : [],
    }));
  };
  const fetchAssociatedServices = async (categoryName) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/collection/65fa009d15525496cb766012/items`);
      const items = response.data.items;
      const filteredServices = items.filter((service) => {
        if (service.categories) {
          return service.categories.includes(categoryName);
        } else {
          return false;
        }
      });
      setFilteredServicesByCategory((prevState) => ({
        ...prevState,
        [categoryName]: filteredServices,
      }));
    } catch (error) {
      console.error('Error fetching associated services:', error);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions((prevOptions) => [...prevOptions, value]);
    } else {
      setSelectedOptions((prevOptions) => prevOptions.filter((option) => option !== value));
    }
  };

  const handleHoursChange = (serviceName, value) => {
    setHours((prevHours) => ({
      ...prevHours,
      [serviceName]: value,
    }));
  };

  const handleNextStep = () => {
    if (step === 1 && selectedEvent) {
      setStep(step + 1);
    } else if (step === 2 && selectedCategories.length > 0) {
      setStep(step + 1);
    } else if (step === 3 && selectedOptions.length > 0) {
      setStep(step + 1);
    } else if (step === 4) {
      setStep(step + 1);
    } else if (step === 5) {
      setStep(step + 1);
    } else {
      console.log('Please select at least one service');
    }
  };

  return (
    <div className="calculator-wrapper">
       {error && <div className="error-message">{error}</div>}
      <header className="calculator-header">
        <h1 className="header">Get A Quote</h1>
      </header>

      <div className="calculator-container">
        <div className="calculator-container-2">
          <div className="tab-container">
            <input
              type="radio"
              name="tab"
              id="tab1"
              className="tab tab--1"
              checked={step === 1}
              readOnly
            />
            <label className="tab_label" htmlFor="tab1">
              Step 1
            </label>
            <input
              type="radio"
              name="tab"
              id="tab2"
              className="tab tab--2"
              checked={step === 2}
              readOnly
            />
            <label className="tab_label" htmlFor="tab2">
              Step 2
            </label>
            <input
              type="radio"
              name="tab"
              id="tab3"
              className="tab tab--3"
              checked={step === 3}
              readOnly
            />
            <label className="tab_label" htmlFor="tab3">
              Step 3
            </label>
            <input
              type="radio"
              name="tab"
              id="tab4"
              className="tab tab--4"
              checked={step === 4}
              readOnly
            />
            <label className="tab_label" htmlFor="tab4">
              Step 4
            </label>
            <input
              type="radio"
              name="tab"
              id="tab5"
              className="tab tab--5"
              checked={step === 5}
              readOnly
            />
            <label className="tab_label" htmlFor="tab5">
              Step 5
            </label>
            <input
              type="radio"
              name="tab"
              id="tab6"
              className="tab tab--6"
              checked={step === 6}
              readOnly
            />
            <label className="tab_label" htmlFor="tab6">
              Step 6
            </label>
            <div className="indicator"></div>
          </div>

          <div className="content-area">
            {step === 1 && (
              <div className="item" id="content-1">
                <h2 className="tab-title tab-primary">SELECT EVENT</h2>
                <form>
                  <div className="Optionss">
                    {events.map((event) => (
                      <label
                        key={event._id}
                        className={`relative cursor-pointer ${
                          selectedEvent === event.name ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="event"
                          value={event.name}
                          className="sr-only"
                          onChange={handleEventChange}
                          checked={selectedEvent === event.name}
                        />
                        <div
                          className="bg-img"
                          style={{
                            backgroundImage: event.image
                              ? `url('${event.image.url}')`
                              : 'none',
                          }}
                        >
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
                    {categories.map((category) => {
                      const imageUrl = getImageUrl(category);
                      console.log(`Category ${category.name} image URL:`, imageUrl);
                      return (
                        <label
                          key={category._id}
                          className={`relative cursor-pointer ${
                            selectedCategories.includes(category.name) ? 'selected' : ''
                          }`}
                        >
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
                            style={{
                              backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none',
                            }}
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
    {Object.keys(filteredServicesByCategory).map((category) => (
      <div key={category}>
        <h3>{category}</h3>
        <div className="Optionss">
          {filteredServicesByCategory[category]?.map((service) => (
                        <label
                          key={service._id}
                          className={`relative cursor-pointer ${
                            selectedOptions.includes(service.name) ? 'selected' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="options"
                            value={service.name}
                            className="checkbox"
                            onChange={handleCheckboxChange}
                            checked={selectedOptions.includes(service.name)}
                          />
                          <div
                            className="bg-img"
                            style={{
                              backgroundImage: service.img
                                ? `url('${service.img.url}')`
                                : 'none',
                              backgroundColor: '#f0f0f0',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              padding: '10px',
                              minHeight: '100px',
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                padding: '5px',
                                borderRadius: '5px',
                              }}
                            >
                              {service.name} - {service.price}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="step-five-container" id="content-5">
                <h2 className="step-title">Step 5: Set Hours for Selected Categories</h2>
                <form>
                  <div className="options-container">
                    {selectedCategories.map((category) => (
                      <div key={category} className="option-item">
                        <label htmlFor={category} className="option-label">
                          {category}
                        </label>
                        <input
                          type="range"
                          id={category}
                          min="0"
                          max="10"
                          value={hours[category] || 0}
                          className="range-slider"
                          onChange={(e) => handleHoursChange(category, e.target.value)}
                        />
                        <span className="range-value">{hours[category] || 0} hours</span>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            )}

{step === 5 && (
  <div className="item" id="content-5">
    <h2 className="tab-title tab-warning">Step 5: Addons</h2>
    <form>
      <div className="Optionss">
        {Object.keys(filteredAddonsByCategory).map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            {filteredAddonsByCategory[category]?.map((addon) => (
              <label
                key={addon._id}
                className={`relative cursor-pointer ${
                  selectedOptions.includes(addon.name) ? 'selected' : ''
                }`}
              >
                <input
                  type="checkbox"
                  name="options"
                  value={addon.name}
                  className="checkbox"
                  onChange={handleCheckboxChange}
                  checked={selectedOptions.includes(addon.name)}
                />
                <div
                  className="bg-img"
                  style={{
                    backgroundImage: addon.img
                      ? `url('${addon.img.url}')`
                      : 'none',
                    backgroundColor: '#f0f0f0',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '10px',
                    minHeight: '100px',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      padding: '5px',
                      borderRadius: '5px',
                    }}
                  >
                    {addon.name} - {addon.price}
                  </span>
                </div>
              </label>
            ))}
          </div>
        ))}
      </div>
    </form>
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

<div className="button-container">
            {step > 1 && (
              <button className="prev-button" onClick={() => setStep(step - 1)}>Previous</button>
            )}
            {step < 6 ? (
              <button className="next-button" onClick={handleNextStep}>Next</button>
            ) : (
              <button className="submit-button" onClick={handleSubmit}>Submit</button>
            )}
          </div>
      </div>
      </div>

      <div className="order-summary-2">
        <OrderSummary 
          selectedEvent={selectedEvent} 
          selectedCategories={selectedCategories} 
          hours={hours} 
        />
      </div>
    </div>
    </div>
  );
};


const OrderSummary = ({ selectedEvent, selectedCategories, hours }) => {
  const calculateTotal = () => {
    // You'll need to define prices for categories or fetch them from somewhere
    const categoryPrices = {
      'DJ': 100,
      'Videography': 150,
      'Cold Sparks': 80,
      'Photo Booth': 120,
    };

    return selectedCategories.reduce((total, category) => {
      return total + (categoryPrices[category] || 0) * (hours[category] || 0);
    }, 0);
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <p><strong>Event:</strong> {selectedEvent}</p>
      <p><strong>Categories:</strong> {selectedCategories.join(', ')}</p>
      <div className="services-prices">
        {selectedCategories.map(category => (
          <p key={category}>
            {category} for {hours[category] || 0} hours
          </p>
        ))}
      </div>
      <p><strong>Total:</strong> ${calculateTotal()}</p>
    </div>
  );
};

export default Calculator;