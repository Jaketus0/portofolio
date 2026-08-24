import { Router } from 'express';
import { authRouter } from './auth.routes';
import { heroRouter } from './hero.routes';
import { aboutRouter } from './about.routes';
import { projectRouter } from './project.routes';
import { skillRouter } from './skill.routes';
import { contactRouter } from './contact.routes';
import { messageRouter } from './message.routes';
import { mediaRouter } from './media.routes';
import { visitorRouter } from './visitor.routes';
import { settingsRouter } from './settings.routes';
import { profileRouter } from './profile.routes';
import { serviceRouter } from './service.routes';
import { contactSubmissionRouter } from './contact-submission.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/hero', heroRouter);
apiRouter.use('/about', aboutRouter);
apiRouter.use('/projects', projectRouter);
apiRouter.use('/skills', skillRouter);
apiRouter.use('/services', serviceRouter);
apiRouter.use('/contact', contactRouter);
apiRouter.use('/messages', messageRouter);
apiRouter.use('/contact-submissions', contactSubmissionRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/visitors', visitorRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/profile', profileRouter);

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ success: true, message: 'SkyLogic API is running' });
});
