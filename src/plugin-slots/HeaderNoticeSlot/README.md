# Header Notice Slot

### Slot ID: `header_notice_slot`

## Description

This slot is rendered once, for authenticated users, outside the layouts of the header. It is meant for one-time
notice popups that open their own modal when the learner has something to acknowledge and render nothing otherwise.
Because it is generic, a new popup can use it from the MFE config without another header release.

It is rendered in both headers: `Header` (outside the desktop and mobile layouts, so it never renders twice) and
`LearningHeader` (used by the Learning and Discussions MFEs). It is not rendered for anonymous users.

The slot is empty by default.

## Example

The following ``env.config.jsx`` inserts the refund policy change popup (`@edx/refund-policy-notice-plugin`).

```jsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import RefundPolicyNotice from '@edx/refund-policy-notice-plugin';

const config = {
  pluginSlots: {
    header_notice_slot: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'refund_policy_notice',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: RefundPolicyNotice,
          },
        },
      ],
    },
  },
};

export default config;
```
