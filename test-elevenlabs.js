const axios = require("axios")
const fs = require("fs")

const API_KEY = "sk_1c17fdc7a3b80a60c9930d1548b19ae53c89e9bdf6993cdd"

async function testVoice() {

  try {

    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        text: "Hello Deepak. Your AI voice agent is now working.",
        model_id: "eleven_flash_v2"
      },
      {
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        
      }
    )

    fs.writeFileSync("voice-test.mp3", response.data)

    console.log("Voice generated successfully!")

  } catch (error) {

    console.error(error.response?.data || error.message)

  }

}

testVoice()