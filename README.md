# CentBotAWS
 NLP chat bot for Centennial College with AWS service integration

# Backend
##  How to run server in localhost:
 from the directory where the CentBotAWS is cloned open the pipenv shell
 ```console
 cd CentBotAWS/Backend
 ```
 ```console
 pipenv shell
 ```
 In the newly opened shell install necessary dependencies
 ```console
 pipenv install
 ```
 after that go to Capabilies folder and run chalice local
 ```console
 cd Capabilities/
 ```
 ```console
 chalice local
 ```

## Test backnned using api platform
 To test the endpoint you can use api platforms like [hopscotch](https://hoppscotch.io/), [insomnia](https://insomnia.rest/) or [postman](https://www.postman.com/).

 Using one of those api platform sent the json as body of the post request to localhost server. Most of the time it would be hosted at http://127.0.0.1:8000/ and the route is /chat/centbot.

 TLDR: Sent the **POST** request request to
 ```
 http://127.0.0.1:8000/chat/centbot
 ```

 with body having
 ```json
 {
    "question"      : "Hello",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "audioNeeded"   : true
 }
 ```

 and a response as following should be received
 ```json
 {
    "text"          : "Bonjour ! Je suis CentBot, comment puis-je vous aider ?",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "audioPath"     : "/home/nandu/CentBotAWS/Backend/Capabilities/output.mp3"
 }
 ```

 this suggests the translation worked and audio file is generated in the specified audio path. If you don't want audio then set audioNeeded as `false`.

 ### NB
  sourceLanguage should always be `en`
  
  targetLanguage should be in the following list
  
  ```json
{
 "supportedTargetLanguageList": [
         "en",
         "es",
         "fr",
         "de",
         "it",
         "pt",
         "nl",
         "ru",
         "ja",
         "ko",
         "zh",
         "ar",
         "hi",
         "tr"
      ]
}
  ```


  text cannot be empty

