import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects
} from '@bniki-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
