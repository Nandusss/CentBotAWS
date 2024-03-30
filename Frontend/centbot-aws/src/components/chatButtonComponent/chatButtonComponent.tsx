import React, { useState } from 'react';
import './chatButtonComponent.css';
import chatButtonIcon from '../../assets/chatButtonIcon.png';
import config from '../../config/globalconfig.json';
import MessageItemComponent from '../messagePropComponent/messageItemComponent';
import botIcon from '../../assets/chatButtonIcon.png';
import userIcon from '../../assets/userIcon.png';

// This component is used to display the chat button and chat box
function ChatButtonComponent() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([
        { username: 'CentBotAWS', profilePic: <img src={botIcon} alt="CentBotAWS" />, message: 'Hi, how can I help you?' },
    ]);
    const url = config.backendChatPath;

    // This function is used to handle the button click
    const handleButtonClick = () => {
        setIsExpanded(!isExpanded);
    };

    // This function is used to handle the input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    // This function is used to handle the form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newMessages = [...messages, { username: 'Me', profilePic: <img src={userIcon} alt="Me" />, message: question }];
        
        setMessages(newMessages);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();
        setMessages([...newMessages, { username: 'CentBotAWS', profilePic: <img src={botIcon} alt="CentBotAWS" />, message: data.text }]);
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
                        {messages.map((message, index) => (
                            <MessageItemComponent
                                key={index}
                                username={message.username}
                                profilePic={message.profilePic}
                                message={message.message}
                            />
                        ))}
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