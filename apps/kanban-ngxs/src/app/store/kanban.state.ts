import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { KanbanStateModel, defaultKanbanState } from './kanban.state.model';
import { SetBoard, AddCard, DeleteCard, MoveCard } from './kanban.actions';
import { KanbanBoard, KanbanCard } from '@kanban-workspace/shared';

@State<KanbanStateModel>({
  name: 'kanban',
  defaults: defaultKanbanState
})
@Injectable()
export class KanbanState {
  
  @Selector()
  static board(state: KanbanStateModel): KanbanBoard | null {
    return state.board;
  }

  @Selector()
  static columns(state: KanbanStateModel) {
    return state.board?.columns || [];
  }

  @Selector()
  static totalCards(state: KanbanStateModel): number {
    return state.board?.columns.reduce((sum, col) => sum + col.cards.length, 0) || 0;
  }

  @Action(SetBoard)
  setBoard(ctx: StateContext<KanbanStateModel>, action: SetBoard) {
    ctx.patchState({
      board: action.board
    });
  }

  @Action(AddCard)
  addCard(ctx: StateContext<KanbanStateModel>, action: AddCard) {
    const state = ctx.getState();
    if (!state.board) return;

    const updatedColumns = state.board.columns.map(col => {
      if (col.id === action.columnId) {
        return {
          ...col,
          cards: [...col.cards, action.card]
        };
      }
      return col;
    });

    ctx.patchState({
      board: {
        ...state.board,
        columns: updatedColumns
      }
    });
  }

  @Action(DeleteCard)
  deleteCard(ctx: StateContext<KanbanStateModel>, action: DeleteCard) {
    const state = ctx.getState();
    if (!state.board) return;

    const updatedColumns = state.board.columns.map(col => {
      if (col.id === action.columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== action.cardId)
        };
      }
      return col;
    });

    ctx.patchState({
      board: {
        ...state.board,
        columns: updatedColumns
      }
    });
  }

  @Action(MoveCard)
  moveCard(ctx: StateContext<KanbanStateModel>, action: MoveCard) {
    const state = ctx.getState();
    if (!state.board) return;

    let cardToMove: KanbanCard | null = null;
    
    const updatedColumns = state.board.columns.map(col => {
      if (col.id === action.fromColumnId) {
        const card = col.cards.find(c => c.id === action.cardId);
        if (card) {
          cardToMove = card;
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== action.cardId)
          };
        }
      }
      return col;
    });

    if (!cardToMove) return;

    const finalColumns = updatedColumns.map(col => {
      if (col.id === action.toColumnId) {
        return {
          ...col,
          cards: [...col.cards, cardToMove as KanbanCard]
        };
      }
      return col;
    });

    ctx.patchState({
      board: {
        ...state.board,
        columns: finalColumns
      }
    });
  }
}
