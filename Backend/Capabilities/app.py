from chalice import Chalice
from chalicelib import storage_service
from chalicelib import s3_readfile_service
from chalicelib import translation_service
from chalicelib import polly_service

import base64
import json


#####
# chalice app configuration
#####
app = Chalice(app_name='Capabilities')
app.debug = True

#####
# services initialization
#####
storage_location = 'contentcen301166925.aws.ai'
storage_service = storage_service.StorageService(storage_location)
s3_readfile_service = s3_readfile_service.S3ReadFileService(storage_service)
translation_service = translation_service.TranslationService()
polly_service = polly_service.PollyService()


#####
# RESTful endpoints
#####
@app.route('/files', methods = ['POST'], cors = True)
def upload_files():
    """processes file upload and saves file to storage service"""
    request_data = json.loads(app.current_request.raw_body)
    file_name = request_data['filename']
    file_bytes = base64.b64decode(request_data['filebytes'])

    file_info = storage_service.upload_file(file_bytes, file_name)

    return file_info


@app.route('/files/{file_id}/translate-text', methods = ['POST'], cors = True)
def translate_file_text(file_id):
    """detects then translates text in the specified file"""
    request_data = json.loads(app.current_request.raw_body)
    from_lang = request_data['fromLang']
    to_lang = request_data['toLang']

    MIN_CONFIDENCE = 80.0

    text_lines = s3_readfile_service.detect_text(file_id)

    translated_lines = []
    # print(text_lines)
    for line in text_lines:
        translated_line = translation_service.translate_text(line, from_lang, to_lang)
        translated_lines.append({
            'text': line,
            'translation': translated_line,
        })
            
        # Generate audio for the translated text
        translated_text = " ".join([line['translation']['translatedText'] for line in translated_lines])
        audio_path = polly_service.create_audio(translated_text)

        print(translated_lines)
        print(audio_path)

    return {'translatedLines': translated_lines, 'audioPath': audio_path}


if __name__ == '__main__':
    app.debug = True
    app.run()


