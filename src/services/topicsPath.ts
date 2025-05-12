import { HTTPSTATUS } from "../constants/http";
import { ExpectedError } from "../errors";
import { getById, getChildren, getSiblings } from "../repositories/topics";
import { Directions, ExecutedInstruction, Instruction, SearchTree } from "../types";

const DIRECTIONS = ['self', 'up', 'down', 'sides'];

export async function findPath(originTopicId: number, targetTopicId: number): Promise<ExecutedInstruction[] | false> {

    const originalTopic = await getById(originTopicId);
    if (!originalTopic) {
        throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, "Please provide an valid origin topic id!");
    }

    const targetTopic = await getById(targetTopicId);
    if (!targetTopic) {
        throw new ExpectedError(HTTPSTATUS.BAD_REQUEST, "Please provide an valid target topic id!");
    }

    const queue: Instruction[] = [];
    const executedInstructions: Instruction[] = [];
    const searchTree: SearchTree = {
        self: [],
        up: [],
        down: [],
        sides: []
    };

    feedInitialQueueInstructions(queue, originTopicId);

    const search = await processQueue(queue, executedInstructions, searchTree, targetTopicId);

    console.log('Search finished with ' + executedInstructions.length + ' instructions executed!');
    return search ? getSuccessfullSearch(search) : false;
}

function feedInitialQueueInstructions(queue: Instruction[], originTopicId: number) {

    for (const direction of DIRECTIONS) {
        queue.push({
            fromTopicId: originTopicId,
            direction: direction as Directions,
            originFromRoot: direction as Directions
        });
    }
}

async function processQueue(queue: Instruction[], executedInstructions: Instruction[], searchTree: SearchTree, targetTopicId: number): Promise<ExecutedInstruction[] | false> {
    while (queue.length > 0) {
        const currentInstruction = queue.shift();
        if (!currentInstruction) {
            break;
        }
        if (executedInstructions.includes(currentInstruction)) {
            continue;
        }
        switch (currentInstruction?.direction) {
            case 'self': {
                const executedInstruction = {
                    ...currentInstruction,
                    toTopicId: currentInstruction.fromTopicId
                };
                executedInstructions.push(currentInstruction);
                searchTree[currentInstruction.originFromRoot].push(executedInstruction);
                if (currentInstruction.fromTopicId == targetTopicId) {
                    return searchTree[currentInstruction.originFromRoot];
                }
                break;
            }
            case 'up': {
                const currentTopic = await getById(currentInstruction.fromTopicId);
                if (!currentTopic) {
                    console.log("Invalid Instruction: Topic dosent exists!", currentInstruction);
                    continue;
                }

                const parentId = currentTopic.getParentTopicId();
                if (parentId == null) {
                    console.log("Invalid Instruction: search UP in a topic with no parents!", currentInstruction);
                    continue;
                }
                const parentTopic = await getById(parentId);

                if (parentTopic && parentTopic.getId()) {
                    const executedInstruction = {
                        ...currentInstruction,
                        toTopicId: parentTopic.getId()
                    };
                    executedInstructions.push(currentInstruction);
                    searchTree[currentInstruction.originFromRoot].push(executedInstruction);

                    if (parentTopic.getId() == targetTopicId) {
                        return searchTree[currentInstruction.originFromRoot];
                    }

                    const possiblyDirectionsToKeepTheSearch: Directions[] = ['up', 'sides'];

                    feedQueueWithInstructions(queue, parentTopic.getId(), currentInstruction.originFromRoot, possiblyDirectionsToKeepTheSearch);
                }
                break;
            }
            case 'down': {
                const currentTopicDetails = await getById(currentInstruction.fromTopicId);
                if (!currentTopicDetails) {
                    console.log("Invalid Instruction: Topic dosent exists!", currentInstruction);
                    continue;
                }

                const children = await getChildren(currentTopicDetails.getId());

                if (!children || children.length == 0) {
                    console.log("Invalid Instruction: search DOWN in a topic with no children!", currentInstruction);
                    continue;
                }

                for (const child of children) {
                    const executedInstruction = {
                        ...currentInstruction,
                        toTopicId: child.getId()
                    };

                    executedInstructions.push(currentInstruction);
                    searchTree[currentInstruction.originFromRoot].push(executedInstruction);

                    if (child.getId() == targetTopicId) {
                        return searchTree[currentInstruction.originFromRoot];
                    }

                    // I think i dont need to cover sides cause the for loop is already
                    // covering all siblings, so, for each sibling I queue just going further down
                    const possiblyDirectionsToKeepTheSearch: Directions[] = ['down'];

                    feedQueueWithInstructions(queue, child.getId(), currentInstruction.originFromRoot, possiblyDirectionsToKeepTheSearch);

                }

                break;
            }

            case 'sides': {
                const currentTopic = await getById(currentInstruction.fromTopicId);
                if (!currentTopic) {
                    console.log("Invalid Instruction: Topic dosent exists!", currentInstruction);
                    continue;
                }

                const siblings = await getSiblings(currentTopic.getId(), currentTopic.getParentTopicId());

                if (!siblings || siblings.length == 0) {
                    console.log("Invalid Instruction: search SIDES in a topic with no siblings!", currentInstruction);
                    continue;
                }

                for (const sibling of siblings) {
                    const executedInstruction = {
                        ...currentInstruction,
                        toTopicId: sibling.getId()
                    };

                    executedInstructions.push(currentInstruction);
                    searchTree[currentInstruction.originFromRoot].push(executedInstruction);

                    if (sibling.getId() == targetTopicId) {
                        return searchTree[currentInstruction.originFromRoot];
                    }

                    // I think that in this very specific case where I searched horizontally
                    // and the for loop will search horizontally in all its extension
                    // I just need to schedule searches for up and down
                    const possiblyDirectionsToKeepTheSearch: Directions[] = ['up', 'down'];

                    feedQueueWithInstructions(queue, sibling.getId(), currentInstruction.originFromRoot, possiblyDirectionsToKeepTheSearch);

                }

                break;
            }
        }
    }
    return false;
}

function feedQueueWithInstructions(queue: Instruction[], topicId: number, searchTreeRoot: Directions, directions: Directions[]) {
    for (const direction of directions) {
        queue.push({
            fromTopicId: topicId,
            direction: direction,
            originFromRoot: searchTreeRoot
        });
    }
}

function getSuccessfullSearch(searches: ExecutedInstruction[]): ExecutedInstruction[] | false {
    const successfullSearch: ExecutedInstruction[] = [];
    const finalSearch = searches.pop();
    if (!finalSearch) {
        return false;
    }
    successfullSearch.push(finalSearch);
    searches.reverse();

    let currentSuccessfullSearchNode = finalSearch.fromTopicId;
    for (const search of searches) {
        if (search.toTopicId == currentSuccessfullSearchNode) {
            successfullSearch.push(search);
            currentSuccessfullSearchNode = search.fromTopicId;
        }
    }

    return successfullSearch.reverse();
}