import defaultPng from '../avatars/default.png';
import avatar4 from '../avatars/avatar4.png';
import avatar6 from '../avatars/avatar6.png';
import avatar8 from '../avatars/avatar8.png';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    user: 'User',
    avatar: defaultPng,
    type: 'team_apply',
    message: 'applied to your team request "AI Hackathon Navigator"',
    time: '5m ago',
    unread: true,
  },
  {
    id: 'notif_2',
    user: 'Sarah Chen',
    avatar: avatar6,
    type: 'comment',
    message: 'commented on your post about Engineering Math Textbook',
    time: '25m ago',
    unread: true,
  },
  {
    id: 'notif_3',
    user: 'Anonymous Fox',
    avatar: 'fox-mascot',
    type: 'anon_msg',
    message: 'sent you an anonymous DM regarding the Finals Poll',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'notif_4',
    user: 'Robotics Club',
    avatar: avatar8,
    type: 'event',
    message: 'posted a new event: Weekend Hack Sprint & Pizza',
    time: '3h ago',
    unread: false,
  },
];
