import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import express from 'express';
import { Router } from 'express';

const router = Router();

router.get('/', (req: express.Request, res: express.Response) => {
  const mjmlPath = path.join(process.cwd(), 'templates', 'welcome.mjml');
  let mjmlContent = fs.readFileSync(mjmlPath, 'utf8');

  mjmlContent = mjmlContent.replace('{{BETTER_AUTH_URL}}', process.env.BETTER_AUTH_URL!);

  const { html, errors } = mjml2html(mjmlContent);

  if (errors.length > 0) {
    res.status(500).send('Error processing the MJML file');
    return;
  }

  res.send(html);
});

export default router;
