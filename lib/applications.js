/**
 * @file Onboarding applications
 */

const helpers = require('./helpers');

/**
 * @typedef Application
 * @property {String} applicationId
 * @property {String} applicationStatus (optional)
 * @property {String} decision (optional)
 * @property {Boolean} enableDeposits (optional)
 * @property {Array<String>} stepUpDetails (optional)
 */

/**
 * @typedef Address
 * @property {String} city
 * @property {String} territory
 * @property {String} line1
 * @property {String} line2
 * @property {String} zip
 * @property {String} countryCode
 */

/**
 * @typedef GovernmentIdentification
 * @property {String} value
 * @property {String} type
 */

/**
 * Create new onboarding application
 * @param {Object} options.applicant
 * @param {String} options.applicant.firstName
 * @param {String} options.applicant.lastName
 * @param {String} options.applicant.email
 * @param {String} options.applicant.phone (optional)
 * @param {String} options.applicant.lastFourSSN (optional)
 * @param {String} options.applicant.leadId (optional)
 * @param {String} options.applicant.userId (optional)
 * @param {String} options.applicant.ip
 * @param {String} options.applicationLevel (optional)
 * @param {Boolean} options.mock (optional)
 * @param {Boolean} options.masterMid (optional)
 * @param {Boolean} options.find (optional)
 * @param {Boolean} options.createBusiness (optional)
 * @param {String} options.medium (optional)
 * @param {String} options.source (optional)
 * @param {String} options.customerId
 * @param {String} options.shopperId
 * @param {String} options.serviceId (optional)
 * @param {String} options.serviceType (optional)
 * @param {String} options.ventureId (optional)
 * @param {String} options.context (optional)
 * @param {Object} options.company
 * @param {Address} options.company.address
 * @param {GovernmentIdentification} options.company.governmentIdentification (optional)
 * @param {String} options.company.name (optional)
 * @param {String} options.company.site (optional)
 * @param {String} options.company.mcc (optional)
 * @return {Application} application
 */
module.exports.createApplication = function createApplication(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicant', 'customerId', 'shopperId']);

  if (hasErr) {
    return next(hasErr);
  }

  let data = {
    applicant: {
      firstName: options.applicant.firstName,
      lastName: options.applicant.lastName,
      email: {
        emailAddress: options.applicant.email
      },
      ip: options.applicant.ip
    },
    application: {
      mock: options.mock,
      masterMid: options.masterMid,
      godaddyCustomerId: options.customerId,
      godaddyShopperId: options.shopperId,
      godaddyServiceId: options.serviceId,
      godaddyServiceType: options.serviceType,
      godaddyVentureId: options.ventureId,
      applicationLevel: options.applicationLevel || 'BASIC'
    },
    company: {
      address: {
        countryCode: options.company.address.countryCode
      }
    }
  };

  if (options.applicationLevel !== 'BASIC') {
    data = {
      applicant: {
        ...data.applicant,
        lastFourSSN: options.applicant.lastFourSSN,
        leadId: options.applicant.leadId,
        userId: options.applicant.userId,
        phone: {
          localPhoneNumber: options.applicant.phone
        }
      },
      application: {
        ...data.application,
        medium: options.medium,
        source: options.source,
        context: options.context
      },
      company: {
        address: {
          ...data.company.address,
          city: options.company.address.city,
          territory: options.company.address.territory,
          line1: options.company.address.line1,
          line2: options.company.address.line2,
          zip: options.company.address.zip,
        },
        governmentIdentification: {
          type: options.company.governmentIdentification.type,
          value: options.company.governmentIdentification.value
        },
        name: options.company.name,
        site: options.company.site,
        mcc: options.company.mcc,
      }
    };
  }

  this.request(
    {
      url: `/applications?find=${options.find}&create-business=${options.createBusiness}`,
      app: 'WEB',
      method: 'POST',
      body: data,
    },
    next
  );
};

/**
 * Update existing onboarding application
 * @param {String} options.applicationId
 * @param {Object} options.applicant
 * @param {String} options.applicant.firstName
 * @param {String} options.applicant.lastName
 * @param {String} options.applicant.email
 * @param {String} options.applicant.phone (optional)
 * @param {String} options.applicant.lastFourSSN (optional)
 * @param {String} options.applicant.leadId (optional)
 * @param {String} options.applicant.userId (optional)
 * @param {String} options.applicant.ip
 * @param {String} options.applicationLevel (optional)
 * @param {String} options.customerId
 * @param {String} options.shopperId
 * @param {String} options.serviceId (optional)
 * @param {String} options.serviceType (optional)
 * @param {String} options.ventureId (optional)
 * @param {String} options.context (optional)
 * @param {Address} options.company.address (optional)
 * @param {GovernmentIdentification} options.company.governmentIdentification (optional)
 * @param {String} options.company.name (optional)
 * @param {String} options.company.site (optional)
 * @param {String} options.company.mcc (optional)
 * @return {Application} application
 */
module.exports.updateApplication = function updateApplication(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId']);

  if (hasErr) {
    return next(hasErr);
  }

  let data = {
    applicant: {
      ...options.applicant,
      email: {
        emailAddress: options.applicant.email
      },
      phone: {
        localPhoneNumber: options.applicant.phone
      },
      ip: options.applicant.ip
    },
    application: {
      context: options.context,
      godaddyCustomerId: options.customerId,
      godaddyShopperId: options.shopperId,
      godaddyServiceId: options.serviceId,
      godaddyServiceType: options.serviceType,
      godaddyVentureId: options.ventureId,
      applicationLevel: options.applicationLevel || 'BASIC'
    },
    company: options.company
  };

  this.request(
    {
      url: `/applications/${options.applicationId}`,
      app: 'WEB',
      method: 'PUT',
      body: data,
    },
    next
  );
};

/**
 * Pass OTP verification for application
 * @param {String} options.applicationId
 * @param {String} options.code
 * @param {Boolean} options.skip
 * @return {Application} application
 */
module.exports.passOTPVerification = function passOTPVerification(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId', 'code', 'skip']);

  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/applications/${options.applicationId}/step-ups/otp?skip=${options.skip}`,
      app: 'WEB',
      method: 'POST',
      body: {
        code: options.code
      }
    },
    next
  );
};

/**
 * Pass Persona identification for application
 * @param {String} options.applicationId
 * @param {String} options.inquiryId
 * @return {Application} application
 */
module.exports.passPersonaIdentification = function passPersonaIdentification(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId', 'inquiryId']);

  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/applications/${options.applicationId}/step-ups/identification`,
      app: 'WEB',
      method: 'POST',
      body: {
        inquiryId: options.inquiryId
      }
    },
    next
  );
};

/**
 * Pass Persona EIN verification for application
 * @param {String} options.applicationId
 * @param {String} options.inquiryId
 * @return {Application} application
 */
module.exports.passPersonaEINVerification = function passPersonaEINVerification(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId', 'inquiryId']);

  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/applications/${options.applicationId}/step-ups/verification`,
      app: 'WEB',
      method: 'POST',
      body: {
        inquiryId: options.inquiryId
      }
    },
    next
  );
};

/**
 * Pass full onboarding for application
 * @param {String} options.applicationId
 * @param {Object} options.applicant
 * @param {String} options.applicant.firstName
 * @param {String} options.applicant.lastName
 * @param {String} options.applicant.email
 * @param {String} options.applicant.phone (optional)
 * @param {String} options.applicant.lastFourSSN (optional)
 * @param {String} options.applicant.leadId (optional)
 * @param {String} options.applicant.userId (optional)
 * @param {String} options.applicationLevel (optional)
 * @param {String} options.customerId
 * @param {String} options.shopperId
 * @param {String} options.serviceId (optional)
 * @param {String} options.serviceType (optional)
 * @param {String} options.ventureId (optional)
 * @param {String} options.context (optional)
 * @param {Address} options.company.address (optional)
 * @param {GovernmentIdentification} options.company.governmentIdentification (optional)
 * @param {String} options.company.name (optional)
 * @param {String} options.company.site (optional)
 * @param {String} options.company.mcc (optional)
 * @return {Application} application
 */
module.exports.passFullOnboarding = function passFullOnboarding(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId', 'applicant', 'company']);

  if (hasErr) {
    return next(hasErr);
  }

  let data = {
    applicant: {
      ...options.applicant,
      email: {
        emailAddress: options.applicant.email
      },
      phone: {
        localPhoneNumber: options.applicant.phone
      }
    },
    application: {
      context: options.context,
      godaddyCustomerId: options.customerId,
      godaddyShopperId: options.shopperId,
      godaddyServiceId: options.serviceId,
      godaddyServiceType: options.serviceType,
      godaddyVentureId: options.ventureId
    },
    company: options.company
  };

  this.request(
    {
      url: `/applications/${options.applicationId}/step-ups/full-onboarding`,
      app: 'WEB',
      method: 'POST',
      body: data
    },
    next
  );
};

/**
 * Start underwriting for application
 * @param {String} options.applicationId
 * @return {Application} application
 */
module.exports.startUnderwriting = function startUnderwriting(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId']);

  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/applications/${options.applicationId}/onboard`,
      app: 'WEB',
      method: 'POST'
    },
    next
  );
};

/**
 * @typedef OTPResponse
 * @property {Number} attempts
 * @property {Boolean} success
 */

/**
 * Send SMS OTP code to applicant
 * @param {String} options.applicationId
 * @return {OTPResponse} response
 */
module.exports.sendOTPCode = function sendOTPCode(
  options,
  next
) {
  let hasErr = helpers.hasKeys(options, ['applicationId']);

  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/applications/${options.applicationId}/otp-code`,
      app: 'WEB',
      method: 'POST'
    },
    next
  );
};