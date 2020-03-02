import { getAuthenticatedUser, getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

const isEnterpriseLearner = (user = {}) => {
  const { roles = [] } = user;
  return roles.some(role => role.includes('enterprise_learner'));
};

const getCacheKey = userId => `learnerPortalLinks:${userId}`;

const cacheLinks = (userId, links) => {
  // Set one hour expiration
  const expiration = Date.now() + (1 * 60 * 60 * 1000);
  const cacheKey = getCacheKey(userId);
  const cacheValue = JSON.stringify({ expiration, links });
  sessionStorage.setItem(cacheKey, cacheValue);
};

const fetchLearnerPortalLinks = async (userId) => {
  const httpClient = getAuthenticatedHttpClient();
  const enterpriseApiUrl = `${getConfig().LMS_BASE_URL}/enterprise/api/v1/enterprise-customer/`;
  const enterpriseLearnerPortalHostname = process.env.ENTERPRISE_LEARNER_PORTAL_HOSTNAME

  try {
    const { data } = await httpClient.get(enterpriseApiUrl);
    const enterpriseCustomers = data.results.map(customer => ({
      name: customer.name,
      isEnabled: customer.enable_learner_portal,
      slug: customer.slug,
    }));

    const links = enterpriseCustomers
      .filter(({ isEnabled, slug }) => isEnabled && slug)
      .map(({ name, slug }) => ({
        title: name,
        url: `https://${enterpriseLearnerPortalHostname}/${slug}`,
      }));

    cacheLinks(userId, links);

    return links;
  } catch (e) {
    return [];
  }
};

const getCachedLearnerPortalLinks = (userId) => {
  const cacheKey = getCacheKey(userId);
  const cachedValue = sessionStorage.getItem(cacheKey);

  if (cachedValue) {
    const cachedLinks = JSON.parse(cachedValue);
    // Check cache expiration
    if (cachedLinks.expiration <= Date.now()) {
      sessionStorage.removeItem(cacheKey);
    } else {
      return cachedLinks.links;
    }
  }

  return null;
};

export default async function getLearnerPortalLinks() {
  const authenticatedUser = await getAuthenticatedUser();

  if (isEnterpriseLearner(authenticatedUser)) {
    const { userId } = authenticatedUser;
    const cachedLinks = getCachedLearnerPortalLinks(userId);

    if (cachedLinks != null) {
      return cachedLinks;
    }

    return fetchLearnerPortalLinks(userId);
  }

  return [];
}
