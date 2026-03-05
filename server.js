const express = require("express");
const axios = require("axios");
const twilio = require("twilio");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const VoiceResponse = twilio.twiml.VoiceResponse;

/* -----------------------------
   ElevenLabs Voice Generator
------------------------------*/

async function generateVoice(text) {
  const response = await axios({
    method: "POST",
    url: "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
    headers: {
      "xi-api-key": process.env.ELEVEN_API_KEY,
      "Content-Type": "application/json"
    },
    data: {
      text: text,
      model_id: "eleven_multilingual_v2"
    },
    responseType: "arraybuffer"
  });

  return response.data;
}

/* -----------------------------
   Root Route
------------------------------*/

app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀");
});

/* -----------------------------
   Twilio Call Webhook
------------------------------*/

app.post("/voice", async (req, res) => {

  try {

    const message =
      "Namaste. Aqua Decor mein aapka swagat hai. Hum signage boards, acrylic letters, steel letters aur shop branding services provide karte hain. Kripya batayein aapko kis tarah ki service chahiye.";

    const audio = await generateVoice(message);

    res.set({
      "Content-Type": "audio/mpeg"
    });

    res.send(audio);

  } catch (error) {

    console.error(error);

    const twiml = new VoiceResponse();

    twiml.say(
      "Namaste. Aqua Decor mein aapka swagat hai. Kripya baad mein call karein."
    );

    res.type("text/xml");
    res.send(twiml.toString());

  }

});

/* -----------------------------
   Server Start
------------------------------*/

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("AI Call Server running on port " + PORT);
});