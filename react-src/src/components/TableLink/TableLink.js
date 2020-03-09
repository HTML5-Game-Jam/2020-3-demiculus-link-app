import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalLink from '../ModalLink/ModalLink';
// import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class TableLink extends Component {

    render() {
        let links = this.props.links;

        links = links.map((link) =>
            <Table.Row key={link._id}>
                <Table.Cell>{link.url}</Table.Cell>
                <Table.Cell>{link.type}</Table.Cell>
                <Table.Cell>{link.tag}</Table.Cell>
                <Table.Cell>
                    <ModalLink
                        headerTitle='Edit Link'
                        buttonTriggerTitle='Edit'
                        buttonSubmitTitle='Save'
                        buttonColor='blue'
                        linkId={link._id}
                        onLinkUpdated={this.props.onLinkUpdated}
                        server={this.props.server}
                        socket={this.props.socket}
                    />
                </Table.Cell>
            </Table.Row>
        );

        // Make every new link appear on top of the list
        links =  [...links].reverse();

        return (
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Url</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Tag</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {links}
                </Table.Body>
            </Table>
        );
    }


}

export default TableLink;
