export interface ApprovalType {
  status:
    | ApprovalStatus.APPROVED
    | ApprovalStatus.PENDING
    | ApprovalStatus.REJECTED;
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
