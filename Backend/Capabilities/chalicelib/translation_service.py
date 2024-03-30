import boto3
from botocore.exceptions import ClientError

class TranslationService:
    def __init__(self):
        self.client = boto3.client('translate')

    def translate_text(self, text, source_language='auto', target_language='en'):
        try:
            response = self.client.translate_text(
                Text=text,
                SourceLanguageCode=source_language,
                TargetLanguageCode=target_language
            )

            translation = {
                'answer': response['TranslatedText'],
                'sourceLanguage': response['SourceLanguageCode'],
                'targetLanguage': response['TargetLanguageCode']
            }

        except ClientError as e:
            if e.response['Error']['Code'] == 'UnsupportedLanguagePair':
                print(f"Language not supported: {e}")
            else:
                print(f"Service exception: {e}")
        except Exception as e:
            print(f"Exception: {e}")

        return translation