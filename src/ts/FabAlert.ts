interface FabAlertOptions {
    id?: string;
    type?: string;
    class?: string;
    title?: string;
    message?: string;
    backgroundColor?: string;
    color?: string;
    icon?: string | boolean;
    iconText?: string;
    image?: string;
    balloon?: boolean;
    imageWidth?: number;
    maxWidth?: null;
    zIndex?: null;
    close?: boolean;
    autoClose?: boolean;
    closeOnEscape?: boolean;
    closeOnClick?: boolean;
    position?: string;
    limitAlert?: number;
    drag?: boolean;
    pauseOnHover?: boolean;
    progressBar?: boolean;
    timeoutProgress?: number;
    progressBarColor?: string;
    transitionIn?: string, // 
    transitionOut?: string, // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
    transitionInMobile?: string,
    transitionOutMobile?: string,
    onOpening?: Function;
    onOpened?: Function;
    onClosing?: Function;
    onClosed?: Function;

}

const log = (msg) => console.log(msg);

class FabAlert {
    /** @var options cf : FabAlertOptions interface l.1 */
    options: FabAlertOptions;
    /** @var $elContainer Container for all alert */
    $elContainer: HTMLElement;
    /** @var $el Alert element */
    $el: HTMLElement;
    /** @var $elIcon Icon element of alert */
    $elIcon: HTMLElement;
    /** @var $elTitle Title element of alert */
    $elTitle: HTMLElement;
    /** @var $elBody Element body of alert */
    $elBody: HTMLElement;
    /** @var $elMsg Element message of alert */
    $elMsg: HTMLElement;
    /** @var $elClose Element close of alert */
    $elClose: HTMLElement;
    /** @var $body window body element */
    $body: HTMLElement;
    /** @var $icons svg icon available */
    $icons: Object;
    /**
     * 
     * @param {Object} options Object with custom options
     */
    constructor(options?: FabAlertOptions) {

        const defaultOptions: FabAlertOptions = {
            id: `fab-alert-${new Date().getTime()}`,
            type: '',
            class: '',
            title: '',
            message: '',
            backgroundColor: '',
            color: '',
            icon: true,
            iconText: '',
            image: '',
            imageWidth: 50,
            maxWidth: null,
            zIndex: null,
            close: true,
            autoClose: true,
            closeOnEscape: false,
            closeOnClick: true,
            position: '',
            limitAlert: 3,
            drag: true,
            balloon: false,
            pauseOnHover: true,
            progressBar: true,
            timeoutProgress: 5000,
            progressBarColor: '',
            transitionIn: 'bounceInLeft', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight, flipInX
            transitionOut: 'fadeOutRight', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
            transitionInMobile: 'fadeInUp',
            transitionOutMobile: 'fadeOutDown',
            onOpening: function () { },
            onOpened: function () { },
            onClosing: function () { },
            onClosed: function () { },
        }

        this.$icons = {
            success: `
            <svg viewBox="0 0 87 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Group-3" transform="translate(2.000000, 2.000000)">
                            <circle id="Oval-2" stroke="rgba(165, 220, 134, 1)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                                <circle  class="ui-success-circle" id="Oval-2" stroke="rgba(165, 220, 134, 1)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                                <polyline class="ui-success-path" id="Path-2" stroke="rgba(165, 220, 134, 1)" stroke-width="4" points="19 38.8036813 31.1020744 54.8046875 63.299221 28"></polyline>
                        </g>
                </g>
            </svg>`,
            info: `
            <svg id="icon-info" viewBox="0 0 32 32">
                <title>info</title>
                <path class="path1" d="M16 30.667c-8.087 0-14.667-6.58-14.667-14.667s6.58-14.667 14.667-14.667 14.667 6.58 14.667 14.667-6.58 14.667-14.667 14.667zM16 2.667c-7.352 0-13.333 5.981-13.333 13.333s5.981 13.333 13.333 13.333c7.352 0 13.333-5.981 13.333-13.333s-5.981-13.333-13.333-13.333z"></path>
                <path class="path2" d="M17.333 7.999c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333z"></path>
                <path class="path3" d="M14.667 13.335c0-0.736 0.597-1.333 1.333-1.333v0c0.736 0 1.333 0.597 1.333 1.333v10.667c0 0.736-0.597 1.333-1.333 1.333v0c-0.736 0-1.333-0.597-1.333-1.333v-10.667z"></path>
            </svg>`,
            warning: `
            <svg id="icon-warning" viewBox="0 0 32 32" fill="#e84b53">
                <title>warning</title>
                <path class="path1" d="M16 30.667c-8.087 0-14.667-6.58-14.667-14.667s6.58-14.667 14.667-14.667 14.667 6.58 14.667 14.667-6.58 14.667-14.667 14.667zM16 2.667c-7.352 0-13.333 5.981-13.333 13.333s5.981 13.333 13.333 13.333c7.352 0 13.333-5.981 13.333-13.333s-5.981-13.333-13.333-13.333z"></path>
                <path class="path2" d="M17.333 24.001c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333z"></path>
                <path class="path3" d="M17.333 18.665c0 0.736-0.597 1.333-1.333 1.333v0c-0.736 0-1.333-0.597-1.333-1.333v-10.667c0-0.736 0.597-1.333 1.333-1.333v0c0.736 0 1.333 0.597 1.333 1.333v10.667z"></path>
            </svg>`,
        };

        if (!this._valueValid(options)) {
            this.options = defaultOptions;
        } else {
            this.options = { ...defaultOptions, ...options };
        }
        this.$body = document.querySelector('body');

        this.init();
    }

    /** @utils private utils function */

    /**
     * Check if value existing, not undefined and not null
     * @param value value or multiple value to check
     * @return boolean
     */
    _valueValid(value): boolean {
        if (value && value !== '' && typeof value !== 'undefined' && value !== null) {
            return true;
        }
        return false;
    }

    /**
     * Adapt new positon to alert if add a new alert
     * and remove the last alert if alert.length > 6
     */
    _manageLimitAlert() {
        const currentAlert: NodeListOf<HTMLElement> = this.$body.querySelectorAll('.fab-alert');
        if (currentAlert.length > 1) {
            for (let i = 0; i < currentAlert.length; i++) {
                if (i !== currentAlert.length - 1) {
                    if (currentAlert.length >= this.options.limitAlert && i === 0) {
                        for (let j = 0; j < currentAlert.length - this.options.limitAlert; j++) {
                            this.close(window.event, currentAlert[j]);
                        }
                    }
                }
            }
        }
    }

    _manageDefaultContentByType() {
        switch (this.options.type.toLowerCase()) {
            case 'success':
                this.options.title = 'Success';
                break;
            case 'info':
                this.options.title = 'Info';
                break;
            case 'warning':
                this.options.title = 'Warning';
                break;
            case 'error':
                this.options.title = 'Error';
                break;
        }
    }
    /** @utils end of utils function */

    init() {
        this.createAlert();
        this.initEvents();
        this._manageLimitAlert();
    }

    /**
     * Function for create node element of alert
     */
    createAlert() {
        if (!this._valueValid(this.options.title) && !this._valueValid(this.options.message)) {
            if (this._valueValid(this.options.type)) {
                this._manageDefaultContentByType();
            } else {
                throw new Error(`Please, alert need title or message ...`);
            }
        }

        if (document.querySelector('.fab-alert-container') === null) {
            this.$elContainer = document.createElement('div');
            this.$elContainer.className = `fab-alert-container`;
            this.$body.appendChild(this.$elContainer);
        } else {
            this.$elContainer = document.querySelector('.fab-alert-container');
        }

        if (this._valueValid(this.options.position)) {
            this.$elContainer.classList.add(this.options.position);
        }

        if (this._valueValid(this.options.type)) {

        }

        this.$el = document.createElement('div');
        this.$el.className = `fab-alert ${this.options.transitionIn}`;
        this.$el.id = this.options.id;

        if (this._valueValid(this.options.class)) {
            this.$el.classList.add(this.options.class);
        }

        if (this._valueValid(this.options.type)) {
            this.$el.classList.add(this.options.type.toLowerCase());
        }

        this.$elBody = document.createElement('div');
        this.$elBody.className = 'fab-alert-body';
        this.$el.appendChild(this.$elBody);

        if (this._valueValid(this.options.icon)) {
            this.$elIcon = document.createElement('span');
            this.$elIcon.className = `fab-alert-icon`;
            this.$elIcon.innerHTML = this.$icons[this.options.type.toLowerCase()];

            if (this._valueValid(this.options.iconText)) {
                this.$elIcon.title = this.options.iconText;
            }

            this.$elBody.appendChild(this.$elIcon);
        }

        if (this._valueValid(this.options.title)) {
            this.$elTitle = document.createElement('strong');
            this.$elTitle.className = 'fab-alert-title';
            this.$elTitle.innerHTML = this.options.title;
            this.$elBody.appendChild(this.$elTitle);
        }

        if (this._valueValid(this.options.message)) {
            this.$elMsg = document.createElement('p');
            this.$elMsg.className = 'fab-alert-message';
            this.$elMsg.innerHTML = this.options.message;
            this.$elBody.appendChild(this.$elMsg);
        }

        if (this._valueValid(this.options.close)) {
            this.$elClose = document.createElement('button');
            this.$elClose.className = 'fab-alert-close';
            this.$elClose.title = 'Close';
            this.$el.appendChild(this.$elClose);
        }

        this.$elContainer.appendChild(this.$el);

        if (this.options.autoClose === true) {
            const _this = this;
            let timerClose;

            clearTimeout(timerClose);
            timerClose = setTimeout(() => {
                _this.close();
            }, 5000);
        }
    }

    /**
     * All event handler
     */
    initEvents() {
        // Close event
        if (this.options.close === true) {
            this.$elClose.removeEventListener('click', this.close, true);
            this.$elClose.addEventListener('click', this.close.bind(this), true);
        }

        // Close on click on alert
        if (this.options.closeOnClick === true) {
            this.$el.removeEventListener('click', this.close, true);
            this.$el.addEventListener('click', this.close.bind(this), true);
        }
    }

    /**
     * Function close alert
     * @param event Event 
     * @param elem elem to close if needed
     */
    close(event?: Event, elem?: HTMLElement) {
        const that = this;
        event = event || window.event;
        elem = elem || this.$el;

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (this.options.onClosing && typeof this.options.onClosing === 'function') {
            this.options.onClosing(this);
        }

        elem.classList.remove(this.options.transitionIn);
        elem.classList.add(this.options.transitionOut);

        elem.addEventListener('animationend', function () {
            this.remove();
        })

        if (this.options.onClosed && typeof this.options.onClosed === 'function') {
            this.options.onClosed(this);
        }
    }
}