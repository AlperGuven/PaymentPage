import React from 'react';
import { render } from 'react-dom';
import Card from 'react-credit-cards';

import './assets/styles/normalize.css';
import './assets/styles/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-credit-cards/es/styles-compiled.css';
import 'react-notifications/lib/notifications.css';

import {
    controlAndShapeCreditCardNumber,
    controlAndShapeCVC,
    controlAndShapeExpirationDate,
    controlAndShapeFormData,
} from './helpers/utils';

import { Container, Row, Col } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default class App extends React.Component {
    state = {
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        issuer: '',
        focused: '',
        formData: null,
        validCards: ['visa', 'mastercard'],
    };

    createNotification = (type, errorCause = '') => {
        switch (type) {
            case 'info':
                NotificationManager.info('Info message', 1500);
                break;
            case 'success':
                NotificationManager.success('Payment is success', 'Success', 1500);
                break;
            case 'warning':
                NotificationManager.warning('Warning Field is missing, Field: ' + errorCause, 'Warning', 1500);
                break;
            case 'error':
                NotificationManager.error('Error while filling out the form, Error: ' + errorCause, 'Error', 1500);
                break;
        }
    };
    // for the react credit cards framework, to handle issuer callback
    handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            this.setState({ issuer });
        }
    };

    handleInputFocus = ({ target }) => {
        this.setState({
            focused: target.name,
        });
    };

    handleInvalidName = ({ target }) => {
        if (target.value.length < 3) {
            this.createNotification('warning', 'Name');
        }
    };

    handleInvalidCardNumber = ({ target }) => {
        if (target.value.length < 16) {
            this.createNotification('warning', 'Card Number');
        }
    };

    handleInvaliExpireDate = ({ target }) => {
        if (target.value.length < 5) {
            this.createNotification('warning', 'Expire Date');
        }
    }

    handleInvalidCVC = ({ target }) => {
        if (target.value.length !== 3) {
            this.createNotification('warning', 'CVC');
        }
    }

    handleInputChange = ({ target }) => {
        if (target.name === 'number') {
            if (controlAndShapeCreditCardNumber(target.value)) {
                target.value = controlAndShapeCreditCardNumber(target.value);
            } else {
                if (target.value.length >= 1) {
                    this.createNotification('error', 'Card number must be started with 4 or 5');
                    target.value = '';
                }
            }

        } else if (target.name === 'expiry') {
            if (controlAndShapeExpirationDate(target.value)) {
                target.value = controlAndShapeExpirationDate(target.value);
            } else {
                this.createNotification('error', 'Expire Date is not correct');
                target.value = '';
            }

        } else if (target.name === 'cvc') {
            target.value = controlAndShapeCVC(target.value);
        }

        this.setState({ [target.name]: target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { issuer } = this.state;
        const formData = [...e.target.elements]
            .filter(d => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});
        this.setState({ formData });
        // If you want post the data now
        this.form.reset();
        this.createNotification('success');
    };

    render() {
        const { name, number, expiry, cvc, focused, issuer, formData, validCards } = this.state;

        return (
            <Container>
                <Row>
                    <div className="CardPaymentPage">
                        <div className="CardPaymentPage__main">
                            <h1 className="CardPaymentPage__main__pageHeader">Ekos Payment Page</h1>
                            <Card
                                number={number}
                                name={name}
                                expiry={expiry}
                                cvc={cvc}
                                focused={focused}
                                acceptedCards={validCards}
                                callback={this.handleCallback}
                            />
                            <form className="CardPaymentPage__main__formOfAllCreditCardInfo" ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
                                <div className="form-group CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup">
                                    <input
                                        type="tel"
                                        id="cardNumber"
                                        name="number"
                                        className="form-control CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__input"
                                        placeholder="Card Number"
                                        pattern="[\d| ]{16,22}"
                                        required
                                        onChange={this.handleInputChange}
                                        onFocus={this.handleInputFocus}
                                        onInvalid={this.handleInvalidCardNumber}
                                    />
                                    <label htmlFor="cardNumber" className="form__label CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__label">Card Number</label>
                                </div>
                                <div className="form-group CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup">
                                    <input
                                        type="text"
                                        name="name"
                                        id="personName"
                                        className="form-control CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__input"
                                        placeholder="Name"
                                        required
                                        onChange={this.handleInputChange}
                                        onFocus={this.handleInputFocus}
                                        onInvalid={this.handleInvalidName}
                                    />
                                    <label htmlFor="personName" className="form__label CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__label">Name</label>
                                </div>
                                <Row>
                                    <Col className="form-group CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup">
                                        <input
                                            type="tel"
                                            name="expiry"
                                            id="expiryDate"
                                            className="form-control CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__input"
                                            placeholder="Valid Date"
                                            pattern="\d\d/\d\d"
                                            required
                                            onChange={this.handleInputChange}
                                            onFocus={this.handleInputFocus}
                                            onInvalid={this.handleInvaliExpireDate}
                                        />
                                        <label htmlFor="expiryDate" className="form__label CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__label">Valid Date</label>
                                    </Col>
                                    <Col className="form-group CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup">
                                        <input
                                            type="tel"
                                            name="cvc"
                                            id="cvcNum"
                                            className="form-control CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__input"
                                            placeholder="CVC"
                                            pattern="\d{3,4}"
                                            required
                                            onChange={this.handleInputChange}
                                            onFocus={this.handleInputFocus}
                                            onInvalid={this.handleInvalidCVC}
                                        />
                                        <label htmlFor="cvcNum" className="form__label CardPaymentPage__main__formOfAllCreditCardInfo__cardFormGroup__label">CVC</label>
                                    </Col>
                                </Row>
                                <input type="hidden" name="issuer" value={issuer} />
                                <div className="form-actions CardPaymentPage__main__formOfAllCreditCardInfo__cardFormActions">
                                    <button className="btn btn-secondary btn-block CardPaymentPage__main__formOfAllCreditCardInfo__cardFormActions__payButton">PAY</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Row>
                <Row>
                    {formData && (
                        <div className="CardPaymentPage__main__dataPart">
                            {controlAndShapeFormData(formData).map((d, i) => <div className="CardPaymentPage__main__dataPart__inlineData" key={i}>{d} </div>)}
                        </div>
                    )}
                </Row>
                <NotificationContainer />
            </Container>
        );
    }
}

render(<App />, document.getElementById('rootApp'));
