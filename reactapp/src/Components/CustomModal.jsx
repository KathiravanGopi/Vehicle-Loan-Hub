import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import './CustomModal.css';

const CustomModal = ({
  show,
  onHide,
  onConfirm,
  title,
  body,
  confirmText = 'OK',
  cancelText = 'Cancel',
  children,
  singleButton = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <Modal.Title className="modal-title-custom">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">{children || body}</Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        {singleButton ? (
          <Button onClick={onHide} className="btn-confirm">
            {confirmText}
          </Button>
        ) : (
          <>
            <Button onClick={onHide} className="btn-cancel">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} className="btn-confirm">
              {confirmText}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

CustomModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  children: PropTypes.node,
  singleButton: PropTypes.bool,
};

export default CustomModal;
