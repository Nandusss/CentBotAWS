from chalice import Chalice
from chalicelib import translation_service
from chalicelib import polly_service
from chalicelib.CentbotModel import chatbotCent_processing


import base64
import json
import logging
import json


#####
# chalice app configuration
#####
app = Chalice(app_name='Capabilities')
app.debug = True

#####
# services initialization
#####
translation_service = translation_service.TranslationService()
polly_service = polly_service.PollyService()

##### Helper functions for the services #####
language_code = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'pt': 'pt-BR',
        'nl': 'nl-NL',
        'ru': 'ru-RU',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'cmn-CN',
        'ar': 'arb',
        'hi': 'hi-IN',
        'tr': 'tr-TR',
    }

def equivalent_language_code(language):
    """returns the equivalent language code used in polly for the specified language"""
    return language_code.get(language, 'en-US')


def language_voice(language):
    """returns the voice id for the specified language"""
    voice_id = {
        'en': 'Joanna',
        'es': 'Conchita',
        'fr': 'Celine',
        'de': 'Vicki',
        'it': 'Carla',
        'pt': 'Vitoria',
        'nl': 'Lotte',
        'ru': 'Tatyana',
        'ja': 'Mizuki',
        'ko': 'Seoyeon',
        'zh': 'Zhiyu',
        'ar': 'Zeina',
        'hi': 'Aditi',
        'tr': 'Filiz',
    }

    return voice_id.get(language, 'Joanna')

#############################################


#####
# RESTful endpoints
#####

# Endpoint to get the text response from the CentBot
@app.route('/chat/centbot', methods=['POST'], cors=True)
def chatbotResponse():
    request_data = json.loads(app.current_request.raw_body)
    if app.current_request.method == 'POST':
        the_question = request_data.get('question', "")
        sourceLanguage = request_data.get('sourceLanguage', 'en')
        targetLanguage = request_data.get('targetLanguage', 'en')
        audio_needed = request_data.get('audioNeeded', False)

        # Check if the source language is not English or target language is supported as per the language code
        if sourceLanguage != 'en' or targetLanguage not in language_code:
            return {"error": "Unsupported language pair"}
        else:
            # check if the question is empty
            if the_question == "":
                return {"error": "Empty question"}
            else:
                response_from_bot = chatbotCent_processing.chatbot_response(the_question)

                # Translate the response to the specified language
                if targetLanguage != 'en':
                    response = translation_service.translate_text(text=response_from_bot, target_language=targetLanguage)
                else:
                    response = {"answer": response_from_bot, "sourceLanguage": 'en', "targetLanguage": 'en'}

                # Generate audio for the translated text
                if audio_needed:
                    audio_path = polly_service.create_audio(text=response.get("answer"), voice_id=language_voice(targetLanguage), language_code=equivalent_language_code(targetLanguage))
                    response['audioPath'] = audio_path

                return response


if __name__ == '__main__':
    app.debug = True
    app.run()