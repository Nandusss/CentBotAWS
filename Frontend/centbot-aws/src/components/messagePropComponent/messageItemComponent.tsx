import { useState, useEffect, useRef } from 'react';
import { FcSpeaker } from "react-icons/fc";
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

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play(); // Play the audio when the button is clicked
        }
    };

    return (
        <div className={`message-item ${username}`}>
            <div id='profilepic'>{profilePic}</div>
            <p id='message'>{message}</p>
            {audioFile ? (
                <div>
                    <button onClick={playAudio}>
                        <FcSpeaker /> {/* Display the speaker icon */}
                    </button>
                    <audio ref={audioRef} id='audio'>
                        <source src={audioFile} type="audio/mpeg" />
                    </audio>
                </div>
            ) : null}
        </div>
    );
}

export default MessageItemComponent;