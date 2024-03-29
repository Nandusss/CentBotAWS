import React, { useState } from 'react';
import './chatButtonComponent.css';
import chatButtonIcon from '../assets/chatButtonIcon.png'; // Import the image

function ChatButtonComponent() {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <button onClick={handleButtonClick} className="chat-button">
                <img src={chatButtonIcon} alt="Chat Button" />
            </button>
            {isExpanded && (
                <div className="chat-box">
                    {/* chat box content*/}
                </div>
            )}
        </div>
    );
    
};

export default ChatButtonComponent;