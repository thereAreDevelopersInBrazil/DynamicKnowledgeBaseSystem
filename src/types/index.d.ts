import { ALL } from "../constants/permissions";

type Permissions = typeof ALL[number];

type Directions = 'self' | 'up' | 'down' | 'sides';

type Instruction = {
    fromTopicId: number,
    direction: Directions,
    originFromRoot: Directions
};

type ExecutedInstruction = Instruction & {
    toTopicId: number,
};

type SearchTree = {
    self: ExecutedInstruction[],
    up: ExecutedInstruction[],
    down: ExecutedInstruction[],
    sides: ExecutedInstruction[]
}

type WarningExposedResponse = {
    response: unknown,
    warnings: string[]
}