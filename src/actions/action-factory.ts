import { Action } from './action';

export function makeAction(data: any): Action {
    // Create a new action based on the data
    return data as Action;
}
