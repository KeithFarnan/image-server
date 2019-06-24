import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
function Login() {
  return (
    <div>
      <br />
      <br />
      <Container>
        <Row className="justify-content-md-center text-center">
          <Col xs={8}>
            <Card bg="light" border="primary">
              <Card.Body>
                <Card.Title>
                  <Card.Header>
                    <h1>User Login</h1>
                  </Card.Header>
                </Card.Title>

                <Card.Text>
                  Please Login with your email address and password <br />
                </Card.Text>
                <Card.Body>
                  <Form className="text-center">
                    <Form.Group controlId="loginForm">
                      <Form.Control
                        size="lg"
                        type="text"
                        placeholder="Enter email"
                        className="text-center"
                      />
                    </Form.Group>

                    <Form.Group controlId="loginPassword">
                      <Form.Control
                        size="lg"
                        type="password"
                        placeholder="Password"
                        className="text-center"
                      />
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit">
                      Login
                    </Button>
                  </Form>
                </Card.Body>
                <Card.Body>
                  <Card.Link href="#" className="float-left">
                    Create Account
                  </Card.Link>
                  <Card.Link href="#" className="float-right">
                    Forgot Password
                  </Card.Link>
                </Card.Body>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Login;
