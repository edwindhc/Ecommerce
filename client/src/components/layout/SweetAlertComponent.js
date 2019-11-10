import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

export class SweetAlertSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    render() {
        return (
            <div>
                <SweetAlert show={this.props.show} type="success" title={this.props.title ? this.props.title : "Creación Exitosa"} onConfirm={() => this.props.onConfirm()}>
                    {this.props.message ? this.props.message : "Tu producto ha sido creado y la lista actualizada"}
                </SweetAlert>
            </div>
        );
    }
}

export class SweetAlertError extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    render() {
        return (
            <div>
                <SweetAlert show={this.props.show} type="error" title={this.props.title ? this.props.title : "Ocurrio un error"} onConfirm={() => this.props.onConfirm()}>
                    {this.props.messagge ? this.props.message : 'Tu producto no ha sido creado'}
                </SweetAlert>
            </div>
        );
    }
}


export class SweetAlertWarning extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    render() {
        return (
            <div>
                <SweetAlert
                    show={this.props.show}
                    warning
                    showCancel
                    confirmBtnText={this.props.confirm ? this.props.confirm : "Si, eliminar"}
                    cancelBtnText="Cancelar"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={this.props.title ? this.props.title : "Estas seguro de eliminar?"}
                    onConfirm={() => this.props.onConfirm()}
                    onCancel={() => this.props.onCancel()}
                >
                    {this.props.message ? this.props.message : "Estas a punto de eliminar un registro, ¿Deseas continuar?"}
                </SweetAlert>
            </div>
        );
    }
}