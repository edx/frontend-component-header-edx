# Header User Menu Group Slot

### Slot ID: `header_user_menu_group_slot`

## Description

This slot is used to insert a user menu group in the header's user menu for both desktop and mobile screens.

Note: Ensure the slot is provided with appropriate JSX that can render smoothly on both desktop and mobile screens.

## Example

The following ``env.config.jsx`` demonstrates how to insert a user menu group into the header's user menu
for both mobile and desktop screens.

**Default Behaviour:**

Desktop (non-enterprise):
![Screenshot of Default Header_User_Menu_Desktop_Non_Enterprise](./images/default_user_menu_desktop_non_enterprise.png)

Desktop (enterprise):
![Screenshot of Default Header_User_Menu_Desktop_Enterprise](./images/default_user_menu_desktop_enterprise.png)

Mobile:
![Screenshot of Default Header_User_Menu_Mobile](./images/default_user_menu_mobile.png)

**Inserted a user menu group:**

Desktop:
![Screenshot of Inserted_User_Menu_Group_Desktop](./images/inserted_user_menu_desktop.png)

Mobile:
![Screenshot of Inserted_User_Menu_Group_Mobile](./images/inserted_user_menu_mobile.png)

```jsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { breakpoints, Dropdown, useWindowSize } from '@openedx/paragon';

const config = {
  pluginSlots: {
    header_user_menu_group_slot: {
      plugins: [
        {
          // Insert some user menu group
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'user_menu_group',
            type: DIRECT_PLUGIN,
            RenderWidget: () => {
              const { width } = useWindowSize();
              const isMobile = width <= breakpoints.small.maxWidth;
              if (!isMobile) {
                return (
                  <>
                    <Dropdown.Header>User Menu Group Header</Dropdown.Header>
                    <Dropdown.Item as="a" href="#" className="active">
                      User Menu Group Item - Active
                    </Dropdown.Item>
                    <Dropdown.Item as="a" href="#">
                      User Menu Group Item 2
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </>
                );
              }
              return (
                <>
                  <li className="nav-item">
                    <a href="#" className="nav-link active">
                      User Menu Group Item - Active
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link active">
                      User Menu Group Item 2
                    </a>
                  </li>
                </>
              );
            },
          },
        },
      ],
    },
  },
}

export default config;
```
