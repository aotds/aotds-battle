import u from '@yanick/updeep';
import { inflate as bogeys } from './bogeys';

export default function inflate_battle(battle) {
    return u({
        bogeys,
    })(battle);
}
