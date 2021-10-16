import { ActionGenerator, Payload } from 'updux';

export type BogeyMovementResolution = ActionGenerator<'bogeyMovementResolution', Payload<{ bogeyId: string; movement: unknown }>>;

