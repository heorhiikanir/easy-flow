import React from 'react';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';

import ListDocument, { List as ListModel } from '../../documents/list.doc';
import Editable from '../shared/Editable';
import CardCounter from './CardCounter';
import ListMenu from './ListMenu';

interface ListHeaderProps {
  listTitle: string;
  dragHandleProps: any;
  list: ListDocument;
  isDragging: boolean;
  previewMode?: boolean;
  onRemove: (title: string) => Promise<void>;
  onUpdate: (data: Partial<ListModel>) => Promise<void>;
}

const ListHeader = ({
  listTitle,
  dragHandleProps,
  list,
  isDragging,
  previewMode,
  onRemove,
  onUpdate,
}: ListHeaderProps) => {
  const isEditable = !previewMode;

  const handleSubmit = (value: string) => {
    if (value === '') return;

    if (value !== listTitle) {
      onUpdate({ title: value });
    }
  };

  const handleCounterSubmit = (value: number) =>
    onUpdate({ cardsLimit: value });

  return (
    <div
      className={cn(
        'flex inline-flex items-center flex-shrink-0 p-3 rounded-lg',
        isDragging && 'bg-gray-600'
      )}
      {...(isEditable && dragHandleProps)}
    >
      <Editable
        value={listTitle}
        onSubmit={handleSubmit}
        editable={isEditable}
        inputProps={{ full: false, style: { maxWidth: '179px' } }}
      >
        {({ value, onClick }) => (
          <div className='flex-grow'>
            <div
              role='button'
              tabIndex={0}
              onClick={onClick}
              className='text-white text-left font-semibold w-full cursor-text break-words'
            >
              <span
                title='Click to change the list title'
                className={cn(isEditable && 'cursor-text')}
              >
                {value}
              </span>
            </div>
          </div>
        )}
      </Editable>

      <CardCounter
        counter={list.cards.docs.length}
        max={list.data.cardsLimit}
        onChange={handleCounterSubmit}
        editable={isEditable}
      />

      {isEditable && <ListMenu title={list.data.title} onRemove={onRemove} />}
    </div>
  );
};

export default observer(ListHeader);
