import UserDocument from '../../documents/user.doc';
import BoardDocument from '../../documents/board.doc';
import ListDocument from '../../documents/list.doc';
import CardDocument from '../../documents/card.doc';
import firebaseService from '../../services/firebase.service';
import { Actions } from './types';

export enum CardActions {
  MOVE = 'move',
  EDIT = 'edit',
  NEW = 'new',
  REMOVE = 'remove',
  ASSIGNEE = 'assignee',
}

interface BaseCardData {
  card: CardDocument['ref'];
  board: BoardDocument['ref'];
}

export interface MoveCardData extends BaseCardData {
  listBefore: ListDocument['ref'];
  listAfter: ListDocument['ref'];
  action: CardActions.MOVE;
  title: string;
}

const createAction = (
  type: Actions,
  memberCreator: UserDocument['ref'],
  data: any
) =>
  firebaseService.createAction({
    date: Date.now(),
    type,
    memberCreator,
    data,
  });

export const moveCardAction = ({
  memberCreator,
  data,
}: {
  memberCreator: UserDocument['ref'];
  data: Omit<MoveCardData, 'action'>;
}) =>
  createAction(Actions.UPDATE_CARD, memberCreator, {
    ...data,
    action: CardActions.MOVE,
  });

export interface EditCardData extends BaseCardData {
  list: ListDocument['ref'];
  action: CardActions.MOVE;
  oldText: string;
  newText: string;
  title: string;
}

export const editCardAction = ({
  memberCreator,
  data,
}: {
  memberCreator: UserDocument['ref'];
  data: Omit<EditCardData, 'action'>;
}) =>
  createAction(Actions.UPDATE_CARD, memberCreator, {
    ...data,
    action: CardActions.EDIT,
  });

export interface NewCardData extends BaseCardData {
  list: ListDocument['ref'];
  action: CardActions.NEW;
  title: string;
}

export const newCardAction = ({
  memberCreator,
  data,
}: {
  memberCreator: UserDocument['ref'];
  data: Omit<NewCardData, 'action'>;
}) =>
  createAction(Actions.UPDATE_CARD, memberCreator, {
    ...data,
    action: CardActions.NEW,
  });

export interface RemoveCardData extends Omit<BaseCardData, 'card'> {
  text: string;
  list: ListDocument['ref'];
  action: CardActions.REMOVE;
  title: string;
}

export const removeCardAction = ({
  memberCreator,
  data,
}: {
  memberCreator: UserDocument['ref'];
  data: Omit<RemoveCardData, 'action'>;
}) =>
  createAction(Actions.UPDATE_CARD, memberCreator, {
    ...data,
    action: CardActions.REMOVE,
  });

export interface AssigneeCardData extends BaseCardData {
  list: ListDocument['ref'];
  action: CardActions.ASSIGNEE;
  assignee: UserDocument['ref'];
  title: string;
}

export const assigneeCardAction = ({
  memberCreator,
  data,
}: {
  memberCreator: UserDocument['ref'];
  data: Omit<AssigneeCardData, 'action'>;
}) =>
  createAction(Actions.UPDATE_CARD, memberCreator, {
    ...data,
    action: CardActions.ASSIGNEE,
  });