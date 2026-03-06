const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY

// working voice
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

console.log("Eleven API Key Loaded:", ELEVEN_API_KEY ? "YES" : "NO")

app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀")
})


// =======================
// Twilio Call Start
// =======================

app.post("/voice", (req, res) => {

  const audioUrl = `${req.protocol}://${req.get("host")}/audio`

  const twiml = `
<Response>

  <Play>${audioUrl}</Play>

  <Gather input="speech" action="/gather" method="POST" speechTimeout="auto">
    <Say>Please tell us what service you need.</Say>
  </Gather>

</Response>
`

  res.type("text/xml")
  res.send(twiml)

})


// =======================
// Generate Greeting Audio
// =======================

app.get("/audio", async (req, res) => {

  try {

    const elevenResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: "Aqua Decor mein aapka swagat hai. Kripya bataye aapko kis tarah ki signage ya branding service chahiye.",
        model_id: "eleven_flash_v2"
      },
      {
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        responseType: "arraybuffer"
      }
    )

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": elevenResponse.data.length
    })

    res.send(elevenResponse.data)

  } catch (err) {

    if (err.response?.data) {
      console.error("ElevenLabs Error:", err.response.data.toString())
    } else {
      console.error("Server Error:", err.message)
    }

    res.status(500).send("Voice generation failed")
  }

})


// =======================
// Handle Caller Speech
// =======================

app.post("/gather", (req, res) => {

  const userSpeech = req.body.SpeechResult || "I did not hear anything."

  console.log("Customer said:", userSpeech)

  const twiml = `
<Response>
  <Say>You said: ${userSpeech}. Thank you for contacting Aqua Decor. Our team will assist you shortly.</Say>
</Response>
`

  res.type("text/xml")
  res.send(twiml)

})


// =======================
// Start Server
// =======================

app.listen(PORT, () => {
  console.log("AI Call Server running on port", PORT)
})