import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Лікарня №1</h1>
                <p>Ласкаво просимо до нашої лікарні. Будь ласка, увійдіть або зареєструйтесь, щоб продовжити.</p>
                <div className="home-actions">
                    <Link to="/login" className="btn btn-primary">Увійти</Link>
                    <Link to="/register" className="btn btn-secondary">Реєстрація</Link>
                </div>
            </header>
            <section className="home-info">
                <h2>Про нас</h2>
                <p>Наша лікарня надає якісні медичні послуги цілодобово.</p>
            </section>
        </div>
    );
}


