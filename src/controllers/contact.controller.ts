import { Request, Response, NextFunction } from 'express';
import { contactSchema } from '../validators/contact.validator';
import {
  sendContactNotification,
  sendContactAcknowledgement
} from '../services/email.service';

export const submitContactForm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = contactSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Please check your submitted information.',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
      return;
    }

    const contact = result.data;

    // Silently accept but do not email likely bot submissions.
    if (contact.website.trim().length > 0) {
      res.status(200).json({
        success: true,
        message: 'Your message has been received.'
      });
      return;
    }

    await sendContactNotification(contact);

    // Acknowledgement is secondary; its failure does not undo the notification.
    try {
      await sendContactAcknowledgement(contact);
    } catch (error) {
      console.error(
        'Visitor acknowledgement email failed:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon.'
    });
  } catch (error) {
    next(error);
  }
};
