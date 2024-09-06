const proxyServerHost = "http://localhost:4000";
const { App } = require('@slack/bolt');
const axios = require('axios');
const jobCommands = require('../Constants/job_commands');
require('dotenv').config();

// Initialize your Slack app with your bot token and signing secret from Slack
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

// Function to handle all commands
const commandHandler = async ({ command, ack, say }) => {
    try {
        await ack();
        const jobType = Object.keys(jobCommands).find((key) => jobCommands[key] === command.command);
        if (jobType) {
            await forwardRequestToProxy(jobType, command.user_name, say);
        } else {
            throw new Error(`Unknown command: ${command.command}`);
        }
    } catch (error) {
        handleError(error, say, `Error handling command: ${command.command}`);
    }
};

// Register command handlers
Object.values(jobCommands).forEach((cmd) => {
    app.command(cmd, commandHandler);
});

// Function to forward the request to the proxy server
async function forwardRequestToProxy(jobType, userName, say) {
    try {
        const response = await axios.post(`${proxyServerHost}/trigger-job`, {
            jobType,
            userName,
        });
        await say(`${jobType} is triggered successfully by user: ${userName}.`);
    } catch (error) {
        handleError(error, say, 'Error forwarding request to proxy');
    }
}

// Centralized error handler
function handleError(error, say, context = 'An unexpected error occurred') {
    console.error(`${context}: ${error.message}`);
    if (say) {
        say(`${context}: ${error.message}`).catch((err) =>
            console.error(`Failed to send error message: ${err.message}`)
        );
    }
}

// Handle unexpected errors across the app
app.error((error) => handleError(error, null, 'Slack bot error'));

// Catch-all event handler for unhandled events
app.event('message', async ({ event, say }) => {
    console.log(`Unhandled event: ${event.type} from user ${event.user}`);
    await say(`Received an unhandled event of type: ${event.type}`).catch((error) =>
        console.error(`Failed to send message for unhandled event: ${error.message}`)
    );
});

// Start the app
(async () => {
    try {
        await app.start(process.env.PORT || 3000);
        console.log('⚡️ Slack bot is running!');
    } catch (error) {
        handleError(error, null, 'Failed to start Slack bot');
    }
})();