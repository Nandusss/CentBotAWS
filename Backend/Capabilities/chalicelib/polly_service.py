import boto3
import os
import time

class PollyService:
    BASEPATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audios')
    def __init__(self):
        self.client = boto3.client('polly')

    def create_audio(self, text, voice_id='Joanna', language_code='en-US', output_path=BASEPATH):
        try:
            response = self.client.synthesize_speech(
                Text=text,
                VoiceId=voice_id,
                LanguageCode=language_code,
                OutputFormat='mp3'
            )

            current_time = str(int(time.time()))
            fileName = f'{voice_id}_{language_code}_{current_time}.mp3'

            # Create the directory if it doesn't exist
            os.makedirs(output_path, exist_ok=True)

            # Save the audio file
            output_path = os.path.join(output_path, fileName)
            with open(output_path, 'wb') as f:
                f.write(response['AudioStream'].read())

            return fileName
        except Exception as e:
            return f'Error creating audio: {str(e)}'