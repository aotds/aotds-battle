import fire_weapon from './fire_weapon';
import damage from './damage';
import { mw_compose } from '../../../middleware/utils';
import internal_damage from '../../bogeys/bogey/weaponry/weapon/middleware/internal_damage';

export default mw_compose([
    fire_weapon,
    damage,
    internal_damage
]);
