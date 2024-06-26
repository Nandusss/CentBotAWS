import React, { useState } from 'react';
import Switch from "react-switch";
import './chatButtonComponent.css';
import chatButtonIcon from '../../assets/chatButtonIcon.png';
import config from '../../config/globalconfig.json';
import MessageItemComponent from '../messagePropComponent/messageItemComponent';
import botIcon from '../../assets/chatButtonIcon.png';
import userIcon from '../../assets/userIcon.png';
import audioNeededIcon from '../../assets/audioNeededIcon.png';
import audioIcon from '../../assets/audioIcon.webp';

// This component is used to display the chat button and chat box
function ChatButtonComponent() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [question, setQuestion] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('en');
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [audioNeeded, setAudioNeeded] = useState(false);
    const [messages, setMessages] = useState([
        { username: 'CentBotAWS', profilePic: <img src={botIcon} alt="CentBotAWS" />, message: 'Hi, how can I help you?', audioFileName: ''},
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

    // This function is used to handle the language select dropdown change
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetLanguage(event.target.value);
    };

    // This function is used to handle the audio switch change
    const handleAudioChange = (checked: boolean) => {
        setAudioNeeded(checked);
    };

    // This function is used to handle the form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newMessages = [...messages, { username: 'Me', profilePic: <img src={userIcon} alt="Me" />, message: question, audioFileName: ''}];
        
        setMessages(newMessages);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question, sourceLanguage: sourceLanguage, targetLanguage: targetLanguage, audioNeeded: audioNeeded}),
        }).then(async (response) => {
            if(response.status !== 200) {
                throw new Error('Failed to fetch the data');
            }
            const data = await response.json();
            setMessages([...newMessages, { username: 'CentBotAWS', profilePic: <img src={botIcon} alt="CentBotAWS" />, message: data.answer, audioFileName: data.audioFileName}]);
            setQuestion('');
        }).catch((error) => {
            setMessages([...newMessages, { username: 'CentBotAWS', profilePic: <img src={botIcon} alt="CentBotAWS" />, message: 'Something went wrong! please try again with a different message!!', audioFileName: ''}]);
            setQuestion('');
        });
    };
    

    return (
        <div>
            <button onClick={handleButtonClick} className="chat-button">
                <img src={chatButtonIcon} alt="Chat Button" />
            </button>
            {isExpanded && (
                <div className="chat-box">
                    <div className='chatbox-title-area'>
                        CentChat
                        <div className='audio-switch-area'>
                            <img src={audioNeededIcon} alt="Audio Icon" id='audioLabelIcon'></img>
                            <Switch 
                                onChange={handleAudioChange} 
                                checked={audioNeeded}
                                id = 'audio-switch'
                            />
                        </div>
                    <button onClick={() => setIsExpanded(false)} className="close-button">X</button>
                    </div>

                    {/* This is the chat message area */}
                    <div className='chatbox-message-area'>
                        {messages.map((message, index) => (
                            <MessageItemComponent
                                key={index}
                                username={message.username}
                                profilePic={message.profilePic}
                                message={message.message}
                                audioFileName={message.audioFileName}
                            />
                        ))}
                    </div>
                    
                    {/* This is the form for the chat input */}
                    <form onSubmit={handleSubmit} className='chat-form'>
                        {/* This is the language select dropdown */}
                        <select
                            value={targetLanguage}
                            onChange={handleLanguageChange}
                            id='language-select'
                        >
                            {config.supportedTargetLanguageList.map((language, index) => (
                                <option key={index} value={language}>{language}</option>
                            ))}
                        </select>

                        {/* This is the chat input */}
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