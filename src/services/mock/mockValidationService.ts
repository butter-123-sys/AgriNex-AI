// ============================================================
// AgriFedX — Mock Validation Service
// ============================================================
// INTEGRATION POINT: Replace with POST /validation API calls
// ============================================================

import type { Validation, ValidationStatus, Disease } from '../../types';
import { getValidations as getStoredValidations, saveValidation, updateDiagnosis } from '../storageService';

export function getPendingValidations(): Validation[] {
  return getStoredValidations().filter((v) => v.decision === 'PENDING');
}

export function getAllValidations(): Validation[] {
  return getStoredValidations();
}

export function validateDiagnosis(
  diagnosisId: string,
  decision: ValidationStatus,
  expertDisease?: Disease,
  comment?: string
): Validation {
  const existing = getStoredValidations().find((v) => v.diagnosisId === diagnosisId);

  const validation: Validation = {
    id: existing?.id || `val-${Date.now()}`,
    diagnosisId,
    aiDisease: existing?.aiDisease || 'Early Blight',
    aiConfidence: existing?.aiConfidence || 0,
    expertDisease: decision === 'MODIFIED' ? expertDisease : undefined,
    decision,
    comment: comment || '',
    expertId: 'officer-001',
    timestamp: new Date().toISOString(),
  };

  saveValidation(validation);

  // Update diagnosis validation status
  updateDiagnosis(diagnosisId, { validationStatus: decision });

  return validation;
}

export const mockValidationService = {
  getPending: getPendingValidations,
  getAll: getAllValidations,
  validate: validateDiagnosis,
};
export default mockValidationService;
