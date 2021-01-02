import { Publisher, Subjects, TicketCreatedEvent } from "@bdntickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;    
}