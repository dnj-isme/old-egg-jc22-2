import { NOTIFICATION_TYPE, Store } from 'react-notifications-component';

export default function ShowNotification(type: NOTIFICATION_TYPE, title: string, message: string) {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    width: 300,
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  });
}
