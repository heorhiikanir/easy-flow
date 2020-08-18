import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { observer } from 'mobx-react-lite';
import { Collection } from 'firestorter';
import styled from 'styled-components';

import CardDocument from 'documents/card.doc';
import CardPlaceholder from 'components/shared/CardPlaceholder';
import Card from 'components/Card';

interface CardProps {
  cards: Collection<CardDocument>;
  listId: string;
  previewMode?: boolean;
}

const Cards = ({ cards, listId, previewMode }: CardProps) => {
  const { isLoading } = cards;

  return (
    <Droppable droppableId={listId} direction='vertical' isCombineEnabled>
      {provided => (
        <StyledCards className='px-2' ref={provided.innerRef}>
          {isLoading ? (
            <CardPlaceholder />
          ) : (
            cards.docs.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                listId={listId}
                previewMode={previewMode}
              />
            ))
          )}

          {provided.placeholder}
        </StyledCards>
      )}
    </Droppable>
  );
};

export default observer(Cards);

const StyledCards = styled.div`
  min-height: 1px;

  & > .card:first-child {
    margin-top: 0;
  }
  & > .card:last-child {
    margin-bottom: 0;
  }
`;