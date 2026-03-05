const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080

// ENV VARIABLES
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY

// WORKING VOICE
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

console.log("Eleven API Key Loaded:", ELEVEN_API_KEY ? "YES" : "NO")

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀")
})


// TWILIO CALL HANDLER
app.post("/voice", (req, res) => {

  const audioUrl = `${req.protocol}://${req.get("host")}/audio`

  const twiml = `
<Response>
  <Play>${audioUrl}</Play>
</Response>
`

  res.type("text/xml")
  res.send(twiml)
})



// AUDIO GENERATION ROUTE
app.get("/audio", async (req, res) => {

  try {

    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      data: {
        text: "Aqua Decor mein aapka swagat hai. Kripya bataye aapko kis tarah ki signage ya branding service chahiye.",
        model_id: "eleven_multilingual_v2"
      },
      responseType: "arraybuffer"
    })

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": response.data.length
    })

    res.send(response.data)

  } catch (err) {

    console.error(
      "ElevenLabs Error:",
      err.response?.data?.toString() || err.message
    )

    res.status(500).send("Voice generation failed")
  }
})



app.listen(PORT, () => {
  console.log("AI Call Server running on port", PORT)
})