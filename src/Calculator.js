import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calculator.css'; // Ensure this CSS file includes the required styles

const Calculator = () => {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState({}); // State to store hours for each selected service

  useEffect(() => {
    if (step >= 3 && step <= 5) {
      fetchData();
    }
  }, [step]);

  const fetchData = async () => {
    let collectionId;
    switch (step) {
      case 3:
        collectionId = '65fa009d15525496cb766012'; // Collection ID for step 3
        break;
      case 4:
        collectionId = '65fa009d15525496cb765dee'; // Collection ID for step 4
        break;
      case 5:
        collectionId = '65fa009d15525496cb765fa2'; // Collection ID for step 5
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/collection/${collectionId}/items`);
      setServices(response.data.items); // Assuming response.data.items contains the services
      console.log('Fetched services:', response.data.items); // Log services for debugging
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOptionChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'radio') {
      setSelectedEvent(value);
    } else if (type === 'checkbox') {
      setSelectedOptions(prevOptions => {
        if (checked) {
          return [...prevOptions, value];
        } else {
          return prevOptions.filter(option => option !== value);
        }
      });
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions(prevOptions => [...prevOptions, value]);
    } else {
      setSelectedOptions(prevOptions => prevOptions.filter(option => option !== value));
    }
  };

  const handleHoursChange = (serviceName, value) => {
    setHours(prevHours => ({
      ...prevHours,
      [serviceName]: value
    }));
  };

  const handleNextStep = () => {
    if (step === 1 && selectedEvent) {
      setStep(step + 1);
    } else if (step === 2 && selectedOptions.length > 0) {
      setStep(step + 1);
    } else if (step === 3 && selectedOptions.length > 0) {
      setStep(step + 1);
    } else if (step === 4) {
      setStep(step + 1);
    } else if (step === 5) {
      // Handle submission or final step logic here
      console.log('Form submitted');
    }
  };

  return (
    <div className="wrapper">
      <header className="header">
        <h3>Get A Quote</h3>
      </header>
      <div className="container">
        <div className="card tabs">
          {/* Radio inputs and labels for tabs */}
          <input id="tab-1" type="radio" className="tab tab-selector" checked={step === 1} readOnly />
          <label htmlFor="tab-1" className="tab tab-primary">Step 1</label>
          <input id="tab-2" type="radio" className="tab tab-selector" checked={step === 2} readOnly />
          <label htmlFor="tab-2" className="tab tab-success">Step 2</label>
          <input id="tab-3" type="radio" className="tab tab-selector" checked={step === 3} readOnly />
          <label htmlFor="tab-3" className="tab tab-default">Step 3</label>
          <input id="tab-4" type="radio" className="tab tab-selector" checked={step === 4} readOnly />
          <label htmlFor="tab-4" className="tab tab-warning">Step 4</label>
          <input id="tab-5" type="radio" className="tab tab-selector" checked={step === 5} readOnly />
          <label htmlFor="tab-5" className="tab tab-info">Step 5</label>
          <input id="tab-6" type="radio" className="tab tab-selector" checked={step === 6} readOnly />
          <label htmlFor="tab-6" className="tab tab-danger">Step 6</label>
          <div className="tabsShadow"></div>
          <section className="content">
            {step === 1 && (
         <div className="item" id="content-1">
         <h2 className="tab-title tab-primary">SELECT EVENT</h2>
         <form>
           <div className="Optionss">
             {/* Radio options */}
             <label className={`relative cursor-pointer ${selectedEvent === 'private' ? 'selected' : ''}`}>
               <input
                 type="radio"
                 name="event"
                 value="private"
                 className="sr-only"
                 onChange={() => setSelectedEvent('private')}
                 checked={selectedEvent === 'private'}
               />
               <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/6211045313b534ff692f9e8e_Wedding-Photo-Booth-Portland-Props.webp')" }}>
                 <span>Private Event</span>
               </div>
             </label>
             <label className={`relative cursor-pointer ${selectedEvent === 'corporate' ? 'selected' : ''}`}>
               <input
                 type="radio"
                 name="event"
                 value="corporate"
                 className="sr-only"
                 onChange={() => setSelectedEvent('corporate')}
                 checked={selectedEvent === 'corporate'}
               />
               <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/65cb841d3cacbe6a063cc4d7_corporate.webp')" }}>
                 <span>Corporate DJ</span>
               </div>
             </label>
             <label className={`relative cursor-pointer ${selectedEvent === 'school' ? 'selected' : ''}`}>
               <input
                 type="radio"
                 name="event"
                 value="school"
                 className="sr-only"
                 onChange={() => setSelectedEvent('school')}
                 checked={selectedEvent === 'school'}
               />
               <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/657025526f50e4b444c18d85_SeestWedding-0544.webp')" }}>
                 <span>School</span>
               </div>
             </label>
             <label className={`relative cursor-pointer ${selectedEvent === 'weddings' ? 'selected' : ''}`}>
               <input
                 type="radio"
                 name="event"
                 value="weddings"
                 className="sr-only"
                 onChange={() => setSelectedEvent('weddings')}
                 checked={selectedEvent === 'weddings'}
               />
               <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/62125d010ba94d55646501ec_Portland-Wedding-Cold-spark-exit-2.webp')" }}>
                 <span>Weddings</span>
               </div>
             </label>
           </div>
           <div className="next-button">
  <button type="button" onClick={handleNextStep} disabled={!selectedEvent}>
    Next
  </button>
</div>
         </form>
       </div>
     )}
      {step === 2 && (
        <div className="item" id="content-2">
          <h2 className="tab-title tab-success">Select Categories</h2>
          <form>
            <div className="Optionss">
              {/* Checkbox options */}
              <label className={`relative cursor-pointer ${selectedOptions.includes('DJ') ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="options"
                  value="DJ"
                  className="checkbox"
                  onChange={handleOptionChange}
                  checked={selectedOptions.includes('DJ')}
                />
                <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/6211045313b534ff692f9e8e_Wedding-Photo-Booth-Portland-Props.webp')" }}>
                  <span>DJ</span>
                </div>
              </label>
              <label className={`relative cursor-pointer ${selectedOptions.includes('Videography') ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="options"
                  value="Videography"
                  className="checkbox"
                  onChange={handleOptionChange}
                  checked={selectedOptions.includes('Videography')}
                />
                <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/65cb841d3cacbe6a063cc4d7_corporate.webp')" }}>
                  <span>Videography</span>
                </div>
              </label>
              <label className={`relative cursor-pointer ${selectedOptions.includes('Cold Sparks') ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="options"
                  value="Cold Sparks"
                  className="checkbox"
                  onChange={handleOptionChange}
                  checked={selectedOptions.includes('Cold Sparks')}
                />
                <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/657025526f50e4b444c18d85_SeestWedding-0544.webp')" }}>
                  <span>Cold Sparks</span>
                </div>
              </label>
              <label className={`relative cursor-pointer ${selectedOptions.includes('Photo Booth') ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="options"
                  value="Photo Booth"
                  className="checkbox"
                  onChange={handleOptionChange}
                  checked={selectedOptions.includes('Photo Booth')}
                />
                <div className="bg-img" style={{ backgroundImage: "url('https://cdn.prod.website-files.com/61f1b0184f2921511f5cff9a/62125d010ba94d55646501ec_Portland-Wedding-Cold-spark-exit-2.webp')" }}>
                  <span>Photo Booth</span>
                </div>
              </label>
            </div>
            <div className="next-button">
              <button type="button" onClick={handleNextStep} disabled={selectedOptions.length === 0}>
                Next
              </button>
            </div>
          </form>
        </div>
      )}

{step === 3 && (
                 <div className="item" id="content-3">
                 <h2 className="tab-title tab-default">Step 3: Select Services</h2>
                 <form>
                   <div className="Optionss">
                   {services.map(service => (
  <label key={service._id} className={`relative cursor-pointer ${selectedOptions.includes(service.name) ? 'selected' : ''}`}>
    <input
      type="checkbox"
      name="options"
      value={service.name}
      className="checkbox"
      onChange={handleCheckboxChange}
      checked={selectedOptions.includes(service.name)}
    />
    <div className="bg-img" style={{ backgroundImage: service.img ? `url('${service.img.url}')` : 'none' }}>
      <span>{service.name} - ${service.price}</span>
    </div>
  </label>
))}

                   </div>
                   <div className="next-button-container">
                     <button
                       type="button"
                       className="next-button btn"
                       onClick={handleNextStep}
                       disabled={selectedOptions.length === 0}
                     >
                       Next<span className="icon-right"></span>
                       <span className="icon-right after"></span>
                     </button>
                   </div>
                 </form>
               </div>
             )}
           {step === 4 && (
  <div className="item" id="content-4">
    <h2 className="tab-title tab-warning">Step 4: Confirm Your Details</h2>
    <form>
      <div className="Optionss">
        {services.map(service => (
          <label key={service._id} className={`relative cursor-pointer ${selectedOptions.includes(service.name) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              name="options"
              value={service.name}
              className="checkbox"
              onChange={handleCheckboxChange}
              checked={selectedOptions.includes(service.name)}
            />
            <div className="bg-img" style={{ backgroundImage: service.img ? `url('${service.img.url}')` : 'none' }}>
              <span>{service.name} - ${service.price}</span>
            </div>
          </label>
        ))}
      </div>
      <div className="next-button-container">
        <button
          type="button"
          className="next-button btn"
          onClick={handleNextStep}
          disabled={selectedOptions.length === 0}
        >
          Next<span className="icon-right"></span>
          <span className="icon-right after"></span>
        </button>
      </div>
    </form>
  </div>
)}

{step === 5 && (
           <div className="itemm" id="content-5">
           <h2 className="tab-title tab-info">Step 5: Set Hours for Selected Services</h2>
           <form>
             <div className="hours-selection">
               <h3>Select Hours for Each Service:</h3>
               {selectedOptions.map(option => {
                 const service = services.find(service => service.name === option);
                 return (
                   <div key={option} className="service-hours">
                     <label>{service.name}</label>
                     <input
                       type="range"
                       min="0"
                       max="10"
                       value={hours[service.name] || 0}
                       onChange={(e) => handleHoursChange(service.name, e.target.value)}
                       className="range-slider"
                     />
                     <span>{hours[service.name] || 0} hours</span>
                   </div>
                 );
               })}
             </div>
             <div className="next-button-container">
               <button
                 type="button"
                 className="next-button btn"
                 onClick={handleNextStep}
               >
                 Submit<span className="icon-right"></span>
                 <span className="icon-right after"></span>
               </button>
             </div>
           </form>
         </div>
       )}

     </section>
     <OrderSummary selectedEvent={selectedEvent} selectedOptions={selectedOptions} services={services} hours={hours} />
   </div>
 </div>
</div>
);
};

const OrderSummary = ({ selectedEvent, selectedOptions, services, hours }) => {
const calculateTotal = () => {
return selectedOptions.reduce((total, option) => {
 const service = services.find(service => service.name === option);
 return total + (service ? parseFloat(service['base-price']) * (hours[service.name] || 0) : 0);
}, 0);
};

return (
<div className="order-summary">
 <h2>Order Summary</h2>
 <p><strong>Event:</strong> {selectedEvent}</p>
 <p><strong>Services:</strong> {selectedOptions.join(', ')}</p>
 <div className="services-prices">
   {selectedOptions.map(option => {
     const service = services.find(service => service.name === option);
     return service ? (
       <p key={option}>
         {service.name} at ${service.price} for {hours[service.name] || 0} hours
       </p>
     ) : null;
   })}
 </div>
 <p><strong>Total:</strong> ${calculateTotal()}</p>
</div>
);
};

export default Calculator;