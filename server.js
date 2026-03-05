const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀")
})

app.post("/voice", (req, res) => {

  const twiml = `
<Response>
    <Play>https://ai-voice-agents-production.up.railway.app/audio</Play>
</Response>
`

  res.type("text/xml")
  res.send(twiml)
})

app.get("/audio", async (req, res) => {

  try {

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: "Aqua Decor mein aapka swagat hai. Kripya bataye aapko kis tarah ki signage ya branding service chahiye.",
        model_id: "eleven_multilingual_v2"
      },
      {
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    )

    res.set({
      "Content-Type": "audio/mpeg"
    })

    res.send(response.data)

  } catch (err) {

    console.log("ElevenLabs Error:", err.response?.data || err.message)

    res.status(500).send("Voice generation failed")
  }

})

app.listen(PORT, () => {
  console.log("AI Call Server running on port", PORT)
})