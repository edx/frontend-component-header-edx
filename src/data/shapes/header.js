import PropTypes from 'prop-types';

export const menuItemShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  submenuContent: PropTypes.string,
  onClick: PropTypes.func,
});

export const itemDetailsShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});
