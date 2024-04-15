import os
from chalice import Chalice, Response
from chalicelib import translation_service
from chalicelib import polly_service
from chalicelib.CentbotModel import chatbotCent_processing



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

BASEPATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audios')

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
    try:
        request_data = json.loads(app.current_request.raw_body)
        if app.current_request.method == 'POST':
            the_question = request_data.get('question', "")
            sourceLanguage = request_data.get('sourceLanguage', 'en')
            targetLanguage = request_data.get('targetLanguage', 'en')
            audio_needed = request_data.get('audioNeeded', False)

            # Check if the source language is not English or target language is supported as per the language code
            if sourceLanguage != 'en' or targetLanguage not in language_code:
                return Response(
                    body={"error": "Unsupported language pair"},
                    status_code=400,
                    headers={'Content-Type': 'application/json'}
                )
            else:
                # check if the question is empty
                if the_question == "":
                    return Response(
                        body={"error": "Empty question"},
                        status_code=400,
                        headers={'Content-Type': 'application/json'}
                    )
                else:
                    response_from_bot = chatbotCent_processing.chatbot_response(the_question)

                    # Translate the response to the specified language
                    if targetLanguage != 'en':
                        response = translation_service.translate_text(text=response_from_bot, target_language=targetLanguage)
                    else:
                        response = {"answer": response_from_bot, "sourceLanguage": 'en', "targetLanguage": 'en'}

                    # Generate audio for the translated text
                    if audio_needed:
                        audio_file_name = polly_service.create_audio(text=response.get("answer"), voice_id=language_voice(targetLanguage), language_code=equivalent_language_code(targetLanguage), output_path=BASEPATH)
                        response['audioFileName'] = audio_file_name
                    
                    # Add the audio file name to the response defaulting to empty string
                    response['audioFileName'] = response.get('audioFileName', "")

                    return response
    except Exception as e:
        return Response(
            body={"error": str(e)},
            status_code=500,
            headers={'Content-Type': 'application/json'}
        )
    
# Endpoint to get the audio file blob
@app.route('/chat/audio/{filename}', methods=['GET'], cors=True)
def getAudioFileBlob(filename):
    try:
        if app.current_request.method == 'GET':
            # Check if the path is empty
            if filename == '':
                return Response(
                    body={"error": "no path provided"},
                    status_code=400,
                    headers={'Content-Type': 'application/json'}
                )
            else:
                filepath = os.path.join(BASEPATH, filename)
                # check if the path is valid
                if not os.path.exists(filepath):
                    return Response(
                        body={"error": "invalid path"},
                        status_code=400,
                        headers={'Content-Type': 'application/json'}
                    )
                else:
                    # return the file
                    with open(filepath, 'rb') as file:
                        file_content = file.read()
                        return Response(
                            body=file_content,
                            status_code=200,
                            headers={'Content-Type': 'application/octet-stream'}
                        )
    except Exception as e:
        return Response(
            body={"error": str(e)},
            status_code=500,
            headers={'Content-Type': 'application/json'}
        )


if __name__ == '__main__':
    app.debug = True
    app.run()