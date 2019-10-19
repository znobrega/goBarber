import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const user = User.findOne({ where: { user_id: req.userId, provider: true } });

    if (!user) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(20);


    return res.json(notifications);
  }

  async update(req, res) {
    const notification = Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    return res.json(notification);
  }
}

export default new NotificationController();
