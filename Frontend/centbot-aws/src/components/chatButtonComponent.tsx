import React, { useState } from 'react';
import './chatButtonComponent.css';
import chatButtonIcon from '../assets/chatButtonIcon.png';
import config from '../config/globalconfig.json';

function ChatButtonComponent() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [question, setQuestion] = useState('');
    const url = config.backendChatPath;

    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });
        setQuestion('');
    };

    return (
        <div>
            <button onClick={handleButtonClick} className="chat-button">
                <img src={chatButtonIcon} alt="Chat Button" />
            </button>
            {isExpanded && (
                <div className="chat-box">
                    <div className='chatbox-title-area'>
                        CentBotAWS
                    <button onClick={() => setIsExpanded(false)} className="close-button">X</button>
                    </div>

                    <div className='chatbox-message-area'>
                        
                    </div>
                    
                    <form onSubmit={handleSubmit} className='chat-form'>
                        <input
                            type="text"
                            value={question}
                            onChange={handleInputChange}
                            placeholder="Type your question here..."
                            id='chat-input'
                        />
                        <button type="submit" id='send-button'>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChatButtonComponent;