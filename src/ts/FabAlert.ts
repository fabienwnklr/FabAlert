interface FabAlertOptions {
    id?: string | number;
    type?: string;
    class?: string;
    title?: string;
    message?: string;
    backgroundColor?: string;
    color?: string;
    icon?: string;
    iconText?: string;
    image?: string;
    balloon?: boolean;
    imageWidth?: number;
    maxWidth?: null;
    zIndex?: null;
    close?: boolean;
    closeOnEscape?: boolean;
    closeOnClick?: boolean;
    position?: string;
    targetFirst?: boolean;
    drag?: boolean;
    pauseOnHover?: boolean;
    progressBar?: boolean;
    timeoutProgress?: number;
    progressBarColor?: string;
    onOpening?: Function;
    onOpened?: Function;
    onClosing?: Function;
    onClosed?: Function;

}

const defaultOptions: FabAlertOptions = {
    id: `fab-alert-${Math.floor(new Date().getTime())}`,
    type: 'success',
    class: '',
    title: 'Success',
    message: '',
    backgroundColor: '',
    color: '',
    icon: 'success',
    iconText: '',
    image: '',
    imageWidth: 50,
    maxWidth: null,
    zIndex: null,
    close: true,
    closeOnEscape: false,
    closeOnClick: false,
    position: 'bottomRight',
    targetFirst: true,
    drag: true,
    balloon: false,
    pauseOnHover: true,
    progressBar: true,
    timeoutProgress: 5000,
    progressBarColor: '',
    onOpening: function () { },
    onOpened: function () { },
    onClosing: function () { },
    onClosed: function () { },
}
class FabAlert {
    options: FabAlertOptions;
    $el: HTMLElement;
    $body: HTMLElement;
    /**
     * 
     * @param {Object} options Object with custom options
     */
    constructor(options: FabAlertOptions) {
        this.options = { ...defaultOptions, ...options };
        this.$body = document.querySelector('body');

        this.createAlert();
        console.log('Constructed');
    }

    /** @utils private utils function */

    /** @utils end of utils function */
    init() {
        console.log('Init');
    }

    /**
     * Function for create node element of alert
     */
    createAlert() {
        let alert = document.createElement('div');
        alert.className = 'fab-alert';
        if (this.options && this.options.class) {
            alert.classList.add(this.options.class);
        }

        let body = document.createElement('div');
        body.className = 'fab-alert-body';
        alert.appendChild(body);

        if (this.options.title && this.options.title !== undefined && this.options.title !== null) {
            let title = document.createElement('strong');
            title.className = 'fab-alert-title';
            title.innerHTML = this.options.title;
            body.appendChild(title);
        }

        if (this.options.message && this.options.message !== undefined && this.options.message !== null) {
            let message = document.createElement('p');
            message.className = 'fab-alert-message';
            message.innerHTML = this.options.message;
            body.appendChild(message);
        }

        if (this.options.close && this.options.close !== undefined && this.options.close !== null) {
            let close = document.createElement('button');
            close.className = 'fab-alert-close';
            body.appendChild(close);
        }

        this.$body.appendChild(alert);

        this.$el = alert
    }
}