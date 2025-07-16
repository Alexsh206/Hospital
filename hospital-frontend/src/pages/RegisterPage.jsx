import React, { useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import * as api             from '../api/api'
import './EditAdd.css'
import {useAuth} from "../auth/AuthProvider.jsx";

export default function RegisterPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]   = useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    sex: '',
    dateOfBirth: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await api.addPatient(form);
      navigate(`/dashboard/patient/${form.phone}`, { replace: true })
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Помилка при додаванні пацієнта');
    }
  };

  return (
      <div className="page-container">
        <div className="patient-form-card">
          <h2>Реєстрація:</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Ваше прізвище:</label>
              <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="field">
              <label>Ваше ім’я:</label>
              <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="field">
              <label>По батькові:</label>
              <input
                  name="patronymic"
                  value={form.patronymic}
                  onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Стать:</label>
              <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  required
              >
                <option value="">– оберіть стать –</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>

            <div className="field">
              <label>Дата народження:</label>
              <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="field">
              <label>Телефон:</label>
              <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="field">
              <label>Пароль:</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required/>
            </div>

            <button type="submit" className="btn btn-primary">
              Додати
            </button>
          </form>
        </div>
      </div>
  );
}
