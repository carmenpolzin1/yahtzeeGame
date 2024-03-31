import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Board from '../../src/app/components/board';
import DiceRow from '../../src/app/components/dice_row';
import { LocalPlayers } from '@/models/localPlayers';
import { Player } from '@/models/player';
import { ScoreEvaluator } from '@/models/scoreEvaluator';
import { ScoreCategory as SC } from '@/models/enums';
import { Dice } from '@/models/dice';

// Board Mocks
// Mock player data
const mockPlayer1 = new Player('Player 1');
const mockPlayer2 = new Player('Player 2');

// Mock local players data
const mockLocalPlayers = new LocalPlayers([mockPlayer1, mockPlayer2]);

// Mock potential scores data
const mockPotentialScores = new ScoreEvaluator({ dice: [1, 1, 3, 4, 5], rollDice() {}, rollDiceByIndex() {}});

// Mock onScoreSelect function
const mockOnScoreSelect = jest.fn();

// DiceRow mocks
// mock dice
const mockDice = new Dice();

// mock roll dice
const rollDice = jest.fn();

describe('Board component', () => {
  beforeEach(() => {
    // Reset mock function calls before each test
    jest.clearAllMocks();
  });

  test('renders board with the upper section correctly', () => {
    const { getByText } = render(
      <Board
        currentPlayers={mockLocalPlayers}
        potentialScores={mockPotentialScores}
        onScoreSelect={mockOnScoreSelect}
        diceRolled={false}
      />
    );

    // Verify the presence of upper section title
    expect(getByText('UPPER SECTION')).toBeInTheDocument();
  });

  test('renders board with lower section correctly', () => {
    const { getByText } = render(
      <Board
        currentPlayers={mockLocalPlayers}
        potentialScores={mockPotentialScores}
        onScoreSelect={mockOnScoreSelect}
        diceRolled={false}
      />
    );

    // Verify the presence of lower section title
    expect(getByText('LOWER SECTION')).toBeInTheDocument();
  });
});

test('renders dice row with roll button and is clickable', () => {
  const { getByText } = render(
    <DiceRow 
      dice={mockDice}
      rollDice={rollDice}
      diceRolled={false}
      playerName={""}
    />
  );

  expect(getByText('ROLL')).toBeInTheDocument();

  fireEvent.click(getByText('ROLL'));

  expect(rollDice).toHaveBeenCalled();
})

test('renders dice row with 5 dice', () => {
  const { getByTestId } = render(
    <DiceRow 
      dice={mockDice}
      rollDice={rollDice}
      diceRolled={false}
      playerName={""}
    />
  );

  const diceContainer = getByTestId('dice-container');

  expect(diceContainer.querySelectorAll('.rounded-full').length).toBe(5);
});

test('dice are selectable and unselectable', () => {
  const { getByTestId } = render(
    <DiceRow 
      dice={mockDice}
      rollDice={rollDice}
      diceRolled={true}
      playerName={""}
    />
  );

  const dice = getByTestId('dice-container').querySelectorAll('.rounded-full');

  fireEvent.click(dice[0]);

  expect(dice[0]).toHaveClass('bg-gray-400');

  fireEvent.click(dice[0]);

  expect(dice[0]).toHaveClass('bg-white');
});
