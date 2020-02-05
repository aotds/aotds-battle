import drive, { inflate } from '.';
import { internal_damage } from './internalDamage';

const {
    reducer
} = drive;

const drive_damage = internal_damage({bogey_id: 'enkidu', hit: true, system: 'drive'});

describe('internal damage', () => {
    test('drive', () => {
        let drive = reducer(inflate(4), drive_damage);

        expect(drive).toHaveProperty('damage_level', 1);
        expect(drive).toHaveProperty('current', 2);

        // boom! again
        drive = reducer(drive, drive_damage);

        expect(drive).toHaveProperty('damage_level', 2);
        expect(drive).toHaveProperty('current', 0);

        // can't go worse than 2
        drive = reducer(drive, drive_damage);

        expect(drive).toHaveProperty('damage_level', 2);
        expect(drive).toHaveProperty('current', 0);
    });
});
