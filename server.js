const express = require("express");
const axios = require("axios");
const twilio = require("twilio");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const VoiceResponse = twilio.twiml.VoiceResponse;

/* --------------------------
   Root Check
-------------------------- */

app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀");
});

/* --------------------------
   ElevenLabs Audio Endpoint
-------------------------- */

app.get("/audio", async (req, res) => {

  try {

    const message =
      "Namaste. Aqua Decor mein aapka swagat hai. Hum signage boards, acrylic letters, steel letters aur shop branding services provide karte hain. Kripya batayein aapko kis tarah ki service chahiye.";

    const response = await axios({
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY,
        "Content-Type": "application/json"
      },
      data: {
        text: message,
        model_id: "eleven_multilingual_v2"
      },
      responseType: "arraybuffer"
    });

    res.set({
      "Content-Type": "audio/mpeg"
    });

    res.send(response.data);

  } catch (error) {

    console.log("ElevenLabs error:", error.response?.data || error.message);

    res.status(500).send("Voice generation failed");
  }
});

/* --------------------------
   Twilio Voice Webhook
-------------------------- */

app.post("/voice", (req, res) => {

  const twiml = new VoiceResponse();

  const audioUrl = `${process.env.RAILWAY_PUBLIC_DOMAIN}/audio`;

  twiml.play(audioUrl);

  res.type("text/xml");
  res.send(twiml.toString());
});

/* --------------------------
   Start Server
-------------------------- */

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("AI Call Server running on port " + PORT);
});