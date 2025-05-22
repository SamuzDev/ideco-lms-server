import nodemailer from 'nodemailer';
import { nodemailerMjmlPlugin } from 'nodemailer-mjml';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) ?? 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

transporter.use(
  'compile',
  nodemailerMjmlPlugin({
    mjmlOptions: { validationLevel: 'strict' },
    minifyHtmlOutput: true,
    templateMinifierOptions: {
      options: {
        collapseWhitespace: 'all',
        removeComments: true,
      },
    },
    templateFolder: path.join(process.cwd(), 'templates'),
  })
);

export default transporter;
