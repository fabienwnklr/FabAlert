interface FabAlertOptions {
    id?: string;
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

const log = (msg) => console.log(msg);
class FabAlert {
    /**
     * @var options cf : FabAlertOptions interface l.1
     */
    options: FabAlertOptions;
    /**
     * @var $el Alert element 
     */
    $el: HTMLElement;
    /**
     * @var $elTitle Title element of alert
     */
    $elTitle: HTMLElement;
    /**
     * @var $elBody Element body of alert
     */
    $elBody: HTMLElement;
    /**
     * @var $elMsg Element message of alert
     */
    $elMsg: HTMLElement;
    /**
     * @var $elClose Element close of alert
     */
    $elClose: HTMLElement;
    /**
     * @var $body window body element
     */
    $body: HTMLElement;
    /**
     * 
     * @param {Object} options Object with custom options
     */
    constructor(options: FabAlertOptions) {
        this.options = { ...defaultOptions, ...options };
        this.$body = document.querySelector('body');

        this.init();
    }

    /** @utils private utils function */

    /** @utils end of utils function */
    init() {
        this.createAlert();
        this.initEvents();
    }

    /**
     * Function for create node element of alert
     */
    createAlert() {
        this.$el = document.createElement('div');
        this.$el.className = 'fab-alert';
        this.$el.id = this.options.id;
        if (this.options && this.options.class) {
            this.$el.classList.add(this.options.class);
        }

        this.$elBody = document.createElement('div');
        this.$elBody.className = 'fab-alert-body';
        this.$el.appendChild(this.$elBody);

        if (this.options.title && this.options.title !== undefined && this.options.title !== null) {
            this.$elTitle = document.createElement('strong');
            this.$elTitle.className = 'fab-alert-title';
            this.$elTitle.innerHTML = this.options.title;
            this.$elBody.appendChild(this.$elTitle);
        }

        if (this.options.message && this.options.message !== undefined && this.options.message !== null) {
            this.$elMsg = document.createElement('p');
            this.$elMsg.className = 'fab-alert-message';
            this.$elMsg.innerHTML = this.options.message;
            this.$elBody.appendChild(this.$elMsg);
        }

        if (this.options.close && this.options.close !== undefined && this.options.close !== null) {
            this.$elClose = document.createElement('button');
            this.$elClose.className = 'fab-alert-close';
            this.$elClose.title = 'Close';
            this.$el.appendChild(this.$elClose);
        }

        this.$body.appendChild(this.$el);
    }

    /**
     * All event handler
     */
    initEvents() {
        // this.$elClose.removeEventListener('click', this.close.bind(this));
        this.$elClose.addEventListener('click', this.close.bind(this));
    }

    close() {
        if (window.event) {
            const event = window.event;

            event.preventDefault();
            event.stopPropagation();
        }
        if (this.options.onClosing && typeof this.options.onClosing === 'function') {
            this.options.onClosing(this);
        }
        
        this.$el.remove();
    }

}