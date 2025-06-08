import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Container, Card, Form, Button, CardBody } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios'
const Chat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const socketRef = useRef(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const messagesRes = await instance.get(`${process.env.REACT_APP_SERVER_URL}/chat/getMessages`, {
          credentials: 'include',
        })

        if (messagesRes.status !== 200) {
          navigate('/');
          return;
        }
        const userRes = await instance.get(`${process.env.REACT_APP_SERVER_URL}/user/current`, {
          credentials: 'include',
        });

        const userData =  userRes.data
        setUser(userData);

        const messagesData = messagesRes.data
        setMessages(messagesData);

        if (!socketRef.current) {
          socketRef.current = io(`${process.env.REACT_APP_SERVER_URL}`, {
            withCredentials: true,
          });

          socketRef.current.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data])
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserAndMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    };
  }, [navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current && user) {
      const chatMessage = {
        message,
        username: user.displayName,
        admin: user.isAdmin,
        email: user.email,
        sentAt: new Date(),
            
      };
      socketRef.current.emit('chatMessage', chatMessage);
      setMessage('');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0">The Kitchenette</h5>
        </Card.Header>
        <CardBody style={{ height: '600px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ color: msg.admin ? 'red' : 'black' }} className="mb-2">
              <strong>{msg.username}{user && user.email === msg.email ? ' (you)' : ''}:</strong> {msg.message}
              <div className="text-muted small">{new Date(msg.sentAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </CardBody>
        <Card.Footer>
          <Form onSubmit={sendMessage} className="d-flex">
            <Form.Control
              type="text"
              className="me-2"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="dark">Send</Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Chat;
