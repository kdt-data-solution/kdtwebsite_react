import 'dotenv/config';
import app from './app.js';
import { verifyMailer } from './services/mailer.js';
import { seedInitial } from './db/seed.js';

seedInitial();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Add it to backend/.env');
  process.exit(1);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  verifyMailer();
});
