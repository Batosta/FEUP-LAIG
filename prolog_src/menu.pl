% Calls the initial menu
firstMenu :-
	printFirstMenu.

% Shows the initial menu
printFirstMenu :-
	write('______________________________________________'), nl,
	write('                                              '), nl,
	write('                  KNIGHT LINE                 '), nl,
	write('                                              '), nl,
	write('                                              '), nl,
	write('                                              '), nl,
	write('          Joao Nuno Rodrigues Ferreira        '), nl,
	write('      Joao Miguel Vaz Tello da Gama Amaral    '), nl,
	write('______________________________________________'), nl, nl,
	mainMenu.

% Shows the main menu with all the possible options
mainMenu :-
	write('1. Player vs Player'), nl,
	write('2. Player vs Computer'), nl,
	write('3. Computer vs Computer'), nl,
	write('4. Instructions'), nl,
	write('0. Exit'), nl, nl,
	write('Please insert a valid option: '),
	read(Input),
	handleInput(Input).

% Exits the game
handleInput(0).
% Player vs Player
handleInput(1) :-
	playPLPL.
% Player vs Computer. Allows the user to choose the difficulty of the game
handleInput(2) :-
	write('Choose the game level'), nl,
	write('1. Easy'), nl,
	write('2. Hard'), nl,
	write('Please insert a valid option: '),
	read(Level),
	level(Level).
% Computer vs Computer	
handleInput(3) :-
	playPCPC.
% Instructions of the game
handleInput(4) :-
	nl, write('Each player starts with one stack of twenty pieces each.'), nl,
	write('The winner is the player that is able to move his pieces in such a way that there are four consecutive stacks in the same direction of the same color.'), nl,
	write('To complete a move, the user must choose one of his stacks and move a part of it in an L shape into a tile that is empty and that has at least one adjacent stack.'), nl,
	write('Finally, the same user must choose how many pieces he wishes to move, leaving at least one piece of the stack behind.'), nl,
	write('The player that starts can only move one piece of the stack in the first move'), nl, nl,
	mainMenu.
% Handles invalid inputs
handleInput(_Other) :-
	write('Invalid input.'), nl,
	write('Please insert a valid option: '),
	read(Input),
	handleInput(Input).

% Player vs Computer. Easy difficulty
level(1):-
	playPLPC(1).
% Player vs Computer. Hard difficulty
level(2):-
	playPLPC(2).
% Player vs Computer. Invalid difficulty
level(_Other) :-
	write('Invalid input.'), nl,
	write('Please insert a valid option: '),
	read(Level),
	level(Level).