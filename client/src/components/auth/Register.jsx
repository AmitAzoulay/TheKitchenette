import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import bcrypt from 'bcryptjs';
import instance from '../../axios';

const Register = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [password, setPassword] = useState("")

    async function register(e) {
        e.preventDefault()
        try {
            const registerData = {
                email,
                displayName,
                password,
            }
            const salt = '$2b$10$' + process.env.REACT_APP_ZHASH
            registerData.password = await bcrypt.hash(password, salt)
            const response = await instance.post(`${process.env.REACT_APP_SERVER_URL}/user/register`, registerData)
            console.log(response.status)
            if (response.status === 200) {
                navigate("/")
            }
        } catch (error) {
            alert(error.response.data.errorMessage)
        }
    }
    return (
        <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0">Sign Up</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={register}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="dark" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    )
}

export default Register
