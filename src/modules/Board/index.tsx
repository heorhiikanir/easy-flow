import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Router from 'next/router';

import { useBoardsStore } from 'store';
import BoardDocument from 'modules/Board/data/board.doc';
import CardDocument from 'modules/Card/data/card.doc';
import ListDocument from 'documents/list.doc';
import ListColumns from 'components/shared/ListColumns';
import BoardHeader from 'modules/Board/components/BoardHeader';
import { CreateContentEmpty } from 'components/shared/Empty/CreateContentEmpty';
import { AnimatedOpacity } from 'components/shared/Animated/AnimatedOpacity';
import { useSession } from 'modules/Auth/components/SessionProvider';
import { emitter } from 'libs/emitter';
import { useInterface } from 'components/providers/InterfaceProvider';
import SideMenu from 'components/shared/SideMenu';
import { useUndo } from 'hooks/use-undo';
const Activities = dynamic(() =>
  import('modules/Activity/components/Activities')
);

interface BoardProps {
  board: BoardDocument;
  previewMode?: boolean;
}

const Board = ({ board, previewMode }: BoardProps) => {
  const { setBoard } = useBoardsStore();
  const { userDoc } = useSession();
  const { isMenuOpen, setMenu, toggleMenu } = useInterface();

  const isOwner = board.isOwner(userDoc && userDoc.id);

  const [loadedActivities, setLoadedActivities] = useState(false);

  const _setMenu = (newState: boolean) => {
    if (!loadedActivities) {
      setLoadedActivities(true);
    }

    setMenu(newState);
  };

  useEffect(() => {
    if (board) {
      setBoard(board);
    }
  }, [board, setBoard]);

  useEffect(() => {
    if (board && board.data.title) {
      window.document.title = `${board.data.title} | Easy Flow`;
    }
  });

  const handeCardMoveAction = (
    card: CardDocument['ref'],
    listBefore: ListDocument['ref'],
    listAfter: ListDocument['ref'],
    cardTitle: string
  ) => {
    emitter.emit('MOVE_CARD', {
      title: cardTitle,
      cardId: card.id,
      listBeforeId: listBefore.id,
      listAfterId: listAfter.id,
    });
  };

  const archiveOrLeaveBoard = async () => {
    isOwner ? await board.archive() : await board.removeMember(userDoc);

    Router.replace('/');
  };

  const { action } = useUndo({
    onCloseComplete: archiveOrLeaveBoard,
    toastId: board.id,
    toastTitle: isOwner
      ? `This board will be archived...`
      : 'You will be removed from this board...',
  });

  if (!board) return null;

  const { lists, isLoading: isLoadingBoard } = board;
  const { isLoading, docs } = lists;

  const showEmpty = !docs.length && !isLoading && !isLoadingBoard;

  return (
    <>
      <SideMenu
        title='Activity'
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        onStateChange={_setMenu}
      >
        {loadedActivities && <Activities board={board} />}
      </SideMenu>

      <div className='m-6 mt-4' id='page-wrap'>
        <BoardHeader
          board={board}
          onRemove={action}
          previewMode={previewMode}
        />

        {!showEmpty && <ListColumns
          lists={lists}
          onCardMove={handeCardMoveAction}
          previewMode={previewMode}
        />}


        {!previewMode && showEmpty && (
          <AnimatedOpacity show={showEmpty}>
            <CreateContentEmpty board={board} />
          </AnimatedOpacity>
        )}
      </div>
    </>
  );
};

export default observer(Board);
