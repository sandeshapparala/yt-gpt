import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = sdk.SpeechConfig.fromSubscription("YourSubscriptionKey", "YourRegion");
speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // You can choose different voices

export const synthesizeSpeech = (text) => {
  return new Promise((resolve, reject) => {
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(result);
        } else {
          reject(result.errorDetails);
        }
        synthesizer.close();
      },
      error => {
        reject(error);
        synthesizer.close();
      }
    );
  });
};