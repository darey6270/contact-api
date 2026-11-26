import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { ContactInput } from '../validators/contact.validator';
import { escapeHtml } from '../utils/escape-html';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000
});

export const verifyEmailConnection = async (): Promise<void> => {
  try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed", err);
}
};

export const sendContactNotification = async (contact: ContactInput): Promise<void> => {
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const subject = escapeHtml(contact.subject);
  const message = escapeHtml(contact.message);

  await transporter.sendMail({
    from: { name: env.MAIL_FROM_NAME, address: env.SMTP_USER },
    to: env.CONTACT_RECEIVER,
    replyTo: contact.email,
    subject: `New Contact Message: ${contact.subject}`,
    text: [
      'New contact message',
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Subject: ${contact.subject}`,
      '',
      'Message:',
      contact.message
    ].join('\\n'),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:25px;color:#333">
        <h2 style="color:#D90045">New Contact Message</h2>
        <p>You have received a new message from your website.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message</h3>
        <div style="background:#f7f7f7;padding:20px;border-radius:8px;line-height:1.7;white-space:pre-wrap">${message}</div>
        <p style="color:#777">Reply to this email to respond to the visitor.</p>
      </div>
    `
  });
};

export const sendContactAcknowledgement = async (contact: ContactInput): Promise<void> => {
  const name = escapeHtml(contact.name);
  const senderName = escapeHtml(env.MAIL_FROM_NAME);

  await transporter.sendMail({
    from: { name: env.MAIL_FROM_NAME, address: env.SMTP_USER },
    to: contact.email,
    subject: 'We have received your message',
    text: `Hello ${contact.name},\\n\\nThank you for contacting us. We have received your message and will get back to you as soon as possible.\\n\\nRegards,\\n${env.MAIL_FROM_NAME}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#333">
        <h2 style="color:#D90045">Thank you for contacting us!</h2>
        <p>Hello ${name},</p>
        <p>We have successfully received your message. Our team will review it and get back to you as soon as possible.</p>
        <p>Thank you for reaching out to us.</p>
        <p>Regards,<br>${senderName}</p>
      </div>
    `
  });
};
