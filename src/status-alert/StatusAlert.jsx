import React from 'react';
import PropTypes from 'prop-types';
import { PageBanner } from '@openedx/paragon';

const StatusAlert = ({ message }) => (
  <PageBanner variant="warning">{message}</PageBanner>
);

StatusAlert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default StatusAlert;
