import { formatRelative } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { useBoardsData } from '../../store';
import {
  CardActions,
  NewCardData,
  MoveCardData,
  AssigneeCardData,
  EditCardData,
} from '../../core/actions/card.actions';
import { Avatar } from '../Avatar/Avatar';

const NewCardAction = ({ data }: { data: NewCardData }) => {
  const store = useBoardsData(s => s);

  return (
    <>
      <span className='text-gray-400'> added a new card </span>
      <span>{data.title}</span>
      <span className='text-gray-400'> to </span>
      <span>{store.getList(data.list.id).data.title}</span>
      <span className='text-gray-400'> column</span>
    </>
  );
};

const RemoveCardAction = ({ data }: { data: NewCardData }) => {
  const store = useBoardsData(s => s);

  return (
    <>
      <span className='text-gray-400'> removed a card </span>
      <span>{data.title}</span>
      <span className='text-gray-400'> from </span>
      <span>{store.getList(data.list.id).data.title}</span>
      <span className='text-gray-400'> column</span>
    </>
  );
};

const MoveCardAction = ({ data }: { data: MoveCardData }) => {
  const store = useBoardsData(s => s);

  return (
    <>
      <span className='text-gray-400'> moved a card </span>
      <span>{data.title}</span>
      <span className='text-gray-400'> from </span>
      <span>{store.getList(data.listBefore.id).data.title}</span>
      <span className='text-gray-400'> column to </span>
      <span>{store.getList(data.listAfter.id).data.title}</span>
    </>
  );
};

const AssigneeCardAction = ({ data }: { data: AssigneeCardData }) => {
  const store = useBoardsData(s => s);

  return (
    <>
      <span className='text-gray-400'> assigneed to card </span>
      <span>{data.title}</span>
      <span className='text-gray-400'> in </span>
      <span>{store.getList(data.list.id).data.title}</span>
      <span className='text-gray-400'> column</span>
    </>
  );
};

const EditCardAction = ({ data }: { data: EditCardData }) => {
  const store = useBoardsData(s => s);

  return (
    <>
      <span className='text-gray-400'> edited a card </span>
      <span>{data.title}</span>
      <span className='text-gray-400'> in </span>
      <span>{store.getList(data.list.id).data.title}</span>
      <span className='text-gray-400'> column</span>
    </>
  );
};

const CardsActions = ({ data }: { data: any }) => {
  switch (data.action) {
    case CardActions.NEW:
      return <NewCardAction data={data} />;

    case CardActions.REMOVE:
      return <RemoveCardAction data={data} />;

    case CardActions.MOVE:
      return <MoveCardAction data={data} />;

    case CardActions.ASSIGNEE:
      return <AssigneeCardAction data={data} />;

    case CardActions.EDIT:
      return <EditCardAction data={data} />;

    default:
      return null;
  }
};

const ActionCard = ({ action, user }) => {
  return (
    user && (
      <div className='flex items-center p-3' key={action.id}>
        <div className='mr-4 ml-2'>
          <Avatar
            username={user.username}
            imgUrl={user.photo}
            style={{ maxWidth: 'unset' }}
          />
        </div>
        <div className='flex flex-col'>
          <p>
            {user.username}
            <CardsActions data={action.data.data} />
          </p>
          <p className='text-gray-600'>
            {formatRelative(new Date(action.data.date), new Date())}
          </p>
        </div>
      </div>
    )
  );
};

export default observer(ActionCard);