export const USER_TYPES = {
  CANDIDATE: 'candidate',
  COMPANY: 'company',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
};

export const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
};

export const STATUS_COLORS = {
  pending: 'badge-warning',
  reviewed: 'badge-info',
  shortlisted: 'badge-success',
  rejected: 'badge-error',
  accepted: 'badge-primary',
  active: 'badge-success',
  closed: 'badge-error',
  draft: 'badge-ghost',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];