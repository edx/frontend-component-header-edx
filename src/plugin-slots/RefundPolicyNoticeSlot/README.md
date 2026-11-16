# Header Refund Policy Notice Slot

### Slot ID: `refund_policy_notice_slot`

## Description

This slot is rendered once, for authenticated users, outside the desktop and mobile header layouts. It is meant
for the refund policy change popup (`@edx/refund-policy-notice-plugin`), which opens itself as a modal when the
learner has a notice to acknowledge and renders nothing otherwise.

The slot is empty by default.

## Example

The following ``env.config.jsx`` inserts the refund policy notice popup.

```jsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import RefundPolicyNotice from '@edx/refund-policy-notice-plugin';

const config = {
  pluginSlots: {
    refund_policy_notice_slot: {
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
