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

const defaultOptions: FabAlertOptions = {
    id: `fab-alert-${Math.floor(new Date().getTime())}`,
    type: '',
    class: '',
    title: 'Default',
    message: 'This default alert...',
    backgroundColor: '',
    color: '',
    icon: '',
    iconText: '',
    image: '',
    imageWidth: 50,
    maxWidth: null,
    zIndex: null,
    close: true,
    closeOnEscape: false,
    closeOnClick: false,
    position: '',
    drag: true,
    balloon: false,
    pauseOnHover: true,
    progressBar: true,
    timeoutProgress: 5000,
    progressBarColor: '',
    transitionIn: 'fadeInUp', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight, flipInX
    transitionOut: 'fadeOut', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
    transitionInMobile: 'fadeInUp',
    transitionOutMobile: 'fadeOutDown',
    onOpening: function () { },
    onOpened: function () { },
    onClosing: function () { },
    onClosed: function () { },
}

const log = (msg) => console.log(msg);

class FabAlert {
    /** @var options cf : FabAlertOptions interface l.1 */
    options: FabAlertOptions;
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
    /**
     * 
     * @param {Object} options Object with custom options
     */
    constructor(options: FabAlertOptions) {
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
    /** @utils end of utils function */

    init() {
        this.createAlert();
        this.initEvents();
    }

    /**
     * Function for create node element of alert
     */
    createAlert() {
        if (!this._valueValid(this.options.title) && !this._valueValid(this.options.message)) {
            throw new Error(`Please, alert need title or message ...`);
        }
        this.$el = document.createElement('div');
        this.$el.className = `fab-alert ${this.options.transitionIn}`;
        this.$el.id = this.options.id;

        if (this._valueValid(this.options.class)) {
            this.$el.classList.add(this.options.class);
        }

        if (this._valueValid(this.options.position)) {
            this.$el.classList.add(this.options.position);
        }

        if (this._valueValid(this.options.type)) {
            this.$el.classList.add(this.options.type);
        }

        this.$elBody = document.createElement('div');
        this.$elBody.className = 'fab-alert-body';
        this.$el.appendChild(this.$elBody);

        if (this._valueValid(this.options.icon)) {
            this.$elIcon = document.createElement('span');
            this.$elIcon.innerHTML = `
                <svg id="successAnimation" class="animated" xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
                    <path id="successAnimationResult" fill="#D8D8D8" d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"/>
                    <circle id="successAnimationCircle" cx="35" cy="35" r="24" stroke="#979797" stroke-width="2" stroke-linecap="round" fill="transparent"/>
                    <polyline id="successAnimationCheck" stroke="#979797" stroke-width="2" points="23 34 34 43 47 27" fill="transparent"/>
                </svg>`;

            if (this._valueValid(this.options.iconText)) {
                this.$elIcon.title = this.options.iconText;
            }
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

        this.$body.appendChild(this.$el);
    }

    /**
     * All event handler
     */
    initEvents() {
        // Close event
        this.$elClose.removeEventListener('click', this.close, true);
        this.$elClose.addEventListener('click', this.close.bind(this), true);


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

        this.$el.classList.remove(this.options.transitionIn);
        this.$el.classList.add(this.options.transitionOut);

        setTimeout(() => {
            this.$el.remove();
        }, 2000);

        if (this.options.onClosed && typeof this.options.onClosed === 'function') {
            this.options.onClosed(this);
        }
    }

}