import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../axios'
import AuthContext from '../../context/AuthContext';
import bcrypt from 'bcryptjs';
import AdminContext from '../../context/AdminContext';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { getLoggedIn } = useContext(AuthContext)
    const {getIsAdmin} = useContext(AdminContext)
    async function login(e) {
        e.preventDefault()
        try {
            const loginData = {
                email,
                password,
            }
            const salt = '$2b$10$' + process.env.REACT_APP_ZHASH
            loginData.password = await bcrypt.hash(password, salt)

            const response = await instance.post(`${process.env.REACT_APP_SERVER_URL}/user/login`, loginData, { withCredentials: true })
            if (response.status === 200) {
                await getLoggedIn()
                await getIsAdmin()
                navigate("/chat")
            }
        } catch (error) {
            alert(error.response.data.errorMessage)
        }
    }
    return (
    <Container className="mt-5"  >
      <Row className="justify-content-center" >
        <Col md={6}>
          <Card >
            <Card.Header variant="dark" className="bg-dark text-white">
              <h4   className="mb-0">Login</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={login}>
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

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="dark" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    )
}

export default Login
