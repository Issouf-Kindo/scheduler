import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
} else {
  console.warn("Twilio credentials not set");
}

interface SMSParams {
  to: string;
  message: string;
}

export async function sendSMS(params: SMSParams): Promise<boolean> {
  try {
    if (!client || !fromNumber) {
      console.log("SMS would be sent:", params);
      return true; // Simulate success for development
    }

    await client.messages.create({
      body: params.message,
      from: fromNumber,
      to: params.to,
    });
    return true;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    return false;
  }
}
