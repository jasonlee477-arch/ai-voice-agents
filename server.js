const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const VoiceResponse = twilio.twiml.VoiceResponse;


/* ---------- CALL START ---------- */

app.post("/voice", (req, res) => {

  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: "speech",
    action: "/location",
    method: "POST",
    speechTimeout: "auto",
    language: "hi-IN"
  });

  gather.say(
    { language: "hi-IN" },
    `<speak>
    नमस्ते।
    <break time="200ms"/>
    एक्वा डेकोर डिजिटल एडवर्टाइजिंग जम्मू में आपका स्वागत है।
    <break time="250ms"/>
    कृपया बताइए आपकी दुकान किस इलाके में है।
    </speak>`
  );

  res.type("text/xml");
  res.send(twiml.toString());

});


/* ---------- LOCATION STEP ---------- */

app.post("/location", (req, res) => {

  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: "speech",
    action: "/board",
    method: "POST",
    speechTimeout: "auto",
    language: "hi-IN"
  });

  gather.say(
    { language: "hi-IN" },
    `<speak>
    धन्यवाद।
    <break time="200ms"/>
    अब बताइए आपको किस तरह का बोर्ड चाहिए।
    <break time="200ms"/>
    जैसे एक्रिलिक लेटर,
    ग्लो साइन बोर्ड,
    या फ्लेक्स बोर्ड।
    </speak>`
  );

  res.type("text/xml");
  res.send(twiml.toString());

});


/* ---------- BOARD TYPE STEP ---------- */

app.post("/board", (req, res) => {

  const twiml = new VoiceResponse();

  twiml.say(
    { language: "hi-IN" },
    `<speak>
    बहुत बढ़िया।
    <break time="200ms"/>
    हमारी टीम जल्द ही आपसे संपर्क करेगी।
    <break time="200ms"/>
    एक्वा डेकोर को कॉल करने के लिए धन्यवाद।
    </speak>`
  );

  res.type("text/xml");
  res.send(twiml.toString());

});


/* ---------- SERVER START ---------- */

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("AI Call Server running on port " + PORT);
});