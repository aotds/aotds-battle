// @format

import { internal_damage } from '../actions';
import { drive_reducer } from './reducer';
import { inflate_drive } from './inflate';

describe('internal damage', () => {
    test('drive', () => {
        let drive = drive_reducer(inflate_drive(4), internal_damage('enkidu', 'drive', true));

        expect(drive).toHaveProperty('damage_level', 1);
        expect(drive).toHaveProperty('current', 2);

        // boom! again
        drive = drive_reducer(drive, internal_damage('enkidu', 'drive', true));

        expect(drive).toHaveProperty('damage_level', 2);
        expect(drive).toHaveProperty('current', 0);

        // can't go worse than 2
        drive = drive_reducer(drive, internal_damage('enkidu', 'drive', true));

        expect(drive).toHaveProperty('damage_level', 2);
        expect(drive).toHaveProperty('current', 0);
    });
});
