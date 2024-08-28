import { DocumentStatus } from '@common/enums';

export interface IFileMessage {
  id: string;
  path?: string;
  status: DocumentStatus;
}
