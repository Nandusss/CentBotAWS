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
 chalice local --no-autoreload
 ```

## Test backnned using api platform
 To test the endpoint use api platforms like [hopscotch](https://hoppscotch.io/), [insomnia](https://insomnia.rest/), [postman](https://www.postman.com/) or [CURL](https://curl.se/).

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
    "answer"        : "Bonjour ! Je suis CentBot, comment puis-je vous aider ?",
    "sourceLanguage": "en",
    "targetLanguage": "fr",
    "audioFileName" : "Celine_fr-FR_1711787452.mp3"
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

# Frontend
### How to run frontend in local host
 from the directory where the CentBotAWS is cloned open Frontend/CentbotAWS directory
 ```console
 cd CentBotAWS/Frontend/centbot-aws
 ```
 then install npm libraries
 ```console
 npm install
 ```

 then build the files
 ```console
 npm run build
 ```

 after that install serve (Optional if already installed)
 ```console
 npm install -g serve
 ```

 then serve the build
 ```console
 serve -s build
 ```

 This should run the server in localhost port 3000 by default
 ```
 http://127.0.0.1:3000/home
 ```

 open the link in your favorite browser


