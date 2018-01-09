(function ($) {

    function format(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[parseInt(number) + 1] !== 'undefined' ? args[parseInt(number) + 1] : match;
        });
    }

    function objectifyForm(formArray) {//serialize data function
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    }

    function is_undefined(value) {
        return typeof value === "undefined";
    }

    function init(options) {
        // Default options
        var settings = $.extend({
            icons: ["bell-alt", "commenting-o", "mail"],
            selectedIcon: "bell-alt",
            reminderText: "Напомнить о сайте",
            form: " <div class='m-reminder__form-close'>✖</div> " +
            "<h4 class='text-center m-reminder__form-title'>Ваши контактные данные</h4>" +
            "  <div class='form-group row col-xs-12 m-reminder__form-group'>" +
            "    <label class='col-xs-3 m-reminder__form-label'>Почта</label>" +
            "    <input type='email' class='col-xs-9 m-reminder__form-input' name='email'>" +
            "</div>" +
            "  <div class='row col-xs-12 m-reminder__form-separator'>" +
            "    <div class='col-xs-5 m-no-padding m-reminder__form-separator-line m-reminder__form-separator-line_left'></div>" +
            "    <div class='col-xs-2 m-no-padding m-reminder__form-separator-text'>ИЛИ</div>" +
            "    <div class='col-xs-5 m-no-padding m-reminder__form-separator-line m-reminder__form-separator-line_right'></div>" +
            "  </div>" +
            "  <div class='form-group row col-xs-12 m-reminder__form-group'>   " +
            "    <label class='col-xs-3 m-reminder__form-label'>Телефон</label>" +
            "    <input type='email' class='col-xs-9 m-reminder__form-input' name='phone'>" +
            "  </div>" +
            "<div class='col-xs-12 m-reminder__form-error m-reminder__form-error_contact'>Введите Ваш телефон или почту!</div>" +
            "  <div class='row  m-reminder__form-separator_full'>" +
            "    <div class='col-xs-12 m-no-padding m-reminder__form-separator-line m-reminder__form-separator-line_dashed'></div>" +
            "  </div>" +
            "  <div class='form-group row col-xs-12 m-reminder__form-group m-reminder__form-group_time hidden-xs'>" +
            "    <label class='col-xs-3 m-reminder__form-label m-reminder__form-label-time'>Время</label>" +
            "    <div class='input-group date col-xs-9'>" +
            "                    <input type='text' name='time_pc' class='m-reminder__form-input col-xs-12' />" +
            "                    <span class='input-group-addon'>" +
            "                        <span class='glyphicon glyphicon-calendar'></span>" +
            "                    </span>" +
            "                </div>" +
            "  </div>" +
            "  <div class='form-group row col-xs-12 m-reminder__form-group m-reminder__form-group_time visible-xs'>" +
            "    <label class='col-xs-3 m-reminder__form-label m-reminder__form-label-time'>Время</label>" +
            "    <input type='datetime-local' name='time_mobile' class='m-reminder__form-input col-xs-9' />" +
            "  </div>" +
            "<div class='col-xs-12 m-reminder__form-error m-reminder__form-error_time'>Введите время напоминания!</div>" +
            "  <div class='form-group row col-xs-12 m-reminder__form-group m-reminder__form-group_last'>" +
            "    <label class='col-xs-12 m-reminder__form-label m-reminder__form-text-area-label'>Добавить комментарий</label>" +
            "    <textarea class='m-reminder__form-input m-reminder__form-text-area col-xs-12' name='comment' rows='1' wrap='soft' maxlength='140'></textarea>" +
            "  </div>" +
            "  <div class='form-group row col-xs-12 m-reminder__form-submit'>       " +
            "    <button class='form-control col-xs-12 m-reminder__form-input'>Отправить</button>" +
            "  </div>",
            activeDelay: 200,
            reminderIconSize: 60,
            reminderFullSize: 320,
            position: {
                bottom: '10%',
                right: '10%'
            },
            ajaxUrl: "",
            ajaxMethod: "POST",
            mobileWidth: 425,
            mobileHeight: 500,
            formBorderRadius: 20,
            reInitDelay: 600,
            iconDelay: 2500,
            reminderAnimationDelay: 3000,
            reminderAnimation: true,
            zIndex: 999,
            submitCallback: function (mReminder, data) {
                var errorContact = mReminder.find('.m-reminder__form-error_contact');
                var timeContact = mReminder.find('.m-reminder__form-error_time');
                var haveErrors = false;
                if (data.email || data.phone) {
                    errorContact.removeClass(activeFormErrorClass);
                } else {
                    errorContact.addClass(activeFormErrorClass);
                    haveErrors = true;
                }
                if (data.time_pc || data.time_mobile) {
                    timeContact.removeClass(activeFormErrorClass);
                } else {
                    timeContact.addClass(activeFormErrorClass);
                    haveErrors = true;
                }
                if (haveErrors) {
                    mReminderForm.find('.m-reminder__form-submit button').blur();
                }
                return !haveErrors;
            },
            ajaxCallback: function (mReminder, data) {
                mReminder.find('.m-reminder__form input').each(function () {
                    jQuery(this).val("");
                });
                mReminder.find('.m-reminder__form button').blur();

                return true;
            },
            onInitForm: function (mReminderForm) {
                mReminderForm.find('.input-group.date').datetimepicker({
                    locale: 'ru'
                });
                var textArea = mReminderForm.find('.m-reminder__form-text-area');
                mReminderForm.find('.m-reminder__form-text-area-label').on("click touchdown", function () {
                    if (!textArea.hasClass(activeTextAreaClass)) {
                        textArea.fadeIn(300);
                        textArea.addClass(activeTextAreaClass);
                    }
                });
                textArea.textareaAutoSize();
                textArea.on('keyup', function () {
                    textArea.focus();
                });
            }
        }, options);
        var hideIconClass = "m-reminder__icon_hide";
        var activeIconClass = "m-reminder__icon_active";
        var activeClass = "m-reminder_active";
        var activeFormClass = "m-reminder__form_active";
        var activeFormErrorClass = "m-reminder__form-error_active";
        var activeTextAreaClass = "m-reminder__form-text-area_active";
        var animationFinishFormClass = "m-reminder__form_animation-finish";
        var mNoScrollClass = "m-no-scroll";
        var circleAnimationClass = "m-reminder__reminder-circle_animation";
        var circleBorderAnimationClass = "m-reminder__reminder-circle-border_animation";

        var iconTemplate = "";
        var selectedIndex = 0;
        if ($.inArray(settings.selectedIcon, settings.icons) === -1 && settings.icons.length > 0)
            settings.selectedIcon = settings.icons[selectedIndex];
        for (var iconIndex in settings.icons) {
            var icon = settings.icons[iconIndex];
            var hide = "";
            if (icon !== settings.selectedIcon) hide = hideIconClass;
            else selectedIndex = iconIndex;
            iconTemplate += "<i class=\"m-reminder__icon m-reminder__icon_" + icon + " " + hide + "\" aria-hidden=\"true\"></i>"
        }

        var template = $.parseHTML(
            "<div id='m_reminder'>" +
                "<div class='m-mobile-overlay'></div>" +
                "<div class='m-reminder'>" +
                    "<div class='m-reminder__form'>" +
                        "<form class='m-reminder__form-inner col-xs-12'>" +
                            settings.form +
                        "</form>" +
                    "</div>" +
                    "<div class='m-reminder__inner'>" +
                        "<div class='m-reminder__reminder-text'>" +
                            settings.reminderText +
                        "</div>" +
                        "<div class='m-reminder__reminder'>" +
                            "<div class='m-reminder__reminder-circle'></div>" +
                            "<div class='m-reminder__reminder-circle-border'></div>" +
                            "<div class='m-reminder__icons'> " +
                                iconTemplate +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>");
        var mTemplate = jQuery(template);
        var mOverlay = mTemplate.find('.m-mobile-overlay');
        var mReminder = mTemplate.find('.m-reminder');
        var mReminderForm = mReminder.find('.m-reminder__form');
        var mReminderInner = mReminder.find('.m-reminder__inner');
        var mReminderText = mReminderInner.find('.m-reminder__reminder-text');
        var mReminderReminder = mReminderInner.find('.m-reminder__reminder');
        var mReminderIcons = mReminderReminder.find('.m-reminder__icons');
        var mReminderCircle = mReminderReminder.find('.m-reminder__reminder-circle');
        var mReminderCircleBorder = mReminderReminder.find('.m-reminder__reminder-circle-border');
        var mReminderFormClose = mReminderForm.find('.m-reminder__form-close');

        var isOnLeft, isOnTop, isSmallWidth, isSmallHeight;
        var originalWidth = settings.reminderFullSize;

        var iconInterval = null;
        if (settings.icons.length > 1) iconInterval = startIconInterval();
        var reminderAnimation = null;
        var activateTimer = null;
        var transitionEventFormOpen = function (event) {
            mReminderForm.addClass(animationFinishFormClass);
            mReminderForm.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", this);
        };
        var transitionEventFormClose = function (event) {
            if (!is_undefined(event) && ($(event.target).hasClass(activeFormClass) || !$(event.target).hasClass('m-reminder__form'))) return;
            deactivate();
            mReminderForm.removeClass(animationFinishFormClass);
        };
        var transitionEventReminderOpen = function (event) {
            if (!mReminder.hasClass(activeClass)) return;
            if (!mReminderForm.hasClass(activeFormClass)) mReminderForm.removeClass(animationFinishFormClass);
            mReminderForm.addClass(activeFormClass);
            mReminderForm.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", transitionEventFormOpen);
        };
        var originalPosition = $.extend({}, settings.position);

        setPosition();

        mReminderForm.find('.m-reminder__form-submit button').on('click touchstart', function (event) {
            event.preventDefault();
            var data = mReminderForm.find('form').serializeArray();
            if (settings.submitCallback(mReminder, objectifyForm(data))) {
                $.ajax({
                    url: settings.ajaxUrl,
                    method: settings.ajaxMethod,
                    data: data
                }).always(function(data) {
                    if (settings.ajaxCallback(mReminder, data)) close();
                });
            }
        });

        settings.onInitForm(mReminderForm);

        mReminder.css('z-index', settings.zIndex);
        mReminder.find('.m-reminder__icons, .m-reminder, .m-reminder__reminder-text, .m-reminder__form, .m-reminder__form-inner')
            .hover(function(event) {
                if (jQuery(event.target).is('.m-reminder__icons, .m-reminder, .m-reminder__reminder-text, .m-reminder__form, .m-reminder__form-inner'))
                    open();
            }, function(event) {
                if (jQuery(event.target).is('.m-reminder__icons, .m-reminder, .m-reminder__reminder-text, .m-reminder__form, .m-reminder__form-inner'))
                    close();
            });
        mReminderReminder.on("touchstart", open);
        mOverlay.on("touchstart click", close);
        mReminderFormClose.on("touchstart click", close);


        $('body').append(template);

        var reInitTimer = null;
        $(window).resize(function () {
            close();
            setPosition();
        });

        function activate() {
            var reminderFullSize = settings.reminderFullSize;

            mReminder.addClass(activeClass);
            if (isSmallWidth || isSmallHeight) {
                mReminderText.css({
                    borderRadius: 0
                });
                mOverlay.fadeIn(400);
                $('body').addClass(mNoScrollClass);
            }

            if (isSmallWidth)
                reminderFullSize = $(window).width();
            mReminderForm.width(reminderFullSize);
            if (!isOnLeft) {
                mReminderText.css({
                    left: (-reminderFullSize + settings.reminderIconSize),
                    right: 0,
                    paddingRight: (settings.reminderIconSize / 2) + "px"
                });
            } else {
                mReminderText.css({
                    left: 0,
                    right: (-reminderFullSize + settings.reminderIconSize),
                    paddingLeft: (settings.reminderIconSize / 2) + "px"
                });
            }
        }

        function deactivate() {
            mReminder.removeClass(activeClass);
            mReminderText.css({
                left: 0,
                right: 0,
                paddingRight: 0,
                paddingLeft: 0
            });
            if (isSmallWidth || isSmallHeight) {
                mReminderText.css({
                    borderRadius: settings.reminderIconSize
                });
                mOverlay.fadeOut(400);
                $('body').removeClass(mNoScrollClass);
            }
        }

        function open() {
            if (iconInterval !== null)
                clearInterval(iconInterval);
            if (!isSmallHeight || !isSmallWidth)
                setTimeout(function () {
                    stopReminderAnimation();
                }, 1000);
            iconInterval = null;
            if (activateTimer) clearTimeout(activateTimer);
            mReminderForm.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", transitionEventFormClose);
            if (mReminder.hasClass(activeClass)) {
                transitionEventReminderOpen();
            } else {
                activateTimer = setTimeout(activate, settings.activeDelay);
                mReminder.find('.m-reminder__reminder-text').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", transitionEventReminderOpen);
            }
        }

        function close() {
            if (iconInterval === null) iconInterval = startIconInterval();
            if (!isSmallHeight && !isSmallWidth && settings.reminderAnimation) startReminderAnimation();
            if (activateTimer) clearTimeout(activateTimer);
            mReminderForm.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", transitionEventFormOpen);
            mReminderForm.find('input').each(function () {
                jQuery(this).blur();
            });
            mReminder.find('.m-reminder__reminder-text').off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", transitionEventReminderOpen);
            if (!mReminderForm.hasClass(activeFormClass)) {
                transitionEventFormClose();
            } else {
                activateTimer = setTimeout(function () {
                    mReminderForm.removeClass(activeFormClass);
                    mReminderForm.removeClass(animationFinishFormClass);
                }, settings.activeDelay);
                mReminderForm.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", transitionEventFormClose);
            }

        }

        function startIconInterval() {
            return setInterval(function () {
                if (++selectedIndex >= settings.icons.length) selectedIndex = 0;
                mReminderIcons.find(".m-reminder__icon:not(." + hideIconClass + ")").removeClass(activeIconClass).addClass(hideIconClass);
                mReminderIcons.find(".m-reminder__icon_" + settings.icons[selectedIndex]).removeClass(hideIconClass).addClass(activeIconClass);
            }, settings.iconDelay);
        }

        function startReminderAnimation() {
            stopReminderAnimation();
            reminderAnimation = setTimeout(function () {
                mReminderCircle.addClass(circleAnimationClass);
                mReminderCircleBorder.addClass(circleBorderAnimationClass);
                reminderAnimation = setTimeout(startReminderAnimation, settings.reminderAnimationDelay);
            }, settings.reminderAnimationDelay);
        }

        function stopReminderAnimation() {
            mReminderCircle.removeClass(circleAnimationClass);
            mReminderCircleBorder.removeClass(circleBorderAnimationClass);
            if (reminderAnimation !== null) clearTimeout(reminderAnimation);
            reminderAnimation = null;
        }

        function setPosition() {
            mReminder.removeAttr('style');
            mReminderReminder.removeAttr('style');
            mReminderForm.removeAttr('style');
            mReminderText.removeAttr('style');
            mReminderInner.removeAttr('style');
            mReminderFormClose.removeAttr('style');
            mOverlay.removeAttr('style');

            settings.reminderFullSize = originalWidth;

            for (var positionType in settings.position) {
                var position = settings.position[positionType];
                if (typeof position === "string") {
                    if (position.indexOf("%") !== -1) {
                        var percent = parseInt(position.replace('%', ''));
                        if (positionType === 'right' || positionType === 'left') {
                            settings.position[positionType] = $(window).width() * (percent / 100)
                        } else if (positionType === 'top' || positionType === 'bottom') {
                            settings.position[positionType] = $(window).height() * (percent / 100)
                        }
                    } else {
                        position = parseInt(position);
                    }
                }
            }

            if (settings.position.right)
                settings.position.left = $(window).width() - settings.position.right;
            if (settings.position.bottom)
                settings.position.top = $(window).height() - settings.position.bottom;


            isOnLeft = settings.position.left < $(window).width() / 2;
            isOnTop = settings.position.top < $(window).height() / 2;
            isSmallWidth = $(window).width() <= settings.mobileWidth;
            isSmallHeight = $(window).height() <= settings.mobileHeight;
            if (isSmallWidth || isSmallHeight) {
                mReminder.css(isOnLeft ? 'left' : 'right', 0);
                mReminder.css(isOnTop ? 'top' : 'bottom', 0);
                if (!isOnLeft) {
                    mReminderReminder.css({
                        borderTopLeftRadius: settings.reminderIconSize,
                        borderBottomLeftRadius: settings.reminderIconSize
                    });
                } else {
                    mReminderReminder.css({
                        borderTopRightRadius: settings.reminderIconSize,
                        borderBottomRightRadius: settings.reminderIconSize
                    });
                }
                if (isSmallWidth) {
                    settings.reminderFullSize = $(window).width();
                } else if (isSmallHeight) {
                    mReminderForm.height($(window).height() - settings.reminderIconSize / 2);
                    mReminderForm.css('overflow', 'scroll');
                }
            } else {
                mReminderReminder.css({
                    borderRadius: settings.reminderIconSize
                });
                mReminder.css(originalPosition);
            }
            mReminderInner.css({
                height: settings.reminderIconSize,
                width: settings.reminderIconSize
            });
            mReminderReminder.css({
                height: settings.reminderIconSize,
                width: settings.reminderIconSize
            });

            mReminderForm.width(settings.reminderFullSize);
            if (isOnTop) {
                mReminderFormClose.css('top', 35);
                mReminderForm.css("top", (settings.reminderIconSize / 2) + "px");
                mReminderForm.find('form').css("padding-top", (settings.reminderIconSize / 2) + "px");
                mReminderForm.css({
                    borderBottomLeftRadius: settings.formBorderRadius,
                    borderBottomRightRadius: settings.formBorderRadius
                });

            } else {
                mReminderForm.css("bottom", (settings.reminderIconSize / 2) + "px");
                mReminderForm.find('form').css("padding-bottom", (settings.reminderIconSize / 2) + "px");
                mReminderForm.css({
                    borderTopLeftRadius: settings.formBorderRadius,
                    borderTopRightRadius: settings.formBorderRadius
                });
            }

            mReminderText.css({
                lineHeight: settings.reminderIconSize + "px",
                borderRadius: settings.reminderIconSize,
                height: settings.reminderIconSize
            });

            if (isOnLeft) mReminderForm.css('left', 0);
            else mReminderForm.css('right', 0);

            if (!isSmallHeight && !isSmallWidth && settings.reminderAnimation) startReminderAnimation();
            else stopReminderAnimation();
        }

        return this;
    }

    $.mReminder = function (options) {
        return init(options);
    };

}(jQuery));