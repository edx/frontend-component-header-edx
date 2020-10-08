import PropTypes from 'prop-types';

export const menuItemShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func,
});
