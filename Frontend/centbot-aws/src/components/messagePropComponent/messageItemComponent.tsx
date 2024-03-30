import React, { useState } from 'react';
import './messageItemComponent.css';

interface MessageItemProps {
    username: string;
    profilePic: React.ReactNode;
    message: string;
}

function MessageItemComponent(props: MessageItemProps) {
    const { username, message, profilePic } = props;

    return (
        <div className={`message-item ${username}`}>
            <div id='profilepic'>{profilePic}</div>
            <p id='message'>{message}</p>
        </div>
    );
}

export default MessageItemComponent;