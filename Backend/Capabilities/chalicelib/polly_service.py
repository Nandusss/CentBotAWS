import boto3
import os

class PollyService:
    def __init__(self):
        self.client = boto3.client('polly')

    def create_audio(self, text, voice_id='Joanna', output_path='output.mp3'):
        try:
            response = self.client.synthesize_speech(
                Text=text,
                VoiceId=voice_id,
                OutputFormat='mp3'
            )

            # Save the audio file
            with open(output_path, 'wb') as f:
                f.write(response['AudioStream'].read())

            # Get the absolute path
            absolute_path = os.path.abspath(output_path)

            return absolute_path
        except Exception as e:
            return f'Error creating audio: {str(e)}'
