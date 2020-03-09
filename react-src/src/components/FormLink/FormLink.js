import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

const typeOptions = [
    { key: 'Common', text: 'Common', value: 'Common' },
    { key: 'Daily', text: 'Daily', value: 'Daily' },
    { key: 'Weekly', text: 'Weekly', value: 'Weekly' },
    { key: 'Monthly', text: 'Monthly', value: 'Monthly' },
    { key: 'Yearly', text: 'Yearly', value: 'Yearly' },
]

class FormLink extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            type: '',
            tag: '',
            formClassName: '',
            formSuccessMessage: '',
            formErrorMessage: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        // Fill in the form with the appropriate data if link id is provided
        if (this.props.linkID) {
            axios.get(`${this.props.server}/api/links/${this.props.linkID}`)
                .then((response) => {
                    this.setState({
                        url: response.data.url,
                        type: response.data.type,
                        tag: (response.data.tag === null) ? '' : response.data.tag,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value });
    }

    handleSelectChange(e, data) {
        this.setState({ type: data.value });
    }

    handleSubmit(e) {
        // Prevent browser refresh
        e.preventDefault();

        const link = {
            url: this.state.url,
            type: this.state.type,
            tag: this.state.tag,
        }

        // Acknowledge that if the link id is provided, we're updating via PUT
        // Otherwise, we're creating a new data via POST
        const method = this.props.linkID ? 'put' : 'post';
        const params = this.props.linkID ? this.props.linkID : '';

        axios({
            method: method,
            responseType: 'json',
            url: `${this.props.server}/api/links/${params}`,
            data: link
        })
            .then((response) => {
                this.setState({
                    formClassName: 'success',
                    formSuccessMessage: response.data.msg
                });

                if (!this.props.linkID) {
                    this.setState({
                        url: '',
                        type: '',
                        tag: '',
                    });
                    this.props.onLinkAdded(response.data.result);
                    this.props.socket.emit('add_link', response.data.result);
                }
                else {
                    this.props.onLinkUpdated(response.data.result);
                    this.props.socket.emit('update_link', response.data.result);
                }

            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.data) {
                        this.setState({
                            formClassName: 'warning',
                            formErrorMessage: err.response.data.msg
                        });
                    }
                }
                else {
                    this.setState({
                        formClassName: 'warning',
                        formErrorMessage: 'Something went wrong. ' + err
                    });
                }
            });
    }

    render() {

        const formClassName = this.state.formClassName;
        const formSuccessMessage = this.state.formSuccessMessage;
        const formErrorMessage = this.state.formErrorMessage;

        return (
            <Form className={formClassName} onSubmit={this.handleSubmit}>
                <Form.Input
                    label='URL'
                    type='text'
                    placeholder='www.something.com'
                    name='url'
                    maxLength='400'
                    required
                    value={this.state.url}
                    onChange={this.handleInputChange}
                />
                <Form.Group widths='equal'>
                    <Form.Field
                        control={Select}
                        label='Type'
                        options={typeOptions}
                        placeholder='Type'
                        value={this.state.type}
                        onChange={this.handleSelectChange}
                    />
                    <Form.Input
                        label='Tags'
                        type='text'
                        placeholder='blog,personal development,ray dalio'
                        name='tag'
                        value={this.state.tag}
                        onChange={this.handleInputChange}
                    />
                </Form.Group>
                <Message
                    success
                    color='green'
                    header='Nice one!'
                    content={formSuccessMessage}
                />
                <Message
                    warning
                    color='yellow'
                    header='Woah!'
                    content={formErrorMessage}
                />
                <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
                <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
            </Form>
        );
    }
}

export default FormLink;
