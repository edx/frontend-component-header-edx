import { useEffect, useState } from 'react';
import { getLearnerPortalLinks, getSelectedEnterpriseUUID } from '@edx/frontend-enterprise';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export default function useEnterpriseConfig(authenticatedUser, config) {
  const [enterpriseLearnerPortalLink, setEnterpriseLearnerPortalLink] = useState();
  const [enterpriseCustomerBrandingConfig, setEnterpriseCustomerBrandingConfig] = useState();
  useEffect(
    () => {
      const httpClient = getAuthenticatedHttpClient();
      getLearnerPortalLinks(
        httpClient,
        authenticatedUser,
        config.ENTERPRISE_LEARNER_PORTAL_HOSTNAME,
        config.LMS_BASE_URL,
      ).then((learnerPortalLinks) => {
        const preferredUUID = getSelectedEnterpriseUUID(authenticatedUser);
        const preferredLearnerPortalLink = learnerPortalLinks.find(learnerPortalLink =>
          learnerPortalLink.uuid === preferredUUID);
        if (preferredLearnerPortalLink) {
          setEnterpriseCustomerBrandingConfig({
            logo: preferredLearnerPortalLink.branding_configuration.logo,
            logoAltText: preferredLearnerPortalLink.title,
            logoDestination: preferredLearnerPortalLink.url,
          });

          setEnterpriseLearnerPortalLink({
            type: 'item',
            href: preferredLearnerPortalLink.url,
            content: 'Dashboard',
          });
        }
      });
    },
    [],
  );

  return {
    enterpriseLearnerPortalLink,
    enterpriseCustomerBrandingConfig,
  };
}
