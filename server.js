const express = require("express")
const fetch = require("node-fetch")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const PORT = process.env.PORT || 8080
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "aquadecor123"
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID


// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
  res.send("Aqua Decor AI Agent Running 🚀 - Voice & WhatsApp")
})


// =========================
// Incoming Call Route (Twilio)
// =========================
app.post("/voice", (req, res) => {

  const twiml = `
<Response>

<Say voice="Google.en-IN-Standard-A">
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
// Handle Customer Speech (Twilio)
// =========================
app.post("/gather", (req, res) => {

  const speech = req.body.SpeechResult || "I did not hear anything"

  console.log("Customer said:", speech)

  const twiml = `
<Response>

<Say voice="Google.en-IN-Standard-A">
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
// WhatsApp Webhook Verify (Meta)
// =========================
app.get("/whatsapp-webhook", (req, res) => {
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  console.log("Webhook verification request received")

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!")
    res.status(200).send(challenge)
  } else {
    console.log("❌ Webhook verification failed")
    res.sendStatus(403)
  }
})


// =========================
// WhatsApp Incoming Messages (Meta)
// =========================
app.post("/whatsapp-webhook", async (req, res) => {
  const body = req.body

  console.log("WhatsApp webhook received:", JSON.stringify(body, null, 2))

  if (body.object === "whatsapp_business_account") {
    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const message = value?.messages?.[0]
    const from = message?.from
    const text = message?.text?.body

    if (message && text) {
      console.log("📱 Message from:", from)
      console.log("💬 Text:", text)

      // Build reply based on message content
      const reply = buildReply(text)

      // Send reply back to customer
      await sendWhatsAppMessage(from, reply)
    }
  }

  res.sendStatus(200)
})


// =========================
// Build Smart Reply
// =========================
function buildReply(text) {
  const msg = text.toLowerCase()

  if (msg.includes("board") || msg.includes("sign") || msg.includes("signage")) {
    return "🪧 Thank you for your interest in our signage boards! We offer glow sign boards, flex boards, and LED boards. Please share your shop location and size requirements. Our team will visit and give you a quote. 📞 Call: 9796801850"
  }

  if (msg.includes("acrylic") || msg.includes("letter")) {
    return "✨ We specialize in premium acrylic and steel 3D letters! Perfect for shop fronts and branding. Share your requirements and we will send you samples and pricing. 📞 Call: 9796801850"
  }

  if (msg.includes("led") || msg.includes("light") || msg.includes("glow")) {
    return "💡 Our LED glow sign boards are our most popular product! Energy efficient and long lasting. Tell us your shop name and we will design a free mockup for you. 📞 Call: 9796801850"
  }

  if (msg.includes("price") || msg.includes("cost") || msg.includes("rate") || msg.includes("quote")) {
    return "💰 Pricing depends on size, material, and design. Share your requirements and we will give you the best quote in Jammu. 📞 Call: 9796801850 or visit us at 815A Gandhi Nagar, Jammu."
  }

  if (msg.includes("location") || msg.includes("address") || msg.includes("where")) {
    return "📍 Aqua Decor is located at 815A Gandhi Nagar, Jammu. Open Monday to Saturday, 10am to 7pm. 📞 Call: 9796801850"
  }

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("namaste") || msg.includes("helo")) {
    return "🙏 Namaste! Welcome to Aqua Decor Jammu. We are experts in shop branding, signage boards, acrylic letters, LED signs, and digital advertising. How can we help you today?"
  }

  // Default reply
  return "🙏 Thank you for contacting Aqua Decor! We offer shop boards, acrylic letters, LED signage, flex boards, and complete shop branding. For a free consultation please call 📞 9796801850 or visit 815A Gandhi Nagar, Jammu."
}


// =========================
// Send WhatsApp Message
// =========================
async function sendWhatsAppMessage(to, message) {
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      })
    })

    const data = await response.json()
    console.log("✅ WhatsApp message sent:", data)
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", error)
  }
}


// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📞 Twilio Voice: /voice`)
  console.log(`💬 WhatsApp Webhook: /whatsapp-webhook`)
})