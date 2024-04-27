// kafka
const { Kafka } = require('kafkajs');
// email
const nodemailer = require('nodemailer');

const kafka = new Kafka({
  clientId: 'crm-service',
  brokers: ['52.72.198.36:9092', '54.224.217.168:9092', '44.208.221.62:9092']
});

const consumer = kafka.consumer({ groupId: 'CRM-G' });

const topic = 'kaiwenh.customer.evt';

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const customer = JSON.parse(message.value.toString());
      console.log(`Received message: ${message.value}`);
      sendEmail(customer);
    }
  });
}
runConsumer().catch(console.error);


async function sendEmail(customer) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '##########',  
      pass: '##########'     
    }
  });
  let mailOptions = {
    from: '##########',  
    to: `${customer.userId}`,            
    subject: 'Activate your book store account',
    text: `Dear ${customer.name},\nWelcome to the Book store created by your Andrew ID.\nExceptionally this time we won’t ask you to click a link to activate your account.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
