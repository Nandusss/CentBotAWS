import React from 'react';
import './homePage.css';
import ChatButtonComponent from '../components/chatButtonComponent/chatButtonComponent';

function HomePage() {
  return (
    <div className="home">
      <header className="home-header">
        <div className='chat-button-area'>
            <ChatButtonComponent />
        </div>
      </header>
    </div>
  );
}

export default HomePage;