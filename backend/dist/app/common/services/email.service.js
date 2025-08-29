"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationShortlistedEmailTemplate = exports.applicationRejectedEmailTemplate = exports.applicationAcceptedEmailTemplate = exports.resetPasswordEmailTemplate = exports.sendEmail = exports.Transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_hepler_1 = require("../helper/config.hepler");
(0, config_hepler_1.loadConfig)();
var Transport;
(function (Transport) {
    Transport["SMTP"] = "SMTP";
})(Transport || (exports.Transport = Transport = {}));
const transporters = {
    [Transport.SMTP]: null,
};
if (process.env.SMTP_ENABLE && parseInt(process.env.SMTP_ENABLE) == 1) {
    try {
        const smtpConfig = {
            host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER || process.env.SMTP_MAIL_USER,
                pass: process.env.EMAIL_PASSWORD || process.env.SMTP_MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        };
        console.log('Initializing SMTP transporter with config:', {
            host: smtpConfig.host,
            port: smtpConfig.port,
            user: smtpConfig.auth.user,
            secure: smtpConfig.secure
        });
        transporters[Transport.SMTP] = nodemailer_1.default.createTransport(smtpConfig);
        // Verify connection configuration
        transporters[Transport.SMTP].verify(function (error, success) {
            if (error) {
                console.error('SMTP connection failed:', error);
            }
            else {
                console.log('SMTP server is ready to take our messages');
            }
        });
    }
    catch (error) {
        console.error('Failed to initialize SMTP transporter:', error);
    }
}
else {
    console.log('SMTP is disabled. Set SMTP_ENABLE=1 to enable email functionality.');
}
/**
 * Sends an email using the specified transport.
 * @param mailOptions The mail options to pass to nodemailer.
 * @param transport The transport to use. Defaults to SMTP.
 * @returns A promise that resolves when the email is sent.
 * @throws An error if the transport is not initialized.
 */
const sendEmail = (mailOptions_1, ...args_1) => __awaiter(void 0, [mailOptions_1, ...args_1], void 0, function* (mailOptions, transport = Transport.SMTP) {
    try {
        if (!transporters[transport]) {
            throw new Error(`${transport} transport not initialized. Check SMTP configuration.`);
        }
        console.log('Attempting to send email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            transport: transport
        });
        const result = yield transporters[transport].sendMail(mailOptions);
        console.log('Email sent successfully:', {
            messageId: result.messageId,
            to: mailOptions.to,
            subject: mailOptions.subject
        });
        return result;
    }
    catch (error) {
        console.error('Failed to send email:', {
            error: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack
        });
        // Re-throw the error so calling code can handle it
        throw error;
    }
});
exports.sendEmail = sendEmail;
/**
 * Returns an HTML string containing a link to reset a user's password.
 * The link is in the format `<a href="${process.env.FE_BASE_URL}/reset-password?token=${token}">here</a>`.
 * @param token The password reset token. Defaults to an empty string.
 * @returns An HTML string containing the password reset link.
 */
const resetPasswordEmailTemplate = (token = "") => `
<html>
  <body>
    <h3>Welcome to app</h3>
    <p>Click <a href="${process.env.FE_BASE_URL}/reset-password?token=${token}">here</a> to reset your password</p>
  </body>
</html>`;
exports.resetPasswordEmailTemplate = resetPasswordEmailTemplate;
/**
 * Returns an HTML string for application acceptance email.
 * @param candidateName The name of the candidate
 * @param jobTitle The title of the job
 * @param companyName The name of the company
 * @param employerName The name of the employer
 * @returns An HTML string containing the application acceptance message
 */
const applicationAcceptedEmailTemplate = (candidateName, jobTitle, companyName, employerName) => `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Application Accepted!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Congratulations on your success!</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #28a745; margin-top: 0;">Dear ${candidateName},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          We are pleased to inform you that your application has been <strong>ACCEPTED</strong>!
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Application Details:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>Position:</strong> ${jobTitle}
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>Company:</strong> ${companyName}
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>Hiring Manager:</strong> ${employerName}
            </li>
            <li style="padding: 8px 0;">
              <strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">ACCEPTED</span>
            </li>
          </ul>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          The hiring team at <strong>${companyName}</strong> was impressed with your qualifications and experience. 
          You will be contacted shortly by <strong>${employerName}</strong> with next steps regarding your onboarding process.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FE_BASE_URL}/applications" 
             style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            View Your Applications
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6c757d; margin-top: 30px; text-align: center;">
          Thank you for choosing ${companyName}. We look forward to having you on our team!
        </p>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
          This email was sent by ${employerName} from ${companyName}. Please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>`;
exports.applicationAcceptedEmailTemplate = applicationAcceptedEmailTemplate;
/**
 * Returns an HTML string for application rejection email.
 * @param candidateName The name of the candidate
 * @param jobTitle The title of the job
 * @param companyName The name of the company
 * @param employerName The name of the employer
 * @returns An HTML string containing the application rejection message
 */
const applicationRejectedEmailTemplate = (candidateName, jobTitle, companyName, employerName) => `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">📝 Application Update</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your interest</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #495057; margin-top: 0;">Dear ${candidateName},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Application Status:</h3>
          <p style="margin: 0; color: #dc3545; font-weight: bold; font-size: 18px;">
            Unfortunately, we are unable to move forward with your application at this time.
          </p>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          We appreciate the time and effort you put into your application. 
          While we cannot offer you this position, we encourage you to apply for future opportunities that match your skills and experience.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FE_BASE_URL}/jobs" 
             style="background: #6c757d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            Browse More Jobs
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6c757d; margin-top: 30px; text-align: center;">
          We wish you the best in your job search and future endeavors.
        </p>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
          This email was sent by ${employerName} from ${companyName}. Please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>`;
exports.applicationRejectedEmailTemplate = applicationRejectedEmailTemplate;
/**
 * Returns an HTML string for application shortlisted email.
 * @param candidateName The name of the candidate
 * @param jobTitle The title of the job
 * @param companyName The name of the company
 * @param employerName The name of the employer
 * @returns An HTML string containing the application shortlisted message
 */
const applicationShortlistedEmailTemplate = (candidateName, jobTitle, companyName, employerName) => `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">⭐ Application Shortlisted!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Great news for you!</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #17a2b8; margin-top: 0;">Dear ${candidateName},</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Congratulations! Your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <strong>SHORTLISTED</strong>!
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">What This Means:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>Position:</strong> ${jobTitle}
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>Company:</strong> ${companyName}
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>Hiring Manager:</strong> ${employerName}
            </li>
            <li style="padding: 8px 0;">
              <strong>Status:</strong> <span style="color: #17a2b8; font-weight: bold;">SHORTLISTED</span>
            </li>
          </ul>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          You are among the top candidates for this position! The hiring team at <strong>${companyName}</strong> will review your application further and may contact you for additional interviews or assessments.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FE_BASE_URL}/applications" 
             style="background: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            View Your Applications
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6c757d; margin-top: 30px; text-align: center;">
          Please keep your contact information up to date. We look forward to potentially working with you!
        </p>
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
          This email was sent by ${employerName} from ${companyName}. Please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>`;
exports.applicationShortlistedEmailTemplate = applicationShortlistedEmailTemplate;
