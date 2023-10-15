import React, { Component } from 'react';
import '../styles/Register.css'; 

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      confirmPassword: '',
      pinCode: '',
      city: localStorage.getItem('city') || '',
      state: localStorage.getItem('state') || '',
      errors: {},
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ errors: { confirmPassword: 'Passwords do not match' } });
      return;
    }

    this.setState({ errors: {} });

    const { pinCode } = this.state;
    const apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'; // Replace with your actual API key
    const addressApi = `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=${apiKey}&format=json&filters[pincode]=${pinCode}`;

    try {
      const response = await fetch(addressApi);
      const data = await response.json();

      if (data.records && data.records.length > 0) {
        const { district, state } = data.records[0];
        this.setState({ city: district, state: state });

        localStorage.setItem('city', district);
        localStorage.setItem('state', state);
      } else {
        this.setState({ errors: { pinCode: 'Invalid pin code' }});

        localStorage.removeItem('city');
        localStorage.removeItem('state');
      }
    } 
    catch (error) {
      console.error('Error fetching address data:', error);
      this.setState({ errors: { pinCode: 'Error fetching address data' }});

      localStorage.removeItem('city');
      localStorage.removeItem('state');
    }
  };

  render() {
    return (
      <div className='register-container'>
        <h2>Registration</h2>
        <form className="register-form" onSubmit={this.handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleInputChange}
            />
            {this.state.errors.confirmPassword && (
              <p>{this.state.errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <label>Pin Code:</label>
            <input
              type="text"
              name="pinCode"
              value={this.state.pinCode}
              onChange={this.handleInputChange}
            />
            {this.state.errors.pinCode && <p>{this.state.errors.pinCode}</p>}
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={this.state.city}
              readOnly
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
{/* <div>
<label>State:</label>
<input
  type="text"
  name="state"
  value={this.state.state}
  readOnly
/>
</div> */}