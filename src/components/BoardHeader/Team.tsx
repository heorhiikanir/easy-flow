import { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { useTransition, animated } from 'react-spring';

import BoardDocument from '../../documents/board.doc';
import { useBoardTeam } from '../../hooks/use-board-team';
import { Avatar } from '../Avatar/Avatar';

interface TeamProps {
  style?: CSSProperties;
  className?: string;
  board: BoardDocument;
}

const Counter = ({ number, className }) => (
  <span className={`h-8 flex items-center text-gray-400 ${className}`}>
    +{number}
  </span>
);

const Team = ({ board }: TeamProps) => {
  const { assignees } = useBoardTeam(board);

  const transitions = useTransition(
    assignees.slice(0, 3),
    item => item.username,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    }
  );

  return (
    <div className='flex'>
      {transitions.map(
        ({ item, key, props: tprops }) =>
          item && (
            <animated.div
              key={key}
              style={{ marginLeft: '-.4rem', ...tprops }}
              className='assignee'
            >
              <Avatar
                key={item.username}
                imgUrl={item.photo}
                username={item.username}
                boxShadowColor={'#2d3748'}
              />
            </animated.div>
          )
      )}
      {assignees.length > 3 && (
        <Counter className='ml-2' number={assignees.length - 3} />
      )}
    </div>
  );
};

export default observer(Team);