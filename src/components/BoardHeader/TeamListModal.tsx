import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { MdRemove, MdSupervisorAccount } from 'react-icons/md';

import BoardDocument from '../../documents/board.doc';
import { useBoardTeam } from '../../hooks/use-board-team';
import { useKeySubmit } from '../../hooks/use-key-submit';
import { useSession } from '../../hooks/use-session';
import { emitter } from '../../libs/emitter';
import { User } from '../../store/users';
import Dialog from '../Dialog/Dialog';
import { Avatar } from '../Avatar/Avatar';
import { Input } from '../shared';

interface TeamListModalProps {
  board?: BoardDocument;
  isOpen?: boolean;
  toggleIsOpen?(): void;
}

interface UserNameProps {
  name: string;
  isOwner: boolean;
}

const UserName = ({ name, isOwner }: UserNameProps) => (
  <div className='flex items-center'>
    <span className='text-white font-semibold'>{name}</span>{' '}
    {isOwner && <span className='text-pink-500 ml-4 font-bold'>Owner</span>}
  </div>
);

interface UserEmailProps {
  email: string;
}

const UserEmail = ({ email }: UserEmailProps) => (
  <span className='text-gray-500 font-light'>{email}</span>
);

const sortAlpha = (a: User, b: User) => {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
};

const TeamListModal = ({ board, toggleIsOpen, isOpen }: TeamListModalProps) => {
  const { owner } = useBoardTeam(board);
  let { assignees } = useBoardTeam(board);
  const { userDoc } = useSession();
  const [value, setValue] = useState('');

  const save = async (newValue: string) => {
    if (!newValue) return;

    const userRef = await firebase
      .firestore()
      .collection('users')
      .doc(newValue);

    const user = await userRef.get();

    if (user.exists) {
      return firebase
        .firestore()
        .collection('boards')
        .doc(board.id)
        .update({
          users: firebase.firestore.FieldValue.arrayUnion(userRef),
        })
        .then(r => {
          emitter.emit('TEAM_MEMBER_UPDATED', {});
          return r;
        });
    }
    toast(`${value} is not a registered user!`);
    return Promise.resolve();
  };

  const remove = async index => {
    // TODO remove this mutability
    const assignee = assignees[index];
    assignees = assignees.splice(index, 1);

    const userRef = firebase
      .firestore()
      .collection('users')
      .doc(assignee.email);

    const user = await userRef.get();

    if (user.exists) {
      firebase
        .firestore()
        .collection('boards')
        .doc(board.id)
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(userRef),
        })
        .then(r => {
          toast(`User ${assignee.username} was removed from the board!`);
          return r;
        });
    }
  };

  const giveOwnership = async index => {
    const assignee = assignees[index];

    const userRef = firebase
      .firestore()
      .collection('users')
      .doc(assignee.email);

    const user = await userRef.get();

    if (user.exists) {
      firebase
        .firestore()
        .collection('boards')
        .doc(board.id)
        .update({
          owner: userRef,
        })
        .then(r => {
          toast(
            `User ${assignee.username} is the new owner of ${board.data.title}!`
          );
          return r;
        });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    await save(value);
    setValue('');
  };

  const handleKeyDown = useKeySubmit(handleSubmit, () => {
    setValue('');
    toggleIsOpen();
  });

  const ownerEmail = owner ? owner.email : '';
  const AmITheBoardOwner = userDoc.data.email === ownerEmail;

  return (
    <Dialog
      title='My Board Team'
      isOpen={isOpen}
      onClose={toggleIsOpen}
      width={600}
      top={assignees.length > 5 ? 5 : undefined}
    >
      <>
        <div className='m-4 mt-0 sm:mt-0 sm:m-8'>
          <label className='text-white'>Add a new member</label>
          <Input
            placeholder='member@email.com'
            className='mt-4'
            autoFocus
            type={'text'}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <ul>
          {assignees.sort(sortAlpha).map(
            (item, key) =>
              item && (
                <li
                  tabIndex={0}
                  key={key}
                  className='flex justify-between items-center py-2 px-4 sm:px-8 mb-5 hover:bg-gray-700'
                >
                  <div className='flex items-center'>
                    <div className='mr-4'>
                      <Avatar
                        className='h-10'
                        key={item.username}
                        imgUrl={item.photo}
                        username={item.username}
                      />
                    </div>
                    <div className='flex flex-col'>
                      <UserName
                        name={item.username}
                        isOwner={ownerEmail === item.email}
                      />
                      <UserEmail email={item.email} />
                    </div>
                  </div>
                  {ownerEmail !== item.email && AmITheBoardOwner && (
                    <div>
                      <button
                        className='text-gray-500 hover:text-gray-900 h-4'
                        title={`Give ${item.username} the board ownership`}
                        onClick={() => giveOwnership(key)}
                      >
                        <MdSupervisorAccount size='24px' />
                      </button>
                      <button
                        className='text-red-500 hover:text-red-700  h-4 pl-4'
                        title={`Remove ${item.username} from the board`}
                        onClick={() => remove(key)}
                      >
                        <MdRemove size='24px' />
                      </button>
                    </div>
                  )}
                </li>
              )
          )}
        </ul>
      </>
    </Dialog>
  );
};

export default observer(TeamListModal);
