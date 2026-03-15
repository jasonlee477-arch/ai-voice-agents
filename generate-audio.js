const axios = require("axios")
const fs = require("fs")

const API_KEY = "YOUR_ELEVEN_API_KEY"
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

async function generate() {

const response = await axios.post(
`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
{
text: "Namaste. Welcome to Aqua Decor. Please tell us what service you need.",
model_id: "eleven_flash_v2"
},
{
headers:{
"xi-api-key":API_KEY,
"Content-Type":"application/json"
},
responseType:"arraybuffer"
}
)

fs.writeFileSync("greeting.mp3", response.data)

console.log("Audio created!")

}

generate()