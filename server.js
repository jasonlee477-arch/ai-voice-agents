const express = require("express");
const axios = require("axios");
const twilio = require("twilio");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const VoiceResponse = twilio.twiml.VoiceResponse;

/* --------------------------------
   ElevenLabs Voice Generator
-------------------------------- */

async function generateVoice(text) {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      headers: {
        Authorization: `Bearer ${process.env.ELEVEN_API_KEY}`,
        "Content-Type": "application/json"
      },
      data: {
        text: text,
        model_id: "eleven_multilingual_v2"
      },
      responseType: "arraybuffer"
    });

    return response.data;
  } catch (error) {
    console.error("ElevenLabs Error:", error.response?.data || error.message);
    throw error;
  }
}

/* --------------------------------
   Health Check
-------------------------------- */

app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀");
});

/* --------------------------------
   Twilio Voice Webhook
-------------------------------- */

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

    console.log("Fallback to Twilio voice");

    const twiml = new VoiceResponse();

    twiml.say(
      "Namaste. Aqua Decor mein aapka swagat hai. Kripya baad mein call karein."
    );

    res.type("text/xml");
    res.send(twiml.toString());
  }
});

/* --------------------------------
   Server Start
-------------------------------- */

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("AI Call Server running on port " + PORT);
});