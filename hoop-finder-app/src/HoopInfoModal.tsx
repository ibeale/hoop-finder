import React from 'react'
import { Button, Dropdown, Form, Modal, ModalTitle } from 'react-bootstrap';
import {Hoop, HoopContainer, hoopCoords} from './App'
import { FirebaseAccess, User } from './FirebaseAccess';



interface HIMprops{
    showModal: boolean,
    hoop: HoopContainer,
    toggleShow: Function,
    user: User|null
}


export default function HoopInfoModal(props: HIMprops){
    let button = props.user?.email == props.hoop.hoop.createdBy?.email ? <button className={"btn btn-danger"} onClick={() => FirebaseAccess.getInstance().deleteHoop(props.hoop, props.toggleShow)}>Delete this Hoop</button> : <button className={"btn btn-danger"} disabled>Delete this Hoop</button>
    return(<Modal show={props.showModal} onHide={props.toggleShow}>
        <Modal.Header closeButton >
          <Modal.Title>{props.hoop.hoop.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Rim Type</Form.Label>
                    <Form.Control type="text" value={props.hoop.hoop.rimType} disabled ></Form.Control>
                    <Form.Label>Court Size</Form.Label>
                    <Form.Control type="text" value={props.hoop.hoop.courtSize} disabled>
                    </Form.Control> 
                    <Form.Label>Hoop Height</Form.Label>
                    <Form.Control type="text" value={props.hoop.hoop.height} disabled>
                    </Form.Control>
                    <Form.Label>Created By</Form.Label>
                    <Form.Control type="text" value={props.user !== null && props.user.displayName !== null ? props.user.displayName : ""} disabled ></Form.Control> 
                </Form.Group>
            </Form>

                {button}
            
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>)
}