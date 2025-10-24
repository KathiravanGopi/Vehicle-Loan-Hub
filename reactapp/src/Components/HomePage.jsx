import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage-wrapper">
      <Container className="text-center py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="image-container">
              <img src={'/loancoverimage.jpg'} alt="Vehicle Loan Illustration" className="homepage-image" />
              <h2 className="homepage-title-overlay">Vehicle Loan HUB</h2>
            </div>
            <p className="homepage-description mt-3">
              Applying for a vehicle loan is now easier than ever. Our platform offers a seamless
              application process, competitive rates, and quick approval. Start your application
              today and get one step closer to owning your dream vehicle.
            </p>
          </Col>
        </Row>

        <footer className="homepage-footer text-center">
          <p>
            <strong>Contact Us:</strong> 
            <Link href="mailto:example@example.com">example@example.com</Link> | <Link href="tel:1234567890">123-456-7890</Link> &nbsp; | &nbsp;&copy; {new Date().getFullYear()} Vehicle Loan HUB. All rights reserved.
          </p>
        </footer>
      </Container>
    </div>
  );
}

export default HomePage;