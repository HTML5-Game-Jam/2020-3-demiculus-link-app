import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormLink from '../FormLink/FormLink';

class ModalLink extends Component {

    render() {
        return (
            <Modal
                trigger={<Button color={this.props.buttonColor}>{this.props.buttonTriggerTitle}</Button>}
                dimmer='inverted'
                size='tiny'
                closeIcon='close'
            >
                <Modal.Header>{this.props.headerTitle}</Modal.Header>
                <Modal.Content>
                    <FormLink
                        buttonSubmitTitle={this.props.buttonSubmitTitle}
                        buttonColor={this.props.buttonColor}
                        linkID={this.props.linkID}
                        onLinkAdded={this.props.onLinkAdded}
                        onLinkUpdated={this.props.onLinkUpdated}
                        server={this.props.server}
                        socket={this.props.socket}
                    />
                </Modal.Content>
            </Modal>
        );
    }
}

export default ModalLink;
