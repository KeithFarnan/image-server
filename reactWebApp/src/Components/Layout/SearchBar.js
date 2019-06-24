import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NavDropdown from "react-bootstrap/NavDropdown";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

function SearchBar() {
  return (
    <div>
      <Container>
        <Row className="justify-content-center" xs>
          <Col xs={12} md={{ span: 8, offset: 1 }}>
            <FormControl
              placeholder="Search Term"
              aria-label="Search Term"
              aria-describedby="basic-addon2"
            />
          </Col>
          <Col>
            <InputGroup className="justify-content-center">
              <Col>
                <DropdownButton
                  as={InputGroup.Append}
                  variant="secondary"
                  title="Dropdown"
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item href="#">Search By Location</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">Search By Event</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">Search By Year</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">Search By Person</Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col>
                <Button variant="success">Search</Button>
              </Col>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SearchBar;
