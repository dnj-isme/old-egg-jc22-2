import { NOTIFICATION_TYPE, Store } from 'react-notifications-component';

export default function ShowNotification(type: NOTIFICATION_TYPE = 'info', title: string = 'Information', message: string = 'Sample Message') {
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

export const NotificationTemplate = {
  Error: function() {
    ShowNotification("danger", "Error occured", "View console for details")
  },
  Success: function() {
    ShowNotification("success", "Success", "The Process is succeed!")
  },
  InProgress: function(progress?: string) {
    ShowNotification("info", "In Progress", `Process "${progress}" is under construction!`)
  },
  Failed: function(progress?: string) {
    ShowNotification("danger", "Failed", `Failed to ${progress ? progress : "execute something"}`)
  }
}