import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

/**
|--------------------------------------------------
| This is a comment block for describing what the code does
|--------------------------------------------------
*/

function SignUP() {
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
                    <h1>CREATE ACCOUNT</h1>
                  </Card.Header>
                </Card.Title>

                <Card.Text>
                  Please create an account on the server with an email address
                  and password <br />
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
                      Sign up
                    </Button>
                  </Form>
                </Card.Body>
                <Card.Body>
                  <Card.Link href="/users/login" className="float-left">
                    Already have an account
                  </Card.Link>
                  <Card.Link
                    href="/users/forgotPassword"
                    className="float-right"
                  >
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
export default SignUP;
