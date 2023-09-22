/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback, useEffect, useRef, useState, useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import classNames from 'classnames';
import {
  Icon, IconButton, OverlayTrigger, Popover, Hyperlink, Button, Bubble,
} from '@edx/paragon';
import { NotificationsNone, Settings } from '@edx/paragon/icons';
import { selectNotificationTabsCount } from './data/selectors';
import { resetNotificationState } from './data/thunks';
import { toggleTrayEvent } from './data/slice';
import { useIsOnLargeScreen, useIsOnMediumScreen } from './data/hook';
import NotificationTabs from './NotificationTabs';
import messages from './messages';
import NotificationTour from './tours/NotificationTour';

const Notifications = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const [enableNotificationTray, setEnableNotificationTray] = useState(false);
  const notificationCounts = useSelector(selectNotificationTabsCount);
  const isOnMediumScreen = useIsOnMediumScreen();
  const isOnLargeScreen = useIsOnLargeScreen();

  const toggleNotificationTray = useCallback(() => {
    setEnableNotificationTray(prevState => !prevState);
    dispatch(toggleTrayEvent(!enableNotificationTray));
  }, [enableNotificationTray]);

  const handleClickOutsideNotificationTray = useCallback((event) => {
    if (!popoverRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
      setEnableNotificationTray(false);
      dispatch(toggleTrayEvent(false));
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideNotificationTray);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificationTray);
      dispatch(resetNotificationState());
    };
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.type = 'text/javascript';
    script.innerHTML = `
      window.lightningjs ||
        (function (n) {
          var e = "lightningjs";
          function t(e, t) {
            var r, i, a, o, d, c;
            return (
              t && (t += (/\\?/.test(t) ? "&" : "?") + "lv=1"),
              n[e] ||
                ((r = window),
                (i = document),
                (a = e),
                (o = i.location.protocol),
                (d = "load"),
                (c = 0),
                (function () {
                  n[a] = function () {
                    var t = arguments,
                      i = this,
                      o = ++c,
                      d = (i && i != r && i.id) || 0;
                    function s() {
                      return (s.id = o), n[a].apply(s, arguments);
                    }
                    return (
                      (e.s = e.s || []).push([o, d, t]),
                      (s.then = function (n, t, r) {
                        var i = (e.fh[o] = e.fh[o] || []),
                          a = (e.eh[o] = e.eh[o] || []),
                          d = (e.ph[o] = e.ph[o] || []);
                        return (
                          n && i.push(n), t && a.push(t), r && d.push(r), s
                        );
                      }),
                      s
                    );
                  };
                  var e = (n[a]._ = {});
                  function s() {
                    e.P(d), (e.w = 1), n[a]("_load");
                  }
                  (e.fh = {}),
                    (e.eh = {}),
                    (e.ph = {}),
                    (e.l = t
                      ? t.replace(/^\\/\\//, ("https:" == o ? o : "http:") + "//")
                      : t),
                    (e.p = { 0: +new Date() }),
                    (e.P = function (n) {
                      e.p[n] = new Date() - e.p[0];
                    }),
                    e.w && s(),
                    r.addEventListener
                      ? r.addEventListener(d, s, !1)
                      : r.attachEvent("onload", s);
                  var l = function () {
                    function n() {
                      return [
                        "<!DOCTYPE ",
                        o,
                        "><",
                        o,
                        "><head></head><",
                        t,
                        "><",
                        r,
                        ' src="',
                        e.l,
                        '"></',
                        r,
                        "></",
                        t,
                        "></",
                        o,
                        ">",
                      ].join("");
                    }
                    var t = "body",
                      r = "script",
                      o = "html",
                      d = i[t];
                    if (!d) return setTimeout(l, 100);
                    e.P(1);
                    var c,
                      s = i.createElement("div"),
                      h = s.appendChild(i.createElement("div")),
                      u = i.createElement("iframe");
                    (s.style.display = "none"),
                      (d.insertBefore(s, d.firstChild).id = "lightningjs-" + a),
                      (u.frameBorder = "0"),
                      (u.id = "lightningjs-frame-" + a),
                      /MSIE[ ]+6/.test(navigator.userAgent) &&
                        (u.src = "javascript:false"),
                      (u.allowTransparency = "true"),
                      h.appendChild(u);
                    try {
                      u.contentWindow.document.open();
                    } catch (n) {
                      (e.domain = i.domain),
                        (c =
                          "javascript:var d=document.open();d.domain='" +
                          i.domain +
                          "';"),
                        (u.src = c + "void(0);");
                    }
                    try {
                      var p = u.contentWindow.document;
                      p.write(n()), p.close();
                    } catch (e) {
                      u.src =
                        c +
                        'd.write("' +
                        n().replace(/"/g, String.fromCharCode(92) + '"') +
                        '");d.close();';
                    }
                    e.P(2);
                  };
                  e.l && l();
                })()),
              (n[e].lv = "1"),
              n[e]
            );
          }
          var r = (window.lightningjs = t(e));
          (r.require = t), (r.modules = n);
        })({});
    `;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const viewPortHeight = document.body.clientHeight;
  const headerHeight = document.getElementsByClassName('learning-header-container');
  const footer = document.getElementsByClassName('footer');

  const notificationBarHeight = useMemo(() => {
    if (headerHeight.length > 0) {
      const availableViewportHeight = viewPortHeight - headerHeight[0].clientHeight;

      if (footer.length > 0) {
        const footerRect = footer[0].getBoundingClientRect();
        const visibleFooterHeight = Math.min(footerRect.bottom, window.innerHeight) - Math.max(footerRect.top, 0);
        const footerHeight = footer[0].clientHeight;

        const adjustedBarHeight = availableViewportHeight - footerHeight + Math.min(visibleFooterHeight, 0);

        return adjustedBarHeight;
      }
      return availableViewportHeight;
    }
    return 0;
  }, [viewPortHeight, headerHeight, footer]);

  const enableFeedback = useCallback(() => {
    window.usabilla_live('click');
  }, []);

  return (
    <>
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        id="notificationTray"
        show={enableNotificationTray}
        overlay={(
          <Popover
            id="notificationTray"
            style={{ height: `${notificationBarHeight}px` }}
            data-testid="notification-tray"
            className={classNames('overflow-auto rounded-0 border-0 position-fixed', {
              'w-100': !isOnMediumScreen && !isOnLargeScreen,
              'medium-screen': isOnMediumScreen,
              'large-screen': isOnLargeScreen,
            })}
          >
            <div ref={popoverRef}>
              <Popover.Title
                as="h2"
                className={`d-flex justify-content-between p-4 m-0 border-0 text-primary-500 zIndex-2 font-size-18
                  line-height-24 bg-white position-sticky`}
              >
                {intl.formatMessage(messages.notificationTitle)}
                <Hyperlink
                  destination={`${getConfig().ACCOUNT_SETTINGS_URL}/notifications`}
                  target="_blank"
                  rel="noopener noreferrer"
                  showLaunchIcon={false}
                >
                  <Icon
                    src={Settings}
                    className="icon-size-20 text-primary-500"
                    data-testid="setting-icon"
                    screenReaderText="preferences settings icon"
                  />
                </Hyperlink>
              </Popover.Title>
              <Popover.Content className="notification-content p-0">
                <NotificationTabs />
              </Popover.Content>
              {getConfig().NOTIFICATION_FEEDBACK_URL && (
                <Button
                  onClick={() => enableFeedback()}
                  variant="warning"
                  className="notification-feedback-widget"
                  alt="feedback button"
                >
                  {intl.formatMessage(messages.feedback)}
                </Button>
              )}
            </div>
          </Popover>
        )}
      >
        <div ref={buttonRef}>
          <IconButton
            isActive={enableNotificationTray}
            alt="notification bell icon"
            onClick={toggleNotificationTray}
            src={NotificationsNone}
            iconAs={Icon}
            variant="light"
            id="bell-icon"
            iconClassNames="text-primary-500"
            className="ml-4 mr-1 notification-button"
            data-testid="notification-bell-icon"
          />
          {notificationCounts?.count > 0 && (
          <Bubble
            variant="error"
            data-testid="notification-count"
            className={classNames('notification-badge zindex-1', {
              'notification-badge-unrounded': notificationCounts.count >= 10,
              'notification-badge-rounded': notificationCounts.count < 10,
            })}
          >
            {notificationCounts.count >= 100 ? <div className="d-flex">99<p className="mb-0 plus-icon">+</p></div>
              : notificationCounts.count}
          </Bubble>
          )}
        </div>
      </OverlayTrigger>
      <NotificationTour />
    </>
  );
};

export default Notifications;
