export type Player = {
    id: string,
};

export type GameState = {
    name: string,
    players: Player[],
    turn: number,
};
