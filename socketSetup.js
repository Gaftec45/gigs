const { ObjectId } = require('mongodb');
const Message = require('./model/message');
const Conversation = require('./model/conversation');
const setupSocket = require('./socketSetup');
const socketIo = require('socket.io');
const http = require('http');
const Message = require('./model/message');
const { ObjectId } = require('mongodb');


const server = http.createServer(app);
const io = socketIo(server)

function setupSocket(server) {
    const io = require('socket.io')(server); // Import and initialize Socket.IO

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('chat message', async (msg) => {
            if (!msg || !msg.message) {
                console.error('Invalid message data:', msg);
                return; // Skip processing the message if data is invalid
            }

            console.log('Received message:', msg.message);

            try {
                // Generate new ObjectId instances for sender and receiver
                const senderId = new ObjectId();
                const receiverId = new ObjectId();
                console.log(senderId + receiverId);

                // Create or find the conversation between sender and receiver
                let conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] }
                });

                if (!conversation) {
                    // If conversation does not exist, create a new one
                    conversation = new Conversation({
                        participants: [senderId, receiverId]
                    });
                    await conversation.save();
                }

                // Create a new message associated with the conversation
                const newMessage = new Message({
                    message: msg.message,
                    sender: senderId,
                    receiver: receiverId,
                    conversation: conversation._id // Associate the message with the conversation
                });

                // Save the message to the database
                await newMessage.save();

                // Emit the message to all connected clients
                io.emit('chat message', msg);
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

module.exports = setupSocket;

// POST request handler
app.post('/', async (req, res) => {
    // Extract message data from the request body
    const { message, sender, receiver } = req.body;
  
    try {
        // Ensure required fields are present
        if (!message || !sender || !receiver) {
            console.error('Missing message data:', req.body);
            return res.status(400).send('Missing message data');
        }
  
        // Create or find the conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });
  
        if (!conversation) {
            // If conversation does not exist, create a new one
            conversation = new Conversation({
                participants: [sender, receiver]
            });
            await conversation.save();
        }
  
        // Create a new message associated with the conversation
        const newMessage = new Message({
            message,
            sender,
            receiver,
            conversation: conversation._id // Associate the message with the conversation
        });
  
        // Save the message to the database
        await newMessage.save();
  
        console.log('Message saved to database');
        res.status(200).send('Message received and saved successfully');
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send('Error saving message');
    }
  });
