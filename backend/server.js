const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const http = require('http');
const cors = require("cors");
const authenticateToken = require('./config/authentication');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    // origin: "https://4739-2401-4900-1c66-aac7-2508-b122-7fb3-bc04.ngrok-free.app",
    origin: "*",
    // methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  }
});

require('dotenv').config();

connectDB();

const corsOptions = {
  origin:'*', 
  credentials:true,           
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Webhook functions
const handleGetRequest = (req, res) => {
  const VERIFY_TOKEN = '123456';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

const handleEventReceival = async (req,res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.log("abcd")
  console.dir(body, { depth: null });

  console.log("1234")
  const entry = body.entry;
  const obj = entry[0];
  const messaging = obj.messaging;
  const object = messaging[0];

  // io.on("connection", (socket) => {
  // });
  // io.emit('newMessage', { message: object});

  // await server.emitMessageReceiveEvent(object);

  const timestamp = object.timestamp;
  const senderId = object.sender.id;
  const recipientId = object.recipient.id;
  const recipient = {data : [{id: recipientId}]}
  const message = object.message;
  
  const newMessage = new Message({
    pageId: obj.id,
    messageId: message.mid,
    created_time: timestamp,
    to: recipient,
    from: { id: senderId },
    message: message.text
  });
  
  await newMessage.save();

  // emitting the newly received message through websocket
  // if(senderId!==obj.id ) {
    io.emit("newMessage", newMessage);
  // }
  
  const fetchedConversations = await Conversation.find({ customerId: senderId }).sort({ lastMessageCreatedAt: -1 });
  
  if (
    senderId!==obj.id && 
    (fetchedConversations.length === 0 || isTimeGapGreaterThan24Hours(fetchedConversations[0].lastMessageCreatedAt, timestamp))) {

    const newConversation = new Conversation({
      pageId: obj.id,
      customerId: senderId,
      messages: [newMessage],
      lastMessageCreatedAt: timestamp
    });
  
    await newConversation.save();
  } else if(
    senderId!==obj.id
    // true
    ) {

    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: fetchedConversations[0]._id },
      { $push: { messages: newMessage }, lastMessageCreatedAt: timestamp },
      { new: true }
    );
  }



  if (body.object === "page") {

    res.status(200).send("EVENT_RECEIVED");


    body.entry.forEach(async function (entry) {
      if ("changes" in entry) {

        let receiveMessage = new Receive();
        if (entry.changes[0].field === "feed") {
          let change = entry.changes[0].value;
          switch (change.item) {
            case "post":
              return receiveMessage.handlePrivateReply(
                "post_id",
                change.post_id
              );
            case "comment":
              return receiveMessage.handlePrivateReply(
                "comment_id",
                change.comment_id
              );
            default:
              console.warn("Unsupported feed change type.");
              return;
          }
        }
      }


      entry.messaging.forEach(async function (webhookEvent) {

        if ("read" in webhookEvent) {
          console.log("Got a read event");
          return;
        } else if ("delivery" in webhookEvent) {
          console.log("Got a delivery event");
          return;
        } else if (webhookEvent.message && webhookEvent.message.is_echo) {
          console.log(
            "Got an echo of our send, mid = " + webhookEvent.message.mid
          );
          return;
        }


        let senderPsid = webhookEvent.sender.id;

        let user_ref = webhookEvent.sender.user_ref;

        let guestUser = isGuestUser(webhookEvent);

      
      });
    });
  } else {

    res.sendStatus(404);
  }
};

function isGuestUser(webhookEvent) {
  let guestUser = false;
  if ("postback" in webhookEvent) {
    if ("referral" in webhookEvent.postback) {
      if ("is_guest_user" in webhookEvent.postback.referral) {
        guestUser = true;
      }
    }
  }
  return guestUser;
}

const isTimeGapGreaterThan24Hours = (timestamp1, timestamp2) => {
  const time1 = new Date(timestamp1).getTime();
  const time2 = new Date(timestamp2).getTime();

  const timeDifferenceInHours = Math.abs(time1 - time2) / (1000 * 60 * 60);

  return timeDifferenceInHours > 24;
};  


// Routes
app.get('/webhook', handleGetRequest);
app.post('/webhook', handleEventReceival);
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/webhook', require('./routes/webhookRoutes'));
app.use('/api/facebook',  authenticateToken, require('./routes/facebookRoutes'));
app.use('/api/message',  authenticateToken, require('./routes/messageRoutes'));
app.use('/api/conversation',  authenticateToken, require('./routes/conversationRoutes'));
app.use('/api/user', authenticateToken, require('./routes/userRoutes')); 


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const emitMessageReceiveEvent = async (messageObj)=> {
  io.on("newMessage", (socket) => {
      socket.emit("message", object);
    });
}

module.exports = {
  emitMessageReceiveEvent
}


