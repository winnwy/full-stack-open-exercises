const notificationStyle = (type) => ({
    color: type === 'error' ? 'red' : 'green',
    background:'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
})

const Notification = ({message, type}) => {
    if (message === null) {
        return null
    }

    return (
        <div style={notificationStyle(type)}>
            {message}
        </div>
    )
}

export default Notification;