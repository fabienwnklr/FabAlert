interface FabAlertOptions {
    id?: string;
    type?: string;
    class?: string;
    title?: string;
    message?: string;
    overlay?: boolean;
    backgroundColor?: string;
    color?: string;
    icon?: string | boolean;
    iconText?: string;
    maxWidth?: null;
    zIndex?: null;
    close?: boolean;
    displayMode: number | string;
    autoClose?: boolean;
    closeOnEscape?: boolean;
    closeOnClick?: boolean;
    position?: string;
    limitAlert?: number;
    pauseOnHover?: boolean;
    progressBar?: boolean;
    timeout?: number;
    progressBarColor?: string;
    transitionIn?: string, // 
    transitionOut?: string, // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
    transitionInMobile?: string,
    transitionOutMobile?: string,
    onShow?: Function;
    onHide?: Function;
    onClosing?: Function;
    onClosed?: Function;
}

const log = (msg) => console.log(msg);
const $ = (selector: string): HTMLElement => document.querySelector(selector);

class FabAlert {
    /** @var options cf : FabAlertOptions interface l.1 */
    options: FabAlertOptions;
    /** @var $elContainer Container for all alert */
    $elContainer: HTMLElement;
    /** @var $overlay */
    $overlay: HTMLElement;
    /** @var $el Alert element */
    $el: HTMLElement;
    /** @var $elIcon Icon element of alert */
    $elIcon: HTMLElement;
    /** @var $elTitle Title element of alert */
    $elTitle: HTMLElement;
    /** @var $elBody Body element of alert */
    $elBody: HTMLElement;
    /** @var $elMsg  Message element of alert */
    $elMsg: HTMLElement;
    /** @var $elClose  Close element of alert */
    $elClose: HTMLElement;
    /** @var $elProgress  Progress element bar */
    $elProgress: HTMLElement;
    /** @var $body window body element */
    $body: HTMLElement;
    /** @var $icons svg icon available */
    $icons: Object;
    /** @var $utils Utils constante for dev ops */
    /**
     * 
     * @var Utils 
     */
    utils = {
        IS_MOBILE: false as boolean,
        ACCEPTS_TOUCH: false as boolean,
        POSITIONS: [] as Array<string>,
        TRANSITION_IN: [] as Array<string>,
        TRANSITION_OUT: [] as Array<string>,
        IS_CHROME: false as boolean,
    };
    isPaused: boolean = false;
    timerTimeout: number;
    progressObj = {
        hideEta: null as number,
        maxHideTime: null as number,
        currentTime: 0 as number,
        el: null as HTMLElement,
        updateProgress: null as Function
    };
    /**
     * 
     * @param {FabAlertOptions}
     */
    constructor(options?: FabAlertOptions) {

        const defaultOptions: FabAlertOptions = {
            id: `fab-alert-${new Date().getTime()}`,
            type: 'default',
            class: '',
            title: '',
            message: '',
            overlay: false,
            backgroundColor: '',
            color: '',
            icon: true,
            iconText: '',
            maxWidth: null,
            zIndex: null,
            close: true,
            displayMode: '', // Set limit alert to 1
            autoClose: true,
            closeOnEscape: false,
            closeOnClick: true,
            position: 'bottomRight',
            limitAlert: 1,
            pauseOnHover: true,
            progressBar: true,
            timeout: 3000,
            progressBarColor: '',
            transitionIn: 'bounceInLeft', // bounceInLeft, bounceInRight, bounceInUp, bounceInDown, fadeIn, fadeInDown, fadeInUp, fadeInLeft, fadeInRight, flipInX
            transitionOut: 'fadeOutRight', // fadeOut, fadeOutUp, fadeOutDown, fadeOutLeft, fadeOutRight, flipOutX
            transitionInMobile: 'fadeInUp',
            transitionOutMobile: 'fadeOutDown',
            onShow: function () { },
            onHide: function () { },
            onClosing: function () { },
            onClosed: function () { },
        }

        this.utils = {
            IS_MOBILE: (/Mobi/.test(navigator.userAgent)) ? true : false,
            ACCEPTS_TOUCH: 'ontouchstart' in document.documentElement,
            POSITIONS: ['bottomRight', 'bottomLeft', 'bottomCenter', 'topRight', 'topLeft', 'topCenter', 'center'],
            TRANSITION_IN: ['bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceInDown', 'fadeIn', 'fadeInDown', 'fadeInUp', 'fadeInLeft', 'fadeInRight', 'flipInX'],
            TRANSITION_OUT: ['fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight', 'flipOutX'],
            IS_CHROME: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
        };
        // Default icons
        this.$icons = {
            success: `
            <svg id="icon-success" viewBox="0 0 32 32" width="30" height="30">
                <title>success</title>
                <path class="path1" d="M15.999 30.481c-8.087 0-14.667-6.58-14.667-14.667s6.58-14.667 14.667-14.667 14.667 6.58 14.667 14.667c0 8.088-6.58 14.667-14.667 14.667zM15.999 2.481c-7.352 0-13.333 5.981-13.333 13.333s5.981 13.333 13.333 13.333c7.352 0 13.333-5.981 13.333-13.333s-5.981-13.333-13.333-13.333z"></path>
                <path class="path2" d="M15.056 19.587c0.521 0.521 0.521 1.365 0 1.885v0c-0.521 0.521-1.365 0.521-1.885 0l-5.657-5.657c-0.521-0.521-0.521-1.365 0-1.885v0c0.521-0.521 1.365-0.521 1.885 0l5.657 5.657z"></path>
                <path class="path3" d="M15.056 21.472c-0.521 0.521-1.365 0.521-1.885 0v0c-0.521-0.521-0.521-1.365 0-1.885l9.428-9.428c0.521-0.521 1.365-0.521 1.885 0v0c0.521 0.521 0.521 1.365 0 1.885l-9.428 9.428z"></path>
            </svg>`,
            info: `
            <svg id="icon-info" viewBox="0 0 32 32" width="30" height="30">
                <title>info</title>
                <path class="path1" d="M16 30.667c-8.087 0-14.667-6.58-14.667-14.667s6.58-14.667 14.667-14.667 14.667 6.58 14.667 14.667-6.58 14.667-14.667 14.667zM16 2.667c-7.352 0-13.333 5.981-13.333 13.333s5.981 13.333 13.333 13.333c7.352 0 13.333-5.981 13.333-13.333s-5.981-13.333-13.333-13.333z"></path>
                <path class="path2" d="M17.333 7.999c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333z"></path>
                <path class="path3" d="M14.667 13.335c0-0.736 0.597-1.333 1.333-1.333v0c0.736 0 1.333 0.597 1.333 1.333v10.667c0 0.736-0.597 1.333-1.333 1.333v0c-0.736 0-1.333-0.597-1.333-1.333v-10.667z"></path>
            </svg>`,
            warning: `
            <svg id="icon-warning" viewBox="0 0 32 32" fill="#e84b53" width="30" height="30">
                <title>warning</title>
                <path class="path1" d="M16 30.667c-8.087 0-14.667-6.58-14.667-14.667s6.58-14.667 14.667-14.667 14.667 6.58 14.667 14.667-6.58 14.667-14.667 14.667zM16 2.667c-7.352 0-13.333 5.981-13.333 13.333s5.981 13.333 13.333 13.333c7.352 0 13.333-5.981 13.333-13.333s-5.981-13.333-13.333-13.333z"></path>
                <path class="path2" d="M17.333 24.001c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333c0-0.736 0.597-1.333 1.333-1.333s1.333 0.597 1.333 1.333z"></path>
                <path class="path3" d="M17.333 18.665c0 0.736-0.597 1.333-1.333 1.333v0c-0.736 0-1.333-0.597-1.333-1.333v-10.667c0-0.736 0.597-1.333 1.333-1.333v0c0.736 0 1.333 0.597 1.333 1.333v10.667z"></path>
            </svg>`,
            error: `
            <svg id="icon-error" viewBox="0 0 32 32" width="30" height="30">
                <title>error</title>
                <path class="path1" d="M16 30.667c-8.087 0-14.667-6.58-14.667-14.667s6.58-14.667 14.667-14.667 14.667 6.58 14.667 14.667-6.58 14.667-14.667 14.667zM16 2.667c-7.352 0-13.333 5.981-13.333 13.333s5.981 13.333 13.333 13.333c7.352 0 13.333-5.981 13.333-13.333s-5.981-13.333-13.333-13.333z"></path>
                <path class="path2" d="M22.6 20.715c0.521 0.521 0.521 1.365 0 1.885v0c-0.521 0.521-1.365 0.521-1.885 0l-11.313-11.313c-0.521-0.521-0.521-1.365 0-1.885v0c0.521-0.521 1.365-0.521 1.885 0l11.313 11.313z"></path>
                <path class="path3" d="M20.715 9.4c0.521-0.521 1.365-0.521 1.885 0v0c0.521 0.521 0.521 1.365 0 1.885l-11.313 11.313c-0.521 0.521-1.365 0.521-1.885 0v0c-0.521-0.521-0.521-1.365 0-1.885l11.313-11.313z"></path>
            </svg>`
        };

        if (!this._valueValid(options)) {
            this.options = defaultOptions;
        } else {
            this.options = { ...defaultOptions, ...options };
        }
        this.$body = $('body');

        // We reassign with biding for do not loose this context
        this.close = this.close.bind(this);
        this.resumeProgress = this.resumeProgress.bind(this);
        this.pauseProgress = this.pauseProgress.bind(this);

        this.init();
    }

    /** @utils private utils function */

    /**
     * Check if value existing, not undefined and not null
     * @param value value or multiple value to check
     * @return {boolean}
     */
    _valueValid(value): Boolean {
        if (value !== '' && typeof value !== 'undefined' && value !== null) {
            return true;
        }
        return false;
    }

    /**
     * Adapt new positon to alert if add a new alert
     * and remove the last alert if alert.length > 6
     */
    _manageLimitAlert() {
        const currentAlert: NodeListOf<HTMLElement> = this.$body.querySelectorAll(`.fab-alert-container.${this.options.position} .fab-alert`);
        if (currentAlert.length > 1) {
            for (let i = 0; i < currentAlert.length; i++) {
                if (i !== currentAlert.length - 1) {
                    if (currentAlert.length >= this.options.limitAlert) {
                        if (this.options.position.toLowerCase().search('top') === -1) {
                            for (let j = 0; j < currentAlert.length - this.options.limitAlert; j++) {
                                this.close(null, currentAlert[j]);
                            }
                        } else {
                            for (let j = currentAlert.length; j > this.options.limitAlert; j--) {
                                this.close(null, currentAlert[j - 1]);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Set default title for alert if not title setting
     */
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
            default:
                this.options.title = 'Default';
                break
        }
    }

    _elementIsVisible(elem: HTMLElement): Boolean {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }

    _checkValidNumber(val: Number): Boolean {
        if (val && typeof val === 'number') {
            return true;
        }
        return false;
    }

    _manageDisplayMode() {
        if (this.options.displayMode === 1 || this.options.displayMode === 'once') {
            if (document.querySelectorAll('.fab-alert').length > 0) {
                return;
            }
        } else if (this.options.displayMode === 2 || this.options.displayMode === 'replace') {
            this.options.limitAlert = 1;
        }
    }

    _checkInUtils() {
        if (!this.utils.POSITIONS.includes(this.options.position)) {
            throw new Error(`Be careful, you're position setting it's not available, please check valable position : ${this.utils.POSITIONS.toString()}`)
        } else if (!this.utils.TRANSITION_IN.includes(this.options.transitionIn)) {
            throw new Error(`Be careful, you're transitionIn setting it's not available, please check valable transitionIn : ${this.utils.TRANSITION_IN.toString()}`)
        } else if (!this.utils.TRANSITION_IN.includes(this.options.transitionInMobile)) {
            throw new Error(`Be careful, you're transitionIn setting it's not available, please check valable transitionIn : ${this.utils.TRANSITION_IN.toString()}`)
        } else if (!this.utils.TRANSITION_OUT.includes(this.options.transitionOut)) {
            throw new Error(`Be careful, you're transitionOut setting it's not available, please check valable transitionOut : ${this.utils.TRANSITION_OUT.toString()}`)
        } else if (!this.utils.TRANSITION_OUT.includes(this.options.transitionOutMobile)) {
            throw new Error(`Be careful, you're transitionOut setting it's not available, please check valable transitionOut : ${this.utils.TRANSITION_OUT.toString()}`)
        }
    }
    /** @utils end of utils function */

    init() {
        // Check validity of params 
        this._checkInUtils();
        this._manageDisplayMode();
        this.createAlert();
        this.initEvents();
        this.show();
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
        // Adapt transition to position
        if (this._valueValid(this.options.position)) {
            if (this.options.position.toLowerCase().search('left') !== - 1 && this.options.transitionIn.toLowerCase().search('left') !== -1) {
                const transitionInName = this.options.transitionIn.split('Left');
                const transitionOutName = this.options.transitionOut.split('Right');
                this.options.transitionIn = `${transitionInName[0]}Right`;
                this.options.transitionOut = `${transitionOutName[0]}Left`;
            }
        }
        // End of adapt transition to position

        // Overlay element
        if (this.options.overlay === true) {
            this.$overlay = document.createElement('div');
            this.$overlay.className = 'fab-alert-overlay fadeIn';
            this.$body.appendChild(this.$overlay);
        }

        // Container alert element
        if (!this._valueValid($(`.fab-alert-container.${this.options.position}`))) {
            this.$elContainer = document.createElement('div');
            this.$elContainer.className = `fab-alert-container ${this.options.position}`;
            this.$body.appendChild(this.$elContainer);
        } else {
            this.$elContainer = $(`.fab-alert-container.${this.options.position}`);
        }
        // End of container alert

        // Alert element
        this.$el = document.createElement('div');
        this.$el.className = `fab-alert hidden ${ this.utils.IS_MOBILE ? this.options.transitionInMobile :this.options.transitionIn}`;
        this.$el.id = this.options.id;

        if (this.options.closeOnClick === true) {
            this.$el.style.cursor = 'pointer';
        }

        if (this._valueValid(this.options.class)) {
            this.$el.classList.add(this.options.class);
        }

        if (this._valueValid(this.options.type)) {
            this.$el.classList.add(this.options.type.toLowerCase());
        }

        if (this._valueValid(this.options.maxWidth)) {
            this.$elContainer.style.maxWidth = `${this.options.maxWidth}px`;
            this.$el.style.maxWidth = `${this.options.maxWidth}px`;
        }

        if (this._valueValid(this.options.zIndex) && this._checkValidNumber(Number(this.options.zIndex))) {
            this.$el.style.zIndex = this.options.zIndex;
        }
        // End of element

        // Body element
        this.$elBody = document.createElement('div');
        this.$elBody.className = 'fab-alert-body';
        this.$el.appendChild(this.$elBody);

        if (this._valueValid(this.options.icon) && this._valueValid(this.$icons[this.options.type.toLowerCase()])) {
            this.$elIcon = document.createElement('span');
            this.$elIcon.className = `fab-alert-icon`;
            this.$elIcon.innerHTML = this.$icons[this.options.type.toLowerCase()] || this.options.icon;

            if (this._valueValid(this.options.iconText)) {
                this.$elIcon.title = this.options.iconText;
            }

            this.$elBody.appendChild(this.$elIcon);
        }
        // End of body element

        // Title element
        if (this._valueValid(this.options.title)) {
            this.$elTitle = document.createElement('strong');
            this.$elTitle.className = 'fab-alert-title';
            this.$elTitle.innerHTML = this.options.title;
            this.$elBody.appendChild(this.$elTitle);
        }
        // End of title element

        // Message element
        if (this._valueValid(this.options.message)) {
            this.$elMsg = document.createElement('p');
            this.$elMsg.className = 'fab-alert-message';
            this.$elMsg.innerHTML = this.options.message;
            this.$elBody.appendChild(this.$elMsg);
        }
        // End of message element

        // Close element
        if (this._valueValid(this.options.close)) {
            this.$elClose = document.createElement('button');
            this.$elClose.className = 'fab-alert-close';
            this.$elClose.title = 'Close';
            this.$el.appendChild(this.$elClose);
        }
        // End of close element

        // Progress bar element
        if (this.options.progressBar === true && this.options.autoClose === true) {
            this.$elProgress = document.createElement('div');
            this.$elProgress.className = `fab-alert-progress`;

            let div: HTMLElement = document.createElement('div');

            if (this._valueValid(this.options.progressBarColor)) {
                div.style.backgroundColor = this.options.progressBarColor;
            }
            this.$elProgress.appendChild(div);

            this.$el.appendChild(this.$elProgress);

        }

        // Adapt position container
        if (this.options.position.toLowerCase().search('top') !== -1) {
            this.$elContainer.prepend(this.$el);
        } else {
            this.$elContainer.appendChild(this.$el);
        }


        // Color handle
        if (this._valueValid(this.options.backgroundColor)) {
            this.$el.style.backgroundColor = this.options.backgroundColor;
        }

        if (this._valueValid(this.options.color)) {
            this.$el.style.color = this.options.color;
            let icon = this.$elIcon.querySelector('svg');
            if (icon !== null) {
                icon.style.fill = this.options.color;
            }
        }
    }

    /**
     * All event handler
     */
    initEvents() {
        // Close event
        if (this.options.close === true) {
            this.$elClose.removeEventListener('click', this.close, true);
            this.$elClose.addEventListener('click', this.close, true);
        }

        // Close on click on alert
        if (this.options.closeOnClick === true) {
            this.$el.removeEventListener('click', this.close, true);
            this.$el.addEventListener('click', this.close, true);
        }

        if (this.options.progressBar === true && this.options.autoClose === true) {
            this.startProgress();
        } else if (this.options.progressBar === false && (this.options.autoClose === true || (this._valueValid(this.options.timeout && this._checkValidNumber(Number(this.options.timeout)))))) {
            this.startProgress(null, false);
        }

        if (this.options.pauseOnHover === true) {
            this.$el.removeEventListener('mouseenter', this.pauseProgress, true);
            this.$el.addEventListener('mouseenter', this.pauseProgress);

            this.$el.removeEventListener('mouseleave', this.resumeProgress, true);
            this.$el.addEventListener('mouseleave', this.resumeProgress);
        }

        if (this.options.closeOnEscape === true) {
            window.removeEventListener('keyup', this.close, true);
            window.addEventListener('keyup', this.close);
        }
    }

    show() {
        if (this.utils.IS_MOBILE) {
            this.$el.classList.remove(this.options.transitionOutMobile);
            this.$el.classList.add(this.options.transitionInMobile);
        } else {
            this.$el.classList.remove(this.options.transitionOut);
            this.$el.classList.add(this.options.transitionIn);
        }

        try {
            const event = new CustomEvent('shown.fabAlert', { detail: this.options, bubbles: true, cancelable: true });
            document.dispatchEvent(event);
        } catch (error) {
            console.warn(error);
        }
        if (this._valueValid(this.options.onShow) && typeof this.options.onShow === 'function') {
            this.options.onShow(this);
        }
    }

    hide() {
        if (this.utils.IS_MOBILE) {
            this.$el.classList.remove(this.options.transitionInMobile);
            this.$el.classList.add(this.options.transitionOutMobile);
        } else {
            this.$el.classList.remove(this.options.transitionIn);    
            this.$el.classList.add(this.options.transitionOut);
        }

        try {
            const event = new CustomEvent('hidden.fabAlert', { detail: this.options, bubbles: true, cancelable: true });
            document.dispatchEvent(event);
        } catch (error) {
            console.warn(error);
        }
    }

    /**
     * Function close alert
     * @param event Event 
     * @param elem elem to close if needed
     */
    close(event?: MouseEvent | KeyboardEvent, elem?: HTMLElement) {
        if (this.timerTimeout && !elem) {
            clearInterval(this.timerTimeout);
        }

        const _this = this;
        elem = elem || this.$el;

        if (event instanceof KeyboardEvent && event.type === 'keyup' && event.key !== 'Escape') {
            return;
        }

        if (this._valueValid(this.options.onClosing) && typeof this.options.onClosing === 'function') {
            this.options.onClosing(event, this);
        }

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (this.utils.IS_MOBILE) {
            elem.classList.remove(this.options.transitionInMobile);
            elem.classList.add(this.options.transitionOutMobile);
        } else {
            elem.classList.remove(this.options.transitionIn);
            elem.classList.add(this.options.transitionOut);
        }

        if (this.$overlay) {
            this.$overlay.classList.remove('fadeIn');
            this.$overlay.classList.add('fadeOut');

            this.$overlay.addEventListener('animationend', function (event) {
                this.remove();
            })
        }
        elem.addEventListener('animationend', function (event) {
            this.remove();
            if (_this._valueValid(_this.options.onClosed) && typeof _this.options.onClosed === 'function') {
                _this.options.onClosed(event, _this)
            }
        });
    }


    /**
     * 
     * @param {Number} timer Timer for progress bar
     * @param {Boolean} showProgressBar For adding dif not exist progress bar
     */
    startProgress(timer?: Number, showProgressBar?: Boolean) {
        if (!this._valueValid(showProgressBar)) showProgressBar = true;
        if (!this._elementIsVisible(this.$el)) return;
        if (!this.$elProgress && showProgressBar) {
            this.$elProgress = document.createElement('div');
            let div: HTMLElement = document.createElement('div');

            this.$elProgress.className = 'fab-modal-progress-bar';
            this.$elProgress.appendChild(div);

            this.$el.appendChild(this.$elProgress);

            this.options.progressBar = true;
        }

        if (!this._checkValidNumber(timer) && !this._checkValidNumber(this.options.timeout)) {
            throw new TypeError(`Please enter a valid number for progress timeout, actual value is : ${timer}`);
        }

        if (!this._valueValid(timer)) {
            timer = this.options.timeout;
        }

        this.isPaused = false;
        var _this = this;

        this.progressObj = {
            hideEta: null,
            maxHideTime: null,
            currentTime: new Date().getTime(),
            el: this.$el.querySelector('.fab-alert-progress > div'),
            updateProgress: function updateProgress() {
                if (!_this.isPaused) {
                    _this.progressObj.currentTime = _this.progressObj.currentTime + 10;

                    var percentage = ((_this.progressObj.hideEta - (_this.progressObj.currentTime)) / _this.progressObj.maxHideTime) * 100;
                    if (showProgressBar) _this.progressObj.el.style.width = percentage + '%';
                    if (percentage < 0) {
                        _this.close();
                    }
                }
            }
        };
        if (timer > 0) {
            this.progressObj.maxHideTime = Number(timer);
            this.progressObj.hideEta = new Date().getTime() + this.progressObj.maxHideTime;
            this.timerTimeout = setInterval(this.progressObj.updateProgress, 10);
        }
    }

    pauseProgress() {
        if (window.event) {
            window.event.preventDefault();
            window.event.stopPropagation();
        }
        this.isPaused = true;
    }

    resumeProgress() {
        if (window.event) {
            window.event.preventDefault();
            window.event.stopPropagation();
        }

        this.isPaused = false;
    }
}