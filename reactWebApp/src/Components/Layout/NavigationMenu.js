import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faImages,
  faFilm,
  faImage
} from "@fortawesome/free-solid-svg-icons";

function NavigationMenu() {
  return (
    <Nav fill variant="pills" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/images">
          <FontAwesomeIcon icon={faImage} />- Images
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/albums">
          <FontAwesomeIcon icon={faImages} />- Image Albums
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/videos">
          <FontAwesomeIcon icon={faFilm} />- Videos
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/upload">
          <FontAwesomeIcon icon={faCloudUploadAlt} />- Upload
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
export default NavigationMenu;
