import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (notification === null) {
    return null
  } else {
    const notificationStyle = {
      color: notification.color,
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
    return (
      <div style={notificationStyle} data-testid="notification">
        {notification.text}
      </div>
    )
  }
}

export default Notification
