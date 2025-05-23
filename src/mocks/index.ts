import { Topic } from "../entities/topics";
import { PatchShape } from "../schemas/abstracts";
import { ExecutedInstruction } from "../types";

export const VALID_TOPIC = new Topic({
    id: 17,
    name: "Topic 018",
    content: "Topic 018 content!",
    version: 1,
    parentTopicId: 16,
    createdAt: "2025-05-04 17:37:45",
    updatedAt: "2025-05-04 17:37:45",
    children: [],
    resources: []
});


export const VALID_PATH: ExecutedInstruction[] = [
    {
        fromTopicId: 1,
        direction: "self",
        originFromRoot: "self",
        toTopicId: 1
    }
];

export const VALID_RFC6902_PATCH: PatchShape = {
    op: "replace",
    path: "content",
    value: "UHULLL BEST CONTENT EVER!!!"
}