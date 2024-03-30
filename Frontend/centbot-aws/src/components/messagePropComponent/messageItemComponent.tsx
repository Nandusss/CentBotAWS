import React, { useEffect, useState } from 'react';
import config from '../../config/globalconfig.json';
import './messageItemComponent.css';

interface MessageItemProps {
    username: string;
    profilePic: React.ReactNode;
    message: string;
    audioFileName: string;
}

// This component is used to display a message item
function MessageItemComponent(props: MessageItemProps) {
    const { username, message, profilePic, audioFileName } = props;
    const [audioFile, setAudioFile] = useState<string | null>(null);
    const url = `${config.backendUrl}:${config.backendPort}/${config.backendAudioPath}`;

    useEffect(() => {
        if (audioFileName !== '') {
            fetchAudioFile(audioFileName);
        }
    }, [audioFileName]);

    const fetchAudioFile = async (audioFileName: string) => {
        try {
            const response = await fetch(`${url}/${audioFileName}`);
            console.log(response);
            const audioData = await response.blob();
            const audioUrl = URL.createObjectURL(audioData);
            setAudioFile(audioUrl);
        } catch (error) {
            console.error('Error fetching audio file:', error);
        }
    };

    return (
        <div className={`message-item ${username}`}>
            <div id='profilepic'>{profilePic}</div>
            <p id='message'>{message}</p>
            {audioFile ? (
                <audio controls id='audio'>
                    <source src={audioFile} type="audio/mpeg" />
                </audio>
            ) : null}
        </div>
    );
}

export default MessageItemComponent;