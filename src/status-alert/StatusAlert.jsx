import React from 'react';
import PropTypes from 'prop-types';
import { Icon, PageBanner } from '@openedx/paragon';
import { WarningFilled } from '@openedx/paragon/icons';

const StatusAlert = ({ message }) => (
  <PageBanner variant="warning">
    <Icon src={WarningFilled} className="mie-2" />
    {message}
  </PageBanner>
);

StatusAlert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default StatusAlert;
