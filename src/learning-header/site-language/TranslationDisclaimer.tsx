import { useIntl, isRtl, getLocale } from '@edx/frontend-platform/i18n';
import {
  OverlayTrigger,
  Popover,
  Stack,
} from '@openedx/paragon';

import messages from './messages';

const TranslationDisclaimer = () => {
  // @ts-ignore: getLocale expects one argument, but it is valid for it to be undefined
  const siteLanguage = getLocale();
  const dir = isRtl(siteLanguage) ? 'rtl' : 'ltr';
  const { formatMessage } = useIntl();

  return (
    <div dir={dir}>
      <Stack gap={1}>
        <OverlayTrigger
          trigger="click"
          key="right"
          placement="right"
          overlay={(
            <Popover id="disclaimer-popover">
              <Popover.Title as="h3">{formatMessage(messages.popoverDisclaimerTitle)}</Popover.Title>
              <Popover.Content>
                <p>
                  {formatMessage(messages.popoverDisclaimerContent)}
                </p>
                <p>
                  {formatMessage(messages.popoverDisclaimerWarranties)}
                </p>
              </Popover.Content>
            </Popover>
          )}
        >
          <span>
            <span className="text-info-500 small">
              {formatMessage(messages.popoverDisclaimerTitle)}
            </span>
          </span>
        </OverlayTrigger>
      </Stack>
    </div>
  );
};

export default TranslationDisclaimer;
