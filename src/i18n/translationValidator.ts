
/**
 * Translation validation system
 * Modular system for validating translation integrity
 */
import { ValidationReport, FormatIssue } from './types/validationTypes';
import { extractPlaceholders, findMissingKeys, findInvalidFormatKeys } from './validators/validatorUtils';
import { findFormatIssues } from './validators/formatIssueValidator';
import translationValidatorService from './validators/translationValidatorService';

export {
  translationValidatorService as default,
  findMissingKeys,
  findFormatIssues,
  extractPlaceholders,
  findInvalidFormatKeys
};

export type { ValidationReport, FormatIssue };
