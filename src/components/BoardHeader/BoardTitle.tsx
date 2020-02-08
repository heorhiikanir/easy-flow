import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import Heading from '../shared/Heading';
import styled from 'styled-components';
import { Input } from '../shared';

interface BoardTitleProps {
  boardTitle: string;
  boardId: string;
  editable?: boolean;
}

interface State {
  isOpen: boolean;
  newTitle: string;
}

class BoardTitle extends Component<BoardTitleProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newTitle: props.boardTitle,
    };
  }

  handleClick = () => {
    this.setState({ isOpen: true });
  };

  handleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  submitTitle = () => {
    const { boardId, boardTitle } = this.props;
    const { newTitle } = this.state;
    if (newTitle === '') return;
    if (boardTitle !== newTitle) {
      firebase
        .firestore()
        .collection('boards')
        .doc(boardId)
        .update({
          title: newTitle,
        });
    }
    this.setState({ isOpen: false });
  };

  revertTitle = () => {
    const { boardTitle } = this.props;
    this.setState({ newTitle: boardTitle, isOpen: false });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.submitTitle();
    } else if (event.keyCode === 27) {
      this.revertTitle();
    }
  };

  handleFocus = event => {
    event.target.select();
  };

  render() {
    const { isOpen, newTitle } = this.state;
    const { boardTitle, editable } = this.props;

    return (
      <div>
        {isOpen && editable ? (
          <Input
            type='text'
            autoFocus
            value={newTitle}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onBlur={this.revertTitle}
            onFocus={this.handleFocus}
            spellCheck={false}
          />
        ) : (
          <BoardTitleButton onClick={this.handleClick}>
            <Heading text={boardTitle} />
          </BoardTitleButton>
        )}
      </div>
    );
  }
}

export default BoardTitle;

const BoardTitleButton = styled.button`
  display: flex;
  min-width: 0;
  padding: 6px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  transition: background 0.1s;
  cursor: pointer;

  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.2);
  }
`;
