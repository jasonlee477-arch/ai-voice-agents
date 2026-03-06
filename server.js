const express = require("express")

const app = express()

app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 8080


// Home Route
app.get("/", (req, res) => {
  res.send("Aqua Decor AI Voice Agent Running 🚀")
})



// =========================
// Incoming Call Route
// =========================

app.post("/voice", (req, res) => {

const twiml = `
<Response>

<Say voice="alice">
Namaste. Welcome to Aqua Decor.
Please tell us what service you need.
For example shop board, acrylic letters, LED signage, or branding.
</Say>

<Gather
input="speech"
action="/gather"
method="POST"
speechTimeout="auto"
/>

</Response>
`

res.type("text/xml")
res.send(twiml)

})



// =========================
// Handle Customer Speech
// =========================

app.post("/gather", (req, res) => {

const speech = req.body.SpeechResult || "I did not hear anything"

console.log("Customer said:", speech)

const twiml = `
<Response>

<Say voice="alice">
You said: ${speech}.
Thank you for contacting Aqua Decor.
Our team will assist you shortly.
</Say>

</Response>
`

res.type("text/xml")
res.send(twiml)

})



// =========================
// Start Server
// =========================

app.listen(PORT, () => {
console.log("AI Call Server running on port", PORT)
})