# Ship



### Example

```json
{
  "navigation": {}
}
```


### Documentation

### `.id`

*Type*: string

### `.name`

### `.navigation`

*Type*: object

### `.navigation.heading`

### `.navigation.coords`

### `.navigation.velocity`

### `.navigation.trajectory`

### `.navigation.maneuvers`

### `.navigationcourse`

*Type*: object

### `.navigationcourse.heading`

### `.navigationcourse.coords`

### `.navigationcourse.velocity`

### `.navigationcourse.trajectory`

### `.navigationcourse.maneuvers`

### `.orders`

### `.drive`

### `.weaponry`

### `.structure`

### `.player_id`

*Type*: string

### `definitionscoords`

*Type*: array

*Minimum items*: 2

*Maximum items*: 2

### `definitionscoords[]`

*Type*: number

### `definitionsvelocity`

speed of the object

*Type*: number

### `definitionsheading`

facing angle of the object

*Type*: number

*Maximum*: 12

### `definitionscourse`

projected movement for new turn (for the ui)

*Type*: array

### `definitionscourse[]`

*Type*: object

### `definitionscourse[].heading`

### `definitionscourse[].coords`

### `definitionsmaneuver_range`

range of values for the maneuver (for the ui)

*Type*: array

*Minimum items*: 2

*Maximum items*: 2

### `definitionsmaneuver_range[]`

*Type*: number

### `definitionsmaneuvers`

range of maneuvers the ship can do for its next move (for the ui)

*Type*: object

### `definitionsmaneuvers.thrust`

### `definitionsmaneuvers.bank`

### `definitionsmaneuvers.turn`

### `definitionstrajectory`

course of the previous turn

*Type*: array

### `definitionsorders`

orders for the next turn

*Type*: object

### `definitionsorders.done`

*Type*: boolean

### `definitionsorders.navigation`

*Type*: object

### `definitionsorders.navigation.thrust`

*Type*: number

### `definitionsorders.navigation.turn`

*Type*: number

### `definitionsorders.navigation.bank`

*Type*: number

### `definitionsorders.firecons`

*Type*: array

### `definitionsorders.firecons[]`

*Type*: object

### `definitionsorders.firecons[].firecon_id`

*Type*: integer

### `definitionsorders.firecons[].target_id`

*Type*: string

### `definitionsorders.weapons`

*Type*: array

### `definitionsorders.weapons[]`

*Type*: object

### `definitionsorders.weapons[].weapon_id`

*Type*: integer

### `definitionsorders.weapons[].firecon_id`

*Type*: integer

### `definitionsdrive`

*Type*: object

### `definitionsdrive.rating`

*Type*: integer

### `definitionsdrive.current`

*Type*: integer

### `definitionsdrive.thrust_used`

*Type*: integer

### `definitionsdrive.damage_level`

*Type*: integer

*Allowed values*: `0` `1` `2`

### `definitionsname`

string

### `definitionsfirecon`

*Type*: object

### `definitionsfirecon.id`

*Type*: integer

### `definitionsfirecon.target_id`

*Type*: string

### `definitionsweapon`

*Type*: object

### `definitionsweapon.id`

*Type*: integer

### `definitionsweapon.type`

*Type*: string

### `definitionsweapon.level`

*Type*: integer

### `definitionsweapon.firecon_id`

*Type*: integer

### `definitionsweapon.arcs`

*Type*: array

### `definitionsweapon.arcs[]`

*Allowed values*: `A` `F` `FS` `FP` `AS` `AP`

### `definitionsweaponry`

*Type*: object

### `definitionsweaponry.nbr_firecons`

*Type*: integer

### `definitionsweaponry.firecons`

*Type*: array

### `definitionsweaponry.firecons[]`

### `definitionsweaponry.weapons`

*Type*: array

### `definitionsweaponry.weapons[]`

### `definitionsstructure`

*Type*: object

### `definitionsstructure.hull`

*Type*: object

### `definitionsstructure.hull.current`

*Type*: integer

### `definitionsstructure.hull.max`

*Type*: integer

### `definitionsstructure.armor`

*Type*: object

### `definitionsstructure.armor.current`

*Type*: integer

### `definitionsstructure.armor.max`

*Type*: integer

### `definitionsstructure.shields`

*Type*: array

### `definitionsstructure.shields[]`

### `definitionsstructure.status`

*Type*: string

*Allowed values*: `nominal` `destroyed`